// 导入自定义操作数据库的方法
const connect = require('./database.js')

// 导入签发与验证 JWT 的功能包
const jwt = require('jsonwebtoken')

const async = require('async')

// 访问首页
module.exports.getIndex = function(req, res) {
    // 获取文章的数据
    const article =  function(callback) {
        const sql = "SELECT * FROM article"
        connect.query(sql, function(error, results, fields) {
            if(error) throw error
    
            if(results.length >= 1) { // 判断是否有数据
                callback(null, results)
            } else {
                callback(null, { msg: '没有数据' })
            }
        })
    }

    // 获取个人信息
    const personal_information = function(callback) {
        const sql = "SELECT * FROM user"
        connect.query(sql, function(error, results, fields) {
            if(error) throw error
    
            if(results.length >= 1) { // 判断是否有数据
                callback(null, results[0])
            } else {
                callback(null, { msg: '没有数据' })
            }
        })
    }
    
    // 并行执行,但保证了 results 的结果是正确的
    async.parallel({article, personal_information}, function(error, results) {
        if(error) {
            console.log(error)
        }

        // 返回数据
        res.send(results)
    })
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
