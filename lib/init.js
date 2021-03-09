const fs = require('fs');
const path = require('path')
const { errorLog, successLog } = require('../utils/index')
const deployInit = (deployConfigPath) => {
  if (fs.existsSync(deployConfigPath)) {
    errorLog("配置文件已存在")
  } else {
    let config = path.resolve(__dirname, '../deploy.config.js')
    fs.writeFileSync(deployConfigPath, fs.readFileSync(config))
    successLog('配置生成成功')
  }
}

module.exports = deployInit