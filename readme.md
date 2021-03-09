前端自动部署 cli 


## 安装
```
npm i z-deploy-cli -g
```

## 基础指令
```
deploy -h  // 查看指令
deploy -v  // 查看版本
deploy init // 生成配置文件
```

## 部署前配置文件
deploy.config.js
```
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
    webDir: '/opt/html',  // // 测试环境web目录 
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
```
## 部署指令
```
deploy [env]  // 部署到不同环境
根据上面配置文件
deploy dev    // 部署到测试环境
deploy prod   // 部署到生产环境
```

## 注意事项
打包到服务器的是文件夹，所以最后部署完成的时候
`webDir`会跟`distPath`的文件夹