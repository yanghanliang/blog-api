/**
 *  用户
 */

// 导入自定义操作数据库的方法
const connect = require('../../database.js')
// 导入签发与验证 JWT 的功能包
const jwt = require('jsonwebtoken')
// 解决异步操作
const async = require('async')

module.exports.addUser = (req, res) => {
    const data = req.body,
        username = data.userName,
        password = data.password,
        alias = data.alias
        createtime = new Date().getTime()
    const sql = `insert into user(username, alias, password, createtime) values ('${username}', '${alias}', ${password}, ${createtime})`
    connect.query(sql, (error, results, fields) => {
        if(error) throw error
        res.send({
            status: 200,
            msg: '添加成功'
        })
    })
}

// 验证昵称是否存在
module.exports.userNameValidation = (req, res) => {
    const userName = req.query.userName
    const sql = `SELECT * FROM user WHERE alias = '${userName}'`

    connect.query(sql, (error, results, fields) => {
        if (error) throw error
        if (results.length > 0) {
            res.send({
                status: false, // 昵称存在
            })
        } else {
            res.send({
                status: true // 昵称可用
            })
        }
    })
}

// 获取用户列表
module.exports.userList = (req, res) => {
    const sql = 'SELECT * FROM user'
    connect.query(sql, (error, results, fields) => {
        if(error) throw error
        if (results.length > 0) {
            res.send({
                status: 200,
                data: results
            })
        } else {
            res.send({
                status: 201,
                data: []
            })
        }
    })
}

// 获取用户权限(前端-不需要传任何参数，从token中获取权限)
module.exports.userJurisdiction = (req, res) => {
    // 密钥
    const secret = 'YANGHANLIANG'
    // 令牌
    const token = req.headers.authorization
    // 获取默认权限
    const getDefalutJurisdiction = function() {
        const sql = 'SELECT identification FROM jurisdiction WHERE weight = 0 AND is_open = 1 AND distribution = 1'
        connect.query(sql, (error, results, fields) => {
            if (error) throw error
            if(results.length > 0) {
                res.send({
                    status: 200,
                    data: results.map((item) => {
                        return item.identification
                    })
                })
            } else {
                res.send({
                    status: 201,
                    data: []
                })
            }
        })
    }
    // 验证 Token
    jwt.verify(token, secret, (error, decoded) => {
        if (error) {
            getDefalutJurisdiction()
        } else {
            const sql = `SELECT identification FROM jurisdiction WHERE id not in (${decoded.jurisdictionId}) AND is_open = 1 AND distribution = 1`
            connect.query(sql, (error, results, fields) => {
                if (error) throw error
                if(results.length > 0) {
                    res.send({
                        status: 200,
                        data: results.map((item) => {
                            return item.identification
                        })
                    })
                } else {
                    getDefalutJurisdiction()
                }
            })
        }
    })
}

// 获取用户权限列表(后端-需要传入userName)
module.exports.userJurisdictions = (req, res) => {
    const userName = req.body.userName
    // 密钥
    const secret = 'YANGHANLIANG'
    // 令牌
    const token = req.headers.authorization
    // 验证 Token
    jwt.verify(token, secret, (error, decoded) => {
        if (error) {
            res.send({status: 201, msg: '身份验证失败，请登录~', type: 'token'})
        } else {
            console.log('这儿？？')
            let getUserJurisdiction = callback => {
                const sql = `SELECT jurisdiction_id FROM user WHERE username = '${userName}'`
                connect.query(sql, (error, results, fields) => {
                    if (error) throw error
                    if(results.length === 1) {
                        callback(null, results[0].jurisdiction_id)
                    }
                })
            }
            let getJurisdictionList = (jurisdictionId, callback) => {
                const sql = `SELECT * FROM jurisdiction WHERE id IN (${jurisdictionId})`
                console.log(sql, 'sql')
                connect.query(sql, (error, results, fields) => {
                    if (error) throw error
                    console.log(results, 'ssss')
                    if(results.length > 0) {
                        callback(null, results)
                    }
                })
            }

            async.waterfall([getUserJurisdiction, getJurisdictionList], function(error, results) {
                if (error) throw error
                console.log(results, 'results')
                res.send({
                    status: 200,
                    data: results
                })
            })
        }
    })
}

// 获取用户权限(后端-验证需要验证的功能)
module.exports.verification = (app) => {
    const sql = 'SELECT * FROM jurisdiction WHERE weight = 0 AND is_open = 1 AND distribution = 0'
    connect.query(sql, (error, results, fields) => {
        if (error) {
            app.jurisdictionList = []
        }

        if(results && results.length > 0) {
            app.jurisdictionList = results.map((item) => {
                return item.identification
            })
        } else {
            app.jurisdictionList = []
        }
    })
}
