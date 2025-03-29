import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 项目目录
const projectRoot = path.resolve(__dirname, '..')
// 构建目录
const webBuildDir = path.join(projectRoot, 'dist/web')
// 临时分支名称
const tempBranch = 'gh-pages-temp'

console.log('📦 准备部署示例网站到GitHub Pages...')

// 确保构建目录存在
if (!fs.existsSync(webBuildDir)) {
  console.error('❌ 构建目录不存在，请先运行 npm run build:web')
  process.exit(1)
}

// 保存当前分支名称
let originalBranch
try {
  originalBranch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim()
  console.log(`📌 当前分支: ${originalBranch}`)
} catch (error) {
  console.error('❌ 获取当前分支失败:', error)
  process.exit(1)
}

try {
  // 检查临时分支是否存在，如果存在则删除
  try {
    console.log(`🔍 检查 ${tempBranch} 分支是否存在...`)
    execSync(`git rev-parse --verify ${tempBranch}`, { stdio: 'ignore' })
    console.log(`🗑️ 删除已存在的 ${tempBranch} 分支...`)
    execSync(`git branch -D ${tempBranch}`, { stdio: 'inherit' })
  } catch (e) {
    // 分支不存在，继续执行
  }
  
  // 创建临时分支
  console.log(`🔄 创建临时 ${tempBranch} 分支...`)
  execSync(`git checkout --orphan ${tempBranch}`, { stdio: 'inherit' })

  // 清理临时分支上的文件
  execSync('git rm -rf .', { stdio: 'inherit' })

  // 复制构建文件到根目录
  console.log('📋 复制构建文件...')
  fs.cpSync(webBuildDir, projectRoot, { 
    recursive: true,
    filter: (src) => !src.includes('node_modules')
  })

  // 创建 .nojekyll 文件以禁用GitHub Pages中的Jekyll处理
  fs.writeFileSync(path.join(projectRoot, '.nojekyll'), '')
  
  // 创建 .gitignore 文件
  fs.writeFileSync(path.join(projectRoot, '.gitignore'), `
# 部署时忽略的文件
node_modules
.DS_Store
*.log
.vscode
.idea
  `.trim())

  // 添加所有文件并提交
  console.log('📝 添加文件并提交...')
  execSync('git add -A', { stdio: 'inherit' })
  execSync('git commit -m "Deploy demo site to GitHub Pages"', { stdio: 'inherit' })

  // 强制更新gh-pages分支
  console.log('🚀 推送到gh-pages分支...')
  execSync('git push origin HEAD:gh-pages -f', { stdio: 'inherit' })

  // 清理：切回原分支
  console.log(`🧹 清理：切回 ${originalBranch} 分支...`)
  execSync(`git checkout ${originalBranch}`, { stdio: 'inherit' })
  execSync(`git branch -D ${tempBranch}`, { stdio: 'inherit' })

  console.log('✅ 部署完成! 网站将在几分钟后在 GitHub Pages 上可用。')
} catch (error) {
  console.error('❌ 部署过程中出错:', error.message)
  
  // 尝试回到原分支
  try {
    console.log(`🔄 尝试恢复到 ${originalBranch} 分支...`)
    execSync(`git checkout ${originalBranch}`, { stdio: 'inherit' })
    
    // 尝试清理临时分支
    try {
      execSync(`git branch -D ${tempBranch}`, { stdio: 'inherit' })
    } catch (e) {
      // 忽略临时分支不存在的错误
    }
  } catch (e) {
    console.error('⚠️ 恢复分支失败，请手动检查Git状态')
  }
  
  process.exit(1)
}
