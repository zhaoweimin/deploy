module.exports = Object.freeze({
  projectName: '项目名称',
  dev: { // 测试环境
    name: '测试环境',
    script: "npm run build", // 测试环境打包脚本
    host: '127.0.0.1', // 测试服务器地址
    port: 22, // ssh port，一般默认22
    username: 'root', // 登录服务器用户名
    password: '123456', // 登录服务器密码
    distPath: 'dist',  // 本地打包dist目录
    webDir: '/opt/html',  // // 测试环境服务器地址
  },
  prod: {  // 线上环境
    name: '线上环境',
    script: "npm run build", // 线上环境打包脚本
    host: '127.0.0.1', // 线上服务器地址
    port: 22, // ssh port，一般默认22
    username: 'root', // 登录服务器用户名
    password: '123456', // 登录服务器密码
    distPath: 'dist',  // 本地打包dist目录
    webDir: '/opt/html' // 线上环境web目录
  }
})