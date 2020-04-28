/**
 *  书签
 */

// 导入自定义操作数据库的方法
const connect = require('../../database.js')
// 解决异步操作
const async = require('async')

// 添加书签
module.exports.add = (req, res) => {
    const data = req.body,
        name = data.bookmarkName,
        link = data.link,
        pid = data.pid,
        icon = data.icon
    let sql = ''
    if (link) {
        sql = `INSERT INTO bookmark(name, link, pid, icon) VALUES ('${name}', '${link}', '${pid}', '${icon}')`
    } else {
        sql = `INSERT INTO bookmark(name, pid, icon) VALUES ('${name}', '${pid}', '${icon}')`
    }
    connect.query(sql, (error, results, fields) => {
        if (error) throw error
        res.send({
            status: 200,
            msg: '添加成功~'
        })
    })
}

// 查询书签名称是否已存在
module.exports.query = (req, res) => {
    const name = req.query.bookmarkName
    const sql = `SELECT * FROM bookmark WHERE name='${name}'`

    connect.query(sql, (error, results, fields) => {
        if (error) throw error
        res.send({
            status: 200,
            data: results
        })
    })
}

// 获取书签列表
module.exports.list = (req, res) => {
    const sql = `SELECT * FROM bookmark ORDER BY pid`
    connect.query(sql, (error, results, fields) => {
        if (error) throw error
        res.send({
            status: 200,
            data: results
        })
    })
}