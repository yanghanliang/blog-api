/**
 *  组件
 */

// 导入自定义操作数据库的方法
const connect = require('../../database.js')
// 解决异步操作
const async = require('async')

module.exports.edit = (req, res) => {
    const data =  req.body,
        name = data.name,
        content = data.content.replace(/[']+/g, '&apos;')
    
    // 判断是否存在
    let isExistence = (callback) => {
        let sql = `SELECT * FROM components WHERE name = '${name}'`
        connect.query(sql, (error, results, fields) => {
            if (error) throw error
            callback(null, results.length === 1 ? true : false)
        })
    }
    // 添加或修改
    let handleComponent = (isExistence, callback) => {
        let sql = ''
        console.log(isExistence, 'isExistence')
        if (isExistence) {
            sql = `UPDATE components SET content='${content}' WHERE name = '${name}'`
        } else {
            sql = `INSERT INTO components(name, content) values ('${name}', '${content}')`
        }
        connect.query(sql, (error, results, fields) => {
            if (error) throw error
            callback(null, {
                status: 200,
                msg: isExistence ? '修改成功' : '添加成功'
            })
        })
    }
    async.waterfall([isExistence, handleComponent], (error, results) => {
        if (error) throw error
        res.send(results)
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