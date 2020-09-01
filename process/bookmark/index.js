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
        icon = data.icon,
        className = data.className
    let sql = ''
    if (link) {
        sql = `INSERT INTO bookmark(name, link, pid, icon, class_name) VALUES ('${name}', '${link}', '${pid}', '${icon}', '${className}')`
        console.log(sql, 'sql')
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
    const name = req.query.bookmarkName.replace(/[”|“|']+/g, '&apos;')
    const sql = `SELECT * FROM bookmark WHERE name='${name}'`
    console.log(sql)
    connect.query(sql, (error, results, fields) => {
        if (error) throw error
        res.send({
            status: 200,
            data: results
        })
    })
}

// 获取书签分类列表
module.exports.categoryList = (req, res) => {
    const sql = `SELECT * FROM bookmark WHERE LINK IS NULL OR link = ''`
    connect.query(sql, (error, results, fields) => {
        if (error) console.log(error)
        res.send({
            status: 200,
            data: results
        })
    })
}

// 获取书签列表
module.exports.list = (req, res) => {
    const params = req.query
    const searchData = params.searchData
    // 获取分页数据
    const getListData = callback => {
        const pageSize = params.pageSize ? params.pageSize : 10
        const currentPage = params.currentPage ? params.currentPage : 1
        const start = (currentPage - 1) * pageSize
        let sql = ''
        if (searchData) {
            sql = `SELECT * FROM bookmark WHERE name LIKE '%${searchData}%' limit ${start},${pageSize}`
        } else {
            sql = `SELECT * FROM bookmark limit ${start},${pageSize}`
        }
        console.log(sql)
        connect.query(sql, (error, results, fields) => {
            if (error) throw error
            callback(null, results)
        })
    }

    // 获取total
    const getTotal = (callback) => {
        let sql = ''
        if (searchData) {
            sql = `SELECT COUNT(*) FROM bookmark WHERE name LIKE '%${searchData}%'`
        } else {
            sql = `SELECT COUNT(*) FROM bookmark`
        }
        connect.query(sql, (error, results, fields) => {
            if (error) throw error
            callback(null, results)
        })
    }

    async.parallel([getListData, getTotal], (error, results) => {
        if (error) throw error
        res.send({
            status: 200,
            data: {
                list: results[0],
                total: Object.values(results[1][0])[0]
            }
        })
    })
}

// 获取书签详情
module.exports.detail = (req, res) => {
    const id = req.query.id
    const sql = `SELECT * FROM bookmark WHERE id = ${id}`
    connect.query(sql, (error, results, fields) => {
        if (error) throw error
        res.send({
            status: 200,
            data: results[0]
        })
    })
}

// 修改书签详情
module.exports.edit = (req, res, data) => {
    const id = data.id
    const link = data.link
    const icon = data.icon
    const pid = data.pid
    const name = data.bookmarkName
    const className = data.className
    const sql = `UPDATE bookmark SET pid='${pid}', link='${link}', icon='${icon}', name='${name}', class_name='${className}' WHERE id=${id}`
    console.log(sql, 'sql')
    connect.query(sql, (error, results, fields) => {
        if (error) throw error
        res.send({
            status: 200,
            msg: '修改成功'
        })
    })
}

// 获取书签导航列表
module.exports.bookmarkNav = (req, res) => {
    const sql = 'SELECT * FROM bookmark'
    connect.query(sql, (error, results, fields) => {
        if (error) throw error
        res.send({
            status: 200,
            data: results
        })
    })
}

// 删除分类
module.exports.deleteCatrgory = (req, res) => {
    const id = req.params.categoryId
    const sql = `DELETE FROM bookmark WHERE id=${id}`
    connect.query(sql, (error, results, fields) => {
        if (error) {
            res.send({
                status: 201,
                msg: '删除失败！'
            })
            throw error
        } else {
            res.send({
                status: 200,
                msg: '删除成功！'
            })
        }
    })
}
