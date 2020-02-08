/**
 *  用户
 */

// 导入自定义操作数据库的方法
const connect = require('../../database.js')

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