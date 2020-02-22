/**
 *  组件
 */

// 导入自定义操作数据库的方法
const connect = require('../../database.js')

module.exports.edit = (req, res) => {
    const data =  req.body,
        name = data.name,
        content = data.content.replace(/[']+/g, '&apos;')
    let sql = `UPDATE components SET content='${content}' WHERE name = '${name}'`
    connect.query(sql, (error, results, fields) => {
        if (error) throw error
        res.send({
            status: 200,
            msg: '修改成功'
        })
    })
}

module.exports.details = (req, res) => {
    const name = req.query.name
    let sql = `SELECT * FROM components WHERE name = '${name}'`
    connect.query(sql, (error, results, fields) => {
        if (error) throw error
        if(results.length === 1) {
            results[0].content = results[0].content.replace(/(&apos;)+/g, '\'') // 还原单引号
            res.send({
                status: 200,
                data: results
            })
        }
    })
}