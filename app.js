// 引入express 第三方包
const express = require('express')

// 引入 router 路由模块
var router = require('./router')

// 引入获取数据的第三方包(post)
var bodyParser = require('body-parser')

// 创建 app 对象
const app = express()

// 提供跨域(curs)
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:8080')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    res.header('Access-Control-Allow-Headers', 'Content-Type')
    // res.header('Access-Control-Allow-Headers', 'application/x-www-form-urlencoded')
    res.header('Access-Control-Allow-Credentials','true')
    next()
};
// 使用跨域设置
app.use(allowCrossDomain)

// 使用第三方包获取参数
// 编码问题(请求报文中Content-Type: application/json;charset=UTF-8时需加)
app.use(bodyParser.json())
// res.header('Access-Control-Allow-Headers', 'application/x-www-form-urlencoded')
app.use(bodyParser.urlencoded({ extended: false }))

// 访问静态文件（图片
app.use('/user_head_portrait',express.static('user_head_portrait'))

// 使用路由
app.use(router)

// 开启服务器的监听
app.listen(3001, () => console.log('Example app listening on port 3001!'))
