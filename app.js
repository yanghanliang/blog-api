// 引入express 第三方包
const express = require('express')

// 引入 router 路由模块
const router = require('./router/index')

// 引入获取数据的第三方包(post)
const bodyParser = require('body-parser')

// 导入签发与验证 JWT 的功能包
const jwt = require('jsonwebtoken')

// 引入处理方法
var process = require('./process/user/index.js')

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
}
// 使用跨域设置
app.use(allowCrossDomain)

// 使用第三方包获取参数
// 编码问题(请求报文中Content-Type: application/json;charset=UTF-8时需加)
app.use(bodyParser.json())
// res.header('Access-Control-Allow-Headers', 'application/x-www-form-urlencoded')
app.use(bodyParser.urlencoded({ extended: false }))

// 访问静态文件（图片,如果不设置的话，就找不到图片
app.use('/head_portrait_url', express.static('head_portrait_url'))
app.use('/uploadFileURl', express.static('uploadFileURl'))

// 权限验证
process.verification(app)

// 登陆验证
app.use((req, res, next) => {
    const url = req.url.toLocaleLowerCase()
    let rules = new RegExp('^\\/' + app.identificationList.join('|^\\/'))
    let verification = rules.test(url)
    // 判断接口是否需要进行验证
    if (app.identificationList.length > 0 && verification) {
        // 密钥
        const secret = 'YANGHANLIANG'
        // 令牌
        const token = req.headers.authorization
        // 验证 Token
        jwt.verify(token, secret, (error, decoded) => {
            if (error) {
                // 未登录
                res.send({status: 201, msg: '身份验证失败，请登录~', type: 'token'})
            } else {
                // 已登录
                const [{ id }] = app.jurisdictionList.filter((item) => {
                    // 找到此接口的权限id
                    console.log(url, item.identification, 'item.identification')
                    if (url.includes(item.identification)) {
                        return item
                    }
                })
                console.log(decoded, 'decoded')
                const jurisdictionId = decoded.jurisdictionId ? decoded.jurisdictionId.split(',') : []
                console.log('==============', jurisdictionId, id)
                // 判断当前用户是否具备此权限
                if (jurisdictionId.includes(String(id))) {
                    next()
                } else {
                    res.send({
                        status: 201,
                        msg: '您不具备此权限'
                    })
                }
            }
        })
    } else {
        console.log('不验证')
        next()
    }
})

// 使用路由
app.use(router)

// 开启服务器的监听
app.listen(3001, () => console.log('Example app listening on port 3001!'))
