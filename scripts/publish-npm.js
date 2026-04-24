#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import readline from 'readline'
import { spawn } from 'child_process'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')
const packageDefinitions = [
  { name: '@fluent-emoji-ms/core', dir: 'packages/core' },
  { name: '@fluent-emoji-ms/vue', dir: 'packages/vue' },
  { name: '@fluent-emoji-ms/react', dir: 'packages/react' },
  { name: '@fluent-emoji-ms/svelte', dir: 'packages/svelte' }
]

function getArgValue(args, key) {
  const inline = args.find((item) => item.startsWith(`${key}=`))
  if (inline) {
    return inline.slice(key.length + 1)
  }

  const index = args.indexOf(key)
  if (index === -1 || index === args.length - 1) {
    return undefined
  }

  return args[index + 1]
}

function parseArgs(argv) {
  return {
    bump: getArgValue(argv, '--bump'),
    version: getArgValue(argv, '--version'),
    tag: getArgValue(argv, '--tag') ?? 'latest',
    dryRun: argv.includes('--dry-run'),
    yes: argv.includes('--yes'),
    generate: argv.includes('--generate'),
    skipGenerate: argv.includes('--skip-generate'),
    skipBuild: argv.includes('--skip-build'),
    skipTest: argv.includes('--skip-test'),
    skipLogin: argv.includes('--skip-login'),
    skipGitCheck: argv.includes('--skip-git-check')
  }
}

function createQuestion(options) {
  if (options.yes) {
    return async () => ''
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  const ask = (query) => new Promise((resolve) => rl.question(query, resolve))
  ask.close = () => rl.close()
  return ask
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function writeJson(filePath, content) {
  fs.writeFileSync(filePath, `${JSON.stringify(content, null, 2)}\n`)
}

function getPackageInfo() {
  return packageDefinitions.map((definition) => {
    const filePath = path.join(projectRoot, definition.dir, 'package.json')
    const manifest = readJson(filePath)
    return {
      ...definition,
      filePath,
      version: manifest.version
    }
  })
}

function incrementVersion(version, releaseType) {
  const match = version.match(/^(\d+)\.(\d+)\.(\d+)$/)
  if (!match) {
    throw new Error(`不支持的版本格式: ${version}`)
  }

  const major = Number(match[1])
  const minor = Number(match[2])
  const patch = Number(match[3])

  if (releaseType === 'patch') {
    return `${major}.${minor}.${patch + 1}`
  }

  if (releaseType === 'minor') {
    return `${major}.${minor + 1}.0`
  }

  if (releaseType === 'major') {
    return `${major + 1}.0.0`
  }

  throw new Error(`不支持的版本升级类型: ${releaseType}`)
}

function isValidSemver(version) {
  return /^\d+\.\d+\.\d+$/.test(version)
}

function formatCommand(command, args, cwd) {
  const rendered = [command, ...args].join(' ')
  return cwd ? `${rendered}  (cwd: ${cwd})` : rendered
}

async function runCommand(command, args, options = {}) {
  const {
    cwd = projectRoot,
    captureOutput = false,
    allowFailure = false,
    dryRun = false
  } = options

  if (dryRun) {
    console.log(`[dry-run] ${formatCommand(command, args, cwd)}`)
    return { stdout: '', stderr: '', exitCode: 0 }
  }

  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      shell: process.platform === 'win32',
      stdio: captureOutput ? ['ignore', 'pipe', 'pipe'] : 'inherit'
    })

    let stdout = ''
    let stderr = ''

    if (captureOutput) {
      child.stdout?.on('data', (chunk) => {
        stdout += chunk.toString()
      })
      child.stderr?.on('data', (chunk) => {
        stderr += chunk.toString()
      })
    }

    child.on('close', (code) => {
      const exitCode = code ?? 0
      if (exitCode !== 0 && !allowFailure) {
        reject(new Error(`${formatCommand(command, args, cwd)} 失败，退出码 ${exitCode}`))
        return
      }

      resolve({ stdout, stderr, exitCode })
    })

    child.on('error', (error) => reject(error))
  })
}

async function ensureCleanGitStatus(options, ask) {
  if (options.skipGitCheck) {
    console.log('跳过 git 状态检查')
    return
  }

  const { stdout } = await runCommand('git', ['status', '--porcelain'], {
    captureOutput: true,
    dryRun: options.dryRun
  })

  if (!stdout.trim()) {
    console.log('git 工作目录干净')
    return
  }

  console.log('检测到未提交改动。')
  if (options.yes) {
    throw new Error('检测到未提交改动，--yes 模式下不会继续发布。请先提交或增加 --skip-git-check。')
  }

  const answer = await ask('工作区不干净，是否继续发布? (y/N): ')
  if (!/^y(es)?$/i.test(answer.trim())) {
    throw new Error('发布已取消')
  }
}

async function ensureNpmLogin(options) {
  if (options.skipLogin) {
    console.log('跳过 npm 登录检查')
    return
  }

  const whoami = await runCommand('npm', ['whoami'], {
    captureOutput: true,
    allowFailure: true,
    dryRun: options.dryRun
  })

  if (whoami.exitCode === 0) {
    const account = whoami.stdout.trim()
    if (account) {
      console.log(`当前 npm 账号: ${account}`)
    }
    return
  }

  console.log('当前未登录 npm，准备执行 npm login ...')
  await runCommand('npm', ['login'], {
    dryRun: options.dryRun
  })
}

async function resolveVersion(targetVersion, options, ask) {
  const packageInfo = getPackageInfo()
  const currentVersions = [...new Set(packageInfo.map((item) => item.version))]

  if (currentVersions.length !== 1 && !targetVersion) {
    throw new Error(`检测到包版本不一致: ${currentVersions.join(', ')}。请先对齐版本，或通过 --version 指定目标版本。`)
  }

  const currentVersion = currentVersions[0]
  if (targetVersion) {
    return { currentVersion, nextVersion: targetVersion }
  }

  if (options.yes || options.dryRun) {
    return { currentVersion, nextVersion: currentVersion }
  }

  console.log(`当前 workspace 版本: ${currentVersion}`)
  const answer = await ask('版本策略: keep / patch / minor / major / custom ? (keep): ')
  const normalized = answer.trim().toLowerCase()

  if (!normalized || normalized === 'keep') {
    return { currentVersion, nextVersion: currentVersion }
  }

  if (['patch', 'minor', 'major'].includes(normalized)) {
    return {
      currentVersion,
      nextVersion: incrementVersion(currentVersion, normalized)
    }
  }

  if (normalized === 'custom') {
    const customVersion = (await ask('请输入自定义版本号，例如 0.2.0: ')).trim()
    if (!isValidSemver(customVersion)) {
      throw new Error(`无效的自定义版本号: ${customVersion}`)
    }
    return { currentVersion, nextVersion: customVersion }
  }

  throw new Error(`无法识别的版本策略: ${answer}`)
}

function updateWorkspaceVersions(nextVersion) {
  const rootPackagePath = path.join(projectRoot, 'package.json')
  const rootManifest = readJson(rootPackagePath)
  rootManifest.version = nextVersion
  writeJson(rootPackagePath, rootManifest)

  for (const definition of packageDefinitions) {
    const packagePath = path.join(projectRoot, definition.dir, 'package.json')
    const manifest = readJson(packagePath)
    manifest.version = nextVersion
    writeJson(packagePath, manifest)
  }
}

async function confirmPlan(versionPlan, options, ask) {
  console.log('发布计划:')
  console.log(`- 目标版本: ${versionPlan.nextVersion}`)
  console.log(`- npm tag: ${options.tag}`)
  console.log(`- 生成 emoji 数据: ${options.generate && !options.skipGenerate ? '是' : '否'}`)
  console.log(`- 运行 core 测试: ${options.skipTest ? '否' : '是'}`)
  console.log(`- 构建 packages: ${options.skipBuild ? '否' : '是'}`)
  console.log(`- 发布顺序: ${packageDefinitions.map((item) => item.name).join(' -> ')}`)

  if (options.yes) {
    return
  }

  const answer = await ask('确认开始执行? (y/N): ')
  if (!/^y(es)?$/i.test(answer.trim())) {
    throw new Error('发布已取消')
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const ask = createQuestion(options)

  try {
    if (options.version && !isValidSemver(options.version)) {
      throw new Error(`无效的版本号: ${options.version}`)
    }

    if (options.bump && !['patch', 'minor', 'major'].includes(options.bump)) {
      throw new Error(`无效的版本升级类型: ${options.bump}`)
    }

    const requestedVersion = options.version || (options.bump ? incrementVersion(getPackageInfo()[0].version, options.bump) : undefined)

    await ensureCleanGitStatus(options, ask)

    if (options.generate && !options.skipGenerate) {
      console.log('生成 emoji 数据...')
      await runCommand('pnpm', ['run', 'generate-emoji-list'], {
        dryRun: options.dryRun
      })
    }

    if (!options.skipTest) {
      console.log('运行 core 测试...')
      await runCommand('pnpm', ['run', 'test:core'], {
        dryRun: options.dryRun
      })
    }

    if (!options.skipBuild) {
      console.log('构建 packages...')
      await runCommand('pnpm', ['run', 'build:packages'], {
        dryRun: options.dryRun
      })
    }

    const versionPlan = await resolveVersion(requestedVersion, options, ask)

    await confirmPlan(versionPlan, options, ask)

    if (versionPlan.nextVersion !== versionPlan.currentVersion) {
      console.log(`更新 workspace 版本: ${versionPlan.currentVersion} -> ${versionPlan.nextVersion}`)
      if (!options.dryRun) {
        updateWorkspaceVersions(versionPlan.nextVersion)
      }
    }

    await ensureNpmLogin(options)

    for (const definition of packageDefinitions) {
      console.log(`发布 ${definition.name} ...`)
      await runCommand('pnpm', ['publish', '--access', 'public', '--no-git-checks', '--tag', options.tag], {
        cwd: path.join(projectRoot, definition.dir),
        dryRun: options.dryRun
      })
    }

    console.log('所有 packages 发布完成。')
    if (versionPlan.nextVersion !== versionPlan.currentVersion) {
      console.log(`当前 workspace 已更新为版本 ${versionPlan.nextVersion}，如需保留版本变更，请继续提交 package.json。`)
    }
  } catch (error) {
    console.error(`发布过程中出错: ${error.message}`)
    process.exitCode = 1
  } finally {
    ask.close?.()
  }
}

main()
