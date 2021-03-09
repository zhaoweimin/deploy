#!/usr/bin/env node

// 件头部必须有 #!/usr/bin/env node 这么一行，意思是使用 node 进行脚本的解释程序，那下面的就可以使用 node 的语法了；
const packageJson = require('../package.json');
const fs = require('fs')
// const path = require('path')
const { checkDeployConfig, underlineLog, infoLog } = require('../utils/index');
const deploy = require('../lib/deploy');
const deployInit = require('../lib/init');

const deployPath = process.cwd()
const deployConfigPath = `${deployPath}/deploy.config.js`;

const version = packageJson.version

// run
function  run(argv) {
  if (argv[0] === '-v' || argv[0] === '--version') {
    console.log(`  version is ${version}`);
  } else if (argv[0] === '-h' || argv[0] === '--help') {
    console.log('  usage:\n');
    console.log('  -v --version [show version]\n');
    console.log('  init  生成配置文件deploy.config.js');
  } else if (argv[0] === 'init') {
    deployInit(deployConfigPath)
  } else {
    // 判断配置文件是否存在
    if (fs.existsSync(deployConfigPath)) {
      deployMian(argv);
    } else {
      infoLog(`缺少部署文件${underlineLog(deploy.confog.js)}，请运行${underlineLog('deploy init')}下载部署配置`);
    }
  }
}

async function deployMian(argv) {
  const deployConfigs = checkDeployConfig(deployConfigPath)
  deployConfigs.forEach(config => {
    const { projectName, name, command } = config
    if(command === argv[0]) {
      console.log(`${underlineLog(projectName)}项目${underlineLog(name)}部署`)
      deploy(config)
    }
  })
}

run(process.argv.slice(2))