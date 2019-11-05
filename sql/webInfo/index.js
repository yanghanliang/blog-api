/**
 *  网站信息
 */

// 导入自定义操作数据库的方法
const connect = require('./database.js')

// 网站信息
module.exports.getIndex = (req, res) => {
    const sql = `SELECT a.*,c.classname FROM
    article AS a LEFT OUTER JOIN category AS c
    ON a.category_id = c.id
    WHERE a.id= ${id}`

    connect.query(sql, function(error, results, fields) {
        if(error) throw error

        if(results.length >= 1) {
            // 返回数据
            res.send(results)
        } else {
            // 返回数据
            res.json({
                status: 401,
                msg: '暂无数据'
            })
        }
    })
}