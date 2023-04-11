module.exports = {
  publicPath: './',
  // 所有 webpack-dev-server 的选项都支持。可以在本地真机打开
    devServer: {
      host: "192.168.1.90",
      port: 8081, // 端口号
      https: false,
      open: false, //配置自动启动浏览器
    }
}