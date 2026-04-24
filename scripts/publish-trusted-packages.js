#!/usr/bin/env node

import fs from 'fs'
import os from 'os'
import path from 'path'
import { spawnSync } from 'child_process'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')

const packageDefinitions = [
  { name: '@igeekfan/fluent-emoji-ms-core', dir: 'packages/core' },
  { name: '@igeekfan/fluent-emoji-ms-vue', dir: 'packages/vue' },
  { name: '@igeekfan/fluent-emoji-ms-react', dir: 'packages/react' },
  { name: '@igeekfan/fluent-emoji-ms-svelte', dir: 'packages/svelte' }
]

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const provenance = !args.includes('--no-provenance')
const requireExistingPackages = args.includes('--require-existing-packages')
const tag = getArgValue(args, '--tag') ?? 'latest'

function getArgValue(inputArgs, key) {
  const inline = inputArgs.find((item) => item.startsWith(`${key}=`))
  if (inline) {
    return inline.slice(key.length + 1)
  }

  const index = inputArgs.indexOf(key)
  if (index === -1 || index === inputArgs.length - 1) {
    return undefined
  }

  return inputArgs[index + 1]
}

function formatCommand(command, commandArgs, cwd) {
  return `${command} ${commandArgs.join(' ')}  (cwd: ${cwd})`
}

function runCommand(command, commandArgs, options = {}) {
  const {
    cwd = projectRoot,
    captureOutput = false,
    allowFailure = false,
    skipInDryRun = true
  } = options

  if (dryRun && skipInDryRun) {
    console.log(`[dry-run] ${formatCommand(command, commandArgs, cwd)}`)
    return { stdout: '', stderr: '', exitCode: 0 }
  }

  const result = spawnSync(command, commandArgs, {
    cwd,
    encoding: 'utf8',
    stdio: captureOutput ? 'pipe' : 'inherit'
  })

  const exitCode = result.status ?? 0
  if (exitCode !== 0 && !allowFailure) {
    throw new Error(`${formatCommand(command, commandArgs, cwd)} failed with exit code ${exitCode}`)
  }

  return {
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
    exitCode
  }
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function getPackages() {
  return packageDefinitions.map((definition) => {
    const manifestPath = path.join(projectRoot, definition.dir, 'package.json')
    const manifest = readJson(manifestPath)
    return {
      ...definition,
      manifestPath,
      packageDir: path.join(projectRoot, definition.dir),
      version: manifest.version
    }
  })
}

function parsePublishedVersion(stdout) {
  const trimmed = stdout.trim()
  if (!trimmed) {
    return null
  }

  try {
    return JSON.parse(trimmed)
  } catch {
    return trimmed
  }
}

function readPublishedVersion(packageSpec) {
  const result = runCommand('npm', ['view', packageSpec, 'version', '--json'], {
    captureOutput: true,
    allowFailure: true,
    skipInDryRun: false
  })

  if (result.exitCode !== 0) {
    return null
  }

  return parsePublishedVersion(result.stdout)
}

function isPackagePublished(packageName) {
  return readPublishedVersion(packageName) !== null
}

function isVersionPublished(packageName, version) {
  const publishedVersion = readPublishedVersion(`${packageName}@${version}`)
  if (publishedVersion === null) {
    return false
  }

  if (Array.isArray(publishedVersion)) {
    return publishedVersion.includes(version)
  }

  return publishedVersion === version
}

function getTarballFileName(packageName, version) {
  return `${packageName.replace(/^@/, '').replace(/\//g, '-')}-${version}.tgz`
}

function getPackageScope(packageName) {
  const match = packageName.match(/^@([^/]+)\//)
  return match ? `@${match[1]}` : null
}

function packPackage(packageInfo, outputDir) {
  if (dryRun) {
    runCommand('pnpm', ['pack', '--pack-destination', outputDir], {
      cwd: packageInfo.packageDir,
      captureOutput: true
    })

    return path.join(outputDir, getTarballFileName(packageInfo.name, packageInfo.version))
  }

  const result = runCommand('pnpm', ['pack', '--pack-destination', outputDir], {
    cwd: packageInfo.packageDir,
    captureOutput: true
  })

  const fileName = result.stdout
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .findLast((line) => line.endsWith('.tgz'))

  if (!fileName) {
    throw new Error(`Unable to determine tarball name for ${packageInfo.name}`)
  }

  return path.isAbsolute(fileName) ? fileName : path.join(outputDir, fileName)
}

function publishTarball(packageInfo, tarballPath) {
  const publishArgs = ['publish', tarballPath]

  if (provenance) {
    publishArgs.push('--provenance')
  }

  publishArgs.push('--access', 'public', '--tag', tag)

  const result = runCommand('npm', publishArgs, {
    cwd: projectRoot,
    captureOutput: true,
    allowFailure: true
  })

  if (result.stdout) {
    process.stdout.write(result.stdout)
  }

  if (result.stderr) {
    process.stderr.write(result.stderr)
  }

  if (result.exitCode === 0) {
    return
  }

  const output = `${result.stdout}\n${result.stderr}`
  const packageScope = getPackageScope(packageInfo.name)

  if (output.includes('Scope not found') && packageScope) {
    throw new Error(
      `npm rejected ${packageInfo.name}@${packageInfo.version} because the scope ${packageScope} does not exist on npm, or the publishing account is not allowed to publish under that scope. Create the npm user/org scope first and make sure your publishing account belongs to it, or change the package scope to one you already own.`
    )
  }

  throw new Error(`npm publish failed for ${packageInfo.name}@${packageInfo.version}`)
}

function ensureRepositoryMetadata() {
  const missingRepository = getPackages().filter((packageInfo) => {
    const manifest = readJson(packageInfo.manifestPath)
    return !manifest.repository?.url
  })

  if (missingRepository.length > 0) {
    throw new Error(`Missing repository metadata for: ${missingRepository.map((item) => item.name).join(', ')}`)
  }
}

function ensureTrustedPublishingPackagesExist(packages) {
  const missingPackages = packages.filter((packageInfo) => !isPackagePublished(packageInfo.name))

  if (missingPackages.length === 0) {
    return
  }

  throw new Error(
    `Trusted publishing cannot bootstrap brand-new npm packages that do not exist yet: ${missingPackages
      .map((item) => item.name)
      .join(', ')}. Run the Bootstrap Publish Packages workflow once with a temporary granular npm publish token, then retry publish-packages.yml.`
  )
}

function main() {
  ensureRepositoryMetadata()

  const packages = getPackages()

  if (requireExistingPackages) {
    ensureTrustedPublishingPackagesExist(packages)
  }

  const tarballDir = fs.mkdtempSync(path.join(os.tmpdir(), 'fluent-emoji-ms-publish-'))

  try {
    for (const packageInfo of packages) {
      if (!dryRun && isVersionPublished(packageInfo.name, packageInfo.version)) {
        console.log(`Skipping ${packageInfo.name}@${packageInfo.version} because it is already published.`)
        continue
      }

      console.log(`Publishing ${packageInfo.name}@${packageInfo.version}...`)
      const tarballPath = packPackage(packageInfo, tarballDir)
      publishTarball(packageInfo, tarballPath)
    }
  } finally {
    if (!dryRun) {
      fs.rmSync(tarballDir, { recursive: true, force: true })
    }
  }
}

try {
  main()
} catch (error) {
  console.error(error.message)
  process.exitCode = 1
}