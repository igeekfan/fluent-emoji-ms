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

console.log('📦 准备部署示例网站到GitHub Pages...')

// 确保构建目录存在
if (!fs.existsSync(webBuildDir)) {
  console.error('❌ 构建目录不存在，请先运行 npm run build:web')
  process.exit(1)
}

try {
  // 创建临时分支
  console.log('🔄 创建临时gh-pages分支...')
  execSync('git checkout --orphan gh-pages-temp', { stdio: 'inherit' })

  // 清理临时分支上的文件
  execSync('git rm -rf .', { stdio: 'inherit' })

  // 复制构建文件到根目录
  console.log('📋 复制构建文件...')
  fs.cpSync(webBuildDir, projectRoot, { recursive: true })

  // 创建 .nojekyll 文件以禁用GitHub Pages中的Jekyll处理
  fs.writeFileSync(path.join(projectRoot, '.nojekyll'), '')

  // 添加所有文件并提交
  console.log('📝 添加文件并提交...')
  execSync('git add .', { stdio: 'inherit' })
  execSync('git commit -m "Deploy demo site to GitHub Pages"', { stdio: 'inherit' })

  // 强制更新gh-pages分支
  console.log('🚀 推送到gh-pages分支...')
  execSync('git push origin gh-pages-temp:gh-pages -f', { stdio: 'inherit' })

  // 清理：切回原分支
  const originalBranch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim()
  console.log(`🧹 清理：切回 ${originalBranch} 分支...`)
  execSync(`git checkout ${originalBranch}`, { stdio: 'inherit' })
  execSync('git branch -D gh-pages-temp', { stdio: 'inherit' })

  console.log('✅ 部署完成! 网站将在几分钟后在 GitHub Pages 上可用。')
} catch (error) {
  console.error('❌ 部署过程中出错:', error)
  process.exit(1)
}
