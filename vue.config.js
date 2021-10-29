// 这个是整个的代理流程
let proxyObj = {}
proxyObj['/'] = {
  // websocket
  ws:false,
  // 目标地址
  target:'http://localhost:8081',
  // 发送的请求头 host会被设置为target
  changeOrigin:true,
  //  重写前置路径 就是说 端口后面还有路径才能访问的到
  // 但是不需要重写 在这个地方
  // 类似于 react的 '^/api':'' 就是把一些多的东西换为空
  pathRewrite:{
    '^/':'/'
  }
}

proxyObj['/ws'] = {
  ws:true,
  target:'ws://localhost:8081',
}

module.exports = {
  devServer:{
    host:'localhost',
    port:8080,
    proxy:proxyObj
  }
}