const path = require('path')
const fs = require('fs')
const shell = require('shelljs') // 执行shell命令
const ora = require('ora'); //loading
const zipFile = require('compressing')// 压缩zip
const { NodeSSH } = require('node-ssh') // ssh连接服务器

// 提示方法
const { successLog, errorLog, infoLog, underlineLog } = require('../utils/index');

// 变量
const projectDir = process.cwd();
const SSH = new NodeSSH();
let distDirPath, distZipPath

// 第一步 打包代码 build
const execBuild = async (script) => {
  return new Promise(async (resolve, reject) => {
    try {
      const loading = ora('(1) 项目开始打包')
      loading.start()
      underlineLog(script)
      const res = await shell.exec(script); //执行打包指令
      loading.stop()
      if (res.code == 0) {
        successLog('打包成功')
        resolve()
      } else {
        errorLog('项目打包失败!')
        process.exit(1)//退出流程
      }
    } catch (err) {
      errorLog(err)
      process.exit(1)//退出流程
    }
  })
}

// 第二步 开始压缩zip
const startZip = async (distPath) => {
  try {
    infoLog('(2) 压缩成zip')
    distDirPath = path.resolve(projectDir, distPath)
    distZipPath = path.resolve(projectDir, distPath + '.zip')
    await zipFile.zip.compressDir(distDirPath, distZipPath)
    successLog('压缩成功');
  } catch (err) {
    errorLog(err)
    process.exit(1)//退出流程
  }
}

// 第三步 连接服务器 ssh
const connectSSH = async (config) => {
  infoLog('(3) 连接服务器')
  try {
    await SSH.connect({
      host: config.host,
      port: config.port,
      username: config.username,
      password: config.password,
      privateKey: config.privateKey,
      passphrase: config.passphrase
    })
    successLog('连接成功!')
  } catch (error) {
    successLog('SSH连接失败!')
    errorLog(err)
    process.exit(1)//退出流程
  }
}

// 第四步 打包代码
const uploadFile = async (webDir, distPath) => {
  try {
    infoLog(`(4)上传zip至目录${underlineLog(webDir)}`);
    await SSH.putFile(distZipPath, `${webDir}/${distPath}.zip`);
    successLog('上传成功');
  } catch (err) {
    errorLog(`zip包上传失败 ${err}`);
    process.exit(1);
  }
}

// 第五步 开始解压
const unzipFile = async (webDir, distPath) => {
  try {
    infoLog(`(5) 开始解压zip包`);
    await runCommand(`cd ${webDir}`, webDir);
    await runCommand(`unzip -o ${distPath}.zip && rm -f ${distPath}.zip`, webDir);
    successLog('解压成功');
    SSH.dispose(); //断开连接
  } catch (err) {
    errorLog(`zip包解压失败 ${err}`);
    process.exit(1);
  }
}

// 第六步 删除本地dist.zip
const deleteZip = async () => {
  return new Promise((resolve, reject) => {
    infoLog(`(6) 开始删除本地zip包`)
    fs.unlink(distZipPath, err => {
      if(err) {
        console.log(err)
        errorLog('删除zip失败')
        process.exit(1)
      }
      successLog('删除成功')
      resolve()
    })
  })
}

// 运行命令
async function runCommand(command, webDir) {
  await SSH.execCommand(command, { cwd: webDir });
}

const deploy = async (config) => {
  let { projectName, name, script, distPath, webDir } = config
  try{
    if (!script) script = 'npm run build'
    await execBuild(script)
    if (!distPath) distPath = 'dist'
    await startZip(distPath)
    await connectSSH(config)
    await uploadFile(webDir, distPath)
    await unzipFile(webDir, distPath)
    await deleteZip()
    successLog(`\n 恭喜您，${underlineLog(projectName)}项目${underlineLog(name)}部署成功了^_^\n`);
    process.exit(0);
  } catch (err) {
    errorLog(`  部署失败 ${err}`);
    process.exit(1);
  }
}


module.exports = deploy

