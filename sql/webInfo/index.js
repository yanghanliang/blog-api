/**
 *  网站信息
 */

// 导入自定义操作数据库的方法
const connect = require('../../database.js')

// 解决异步操作
const async = require('async')

// 网站信息
module.exports.getIndex = (req, res) => {
    const date = req.query.date
    let start_date = new Date(date[0]).getTime()
    let end_date = new Date(date[1]).getTime()
    // 获取点赞数和阅读数
    const sql_article = function(callback) {
        const sql = `select sum(praise), sum(\`read\`) FROM article`
        connect.query(sql, function(error, results, fields) {
            if(error) throw error

            if(results.length >= 1) { // 判断是否有数据
                // console.log(results, '获取点赞数和阅读数')
                callback(null, results)
            } else {
                callback(null, { msg: '没有数据' })
            }
        })
    }

    // 获取评论数（不包括回复）
    const sql_comment = function(callback) {
        const sql = 'select count(id) FROM comment WHERE comment_id = 0'
        connect.query(sql, function(error, results, fields) {
            if(error) throw error

            if(results.length >= 1) { // 判断是否有数据
                // console.log(results, '获取评论数（不包括回复）')
                callback(null, results)
            } else {
                callback(null, { msg: '没有数据' })
            }
        })
    }

    // 并行执行,但保证了 results 的结果是正确的
    async.parallel({sql_article, sql_comment, sql_user}, function(error, results) {
        if(error) throw error
        let data = {}
        const article_data = results.sql_article[0]
        const comment_data = results.sql_comment[0]
        data.praise = article_data['sum(praise)']
        data.read =  article_data['sum(`read`)']
        data.comment = comment_data['count(id)']
       
        // 返回数据
        res.send({
            status: 200,
            data: data
        })
    })
}
