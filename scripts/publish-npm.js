#!/usr/bin/env node

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import readline from 'readline';

const execAsync = promisify(exec);
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function main() {
  try {
    // 1. 确保工作目录干净
    console.log('检查 git 工作目录...');
    const { stdout: gitStatus } = await execAsync('git status --porcelain');
    
    if (gitStatus.trim() !== '') {
      console.log('警告: Git 工作目录不干净。建议先提交或暂存更改。');
      const answer = await question('是否继续? (y/n): ');
      if (answer.toLowerCase() !== 'y') {
        console.log('操作已取消');
        process.exit(0);
      }
    }

    // 2. 确保登录到 npm
    console.log('检查 npm 登录状态...');
    try {
      await execAsync('npm whoami');
      console.log('已登录到 npm');
    } catch (error) {
      console.log('您尚未登录到 npm。请先登录:');
      await execAsync('npm login', { stdio: 'inherit' });
    }

    // 3. 构建库
    console.log('构建库...');
    await execAsync('npm run build:lib', { stdio: 'inherit' });
    
    // 4. 发布到 npm
    console.log('准备发布到 npm...');
    
    // 读取当前版本
    const packageJson = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'package.json'), 'utf8'));
    console.log(`当前版本: ${packageJson.version}`);
    
    // 询问是否需要更新版本
    const updateVersion = await question('是否更新版本号? (y/n): ');
    
    if (updateVersion.toLowerCase() === 'y') {
      const versionType = await question('请选择版本更新类型 (patch/minor/major): ');
      if (['patch', 'minor', 'major'].includes(versionType)) {
        await execAsync(`npm version ${versionType}`, { stdio: 'inherit' });
      } else {
        console.log('无效的版本类型，跳过版本更新');
      }
    }
    
    // 最后发布
    console.log('正在发布到 npm...');
    await execAsync('npm publish', { stdio: 'inherit' });
    
    console.log('发布成功!');
    
    // 5. 推送标签到远程
    const pushTags = await question('是否推送 git 标签到远程? (y/n): ');
    if (pushTags.toLowerCase() === 'y') {
      await execAsync('git push --follow-tags', { stdio: 'inherit' });
      console.log('标签已推送到远程');
    }

  } catch (error) {
    console.error('发布过程中出错:', error);
  } finally {
    rl.close();
  }
}

main();
