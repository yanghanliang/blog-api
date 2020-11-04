/**
 *  文章
 */

// 导入自定义操作数据库的方法
const connect = require('../../database.js')
// 解决异步操作
const async = require('async')

// 根据关键字和分类进行智能推荐
module.exports.recommend = (req, res) => {
    const data = req.body,
        pageSize = data.pageSize,
        currentPage = (data.currentPage - 1) * pageSize // 当前第几条 = (当前页-1) * 每页条数, // 获取当前页
        categoryId = data.categoryId,
        title = data.title,
        id = data.id

        // 获取分页数据(可优化)
        const getData = (callback) => {
            const sql = `SELECT * FROM article WHERE (category_id=${categoryId} OR title Like '%${title}%' OR content Like '%${title}%') AND id != ${id} LIMIT ${currentPage, pageSize}`
            connect.query(sql, (error, results, fields) => {
                if (error) throw error
                if (results.length > 0) {
                    callback(null, results)
                } else {
                    callback(null, [])
                }
            })
        }
        // 获取总条数
        const getTotal = (callback) => {
            const sql = `SELECT * FROM article WHERE (category_id=${categoryId} OR title Like '%${title}%' OR content Like '%${title}%') AND id != ${id}`
            connect.query(sql, (error, results, fields) => {
                if (error) throw error
                if (results.length > 0) {
                    callback(null, results.length)
                } else {
                    callback(null, 0)
                }
            })
        }

        // 并行执行
        async.parallel([getData, getTotal], (error, results) => {
            if (error) throw error
            res.send({
                status: 200,
                data: {
                    list: results[0],
                    total: results[1]
                }
            })
        })
}

// 修改文章点赞数
module.exports.praise = (req, res) => {
    const data = req.body,
        id = data.categoryId,
        praise = data.praise // 点赞是true,取消点赞是false

    const sql = `UPDATE article SET praise='${praise}' WHERE id = id`
    connect.query(sql, (error, results, fields) => {
        if (error) throw error
        res.send({
            status: 200,
            msg: '操作成功~'
        })
    })
}

// 查询文章是否存在
module.exports.isExistence = (req, res) => {
    const title = req.query.title
    const sql = `SELECT * FROM article WHERE title = '${title}'`
    console.log(req.query, 'title', req.params)
    connect.query(sql, (error, results, fields) => {
        if (error) console.log(error, 'error')
        console.log(results, 'results')
        const data = Object.values(results)
        res.send({
            status: 200,
            data: data.length > 0 ? true : false
        })
    })
}