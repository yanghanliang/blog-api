// 导入自定义操作数据库的方法
const connect = require('./database.js')

// 导入签发与验证 JWT 的功能包
const jwt = require('jsonwebtoken')

// 访问首页
module.exports.getIndex = function(req, res) {
    
}

// 登录验证
module.exports.login = function(req, res, data) {
    const sql = "SELECT * FROM user WHERE username='"+ data.username +"' and password='" + data.password +"'"
    connect.query(sql, function(error, results, fields) {
        if(error) throw error

        if(results.length === 1) {
            // Token 数据
            const payload = {
                name: data.username,
                password: data.password
            }

            // 密钥
            const secret = 'YANGHANLIANG'

            // 签发 Token
            const token = jwt.sign(payload, secret, {
                expiresIn: '1day'
            })

            // 返回数据
            res.json({
                status: 200,
                msg: '登录成功!',
                token: token
            })
        } else {
            // 返回数据
            res.json({
                status: 401,
                msg: '用户名或密码不正确!'
            })
        }
    })
}

module.exports.article = function(req, res) {
    const sql = "SELECT * FROM article"
    connect.query(sql, function(error, results, fields) {
        if(error) throw error

        if(results.length >= 1) { // 判断是否有数据
            res.send(results) // 返回数据
        } else {
            res.json({ // 返回提示
                msg: '没有数据gg'
            })
        }
    })
}
