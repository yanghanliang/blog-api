// 引入express 第三方包
const express = require('express')

// 引入 router 路由模块
const router = require('./router/index')

// 引入获取数据的第三方包(post)
const bodyParser = require('body-parser')

// 导入签发与验证 JWT 的功能包
const jwt = require('jsonwebtoken')

// 创建 app 对象
const app = express()

// 提供跨域(CORS)
const allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    // res.header('Access-Control-Allow-Headers', 'application/x-www-form-urlencoded,Origin,X-Requested-With,Content-Type,Accept,Authorization,token')
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
app.use('/user_head_portrait', express.static('user_head_portrait'))

// 登陆验证
app.use((req, res, next) => {
    const url = req.url.toLocaleLowerCase()
    // 如果是后台操作的接口，则进行 token 验证
    if (url === '/admin' || url === '/articlelist/createtime/descending/6' || url ===  '/addcategory' || url === '/editcategory') {
        // 密钥
        const secret = 'YANGHANLIANG'
        // 令牌
        const token = req.headers.authorization
        // 验证 Token
        jwt.verify(token, secret, (error, decoded) => {
            if (error) {
                res.send({status: 201, msg: '身份验证失败，请登录~', type: 'token'})
            } else {
                next()
            }
        })
    } else {
        next()
    }
})

// 使用路由
app.use(router)

// 开启服务器的监听
app.listen(3001, () => console.log('Example app listening on port 3001!'))
