/**
 *  分类
 */

// 导入自定义操作数据库的方法
const connect = require('../../database.js')
// 解决异步操作
const async = require('async')
const e = require('express')

// 获取分类数据
module.exports.category = (req, res, data) => {
    const currentPage = data.currentPage
    const pageSize = data.pageSize
    const sortField = data.sortField ? data.sortField : 'classname'
    const searchData = data.searchData
    const orderBy = data.orderBy === 'descending' ? 'desc' : 'asc' // 获取排序的方式
    const currentNumber = (currentPage - 1) * pageSize

    const total = function (callback) {
        let sql = ''
        if (searchData) {
            sql = `SELECT COUNT(*) FROM category WHERE classname Like '%${searchData}%'`
        } else {
            sql = `SELECT COUNT(*) FROM category`
        }
        connect.query(sql, (error, results, fields) => {
            if (error) throw error
            callback(null, results[0]['COUNT(*)'])
        })
    }

    const list = function(total, callback) {
        let sql = ''
        if (searchData) {
            sql = `SELECT * FROM category WHERE classname Like '%${searchData}%' ORDER BY ${sortField} ${orderBy} LIMIT ${currentNumber}, ${pageSize}`
        } else {
            if (currentNumber && pageSize) {
                sql = `SELECT * FROM category ORDER BY ${sortField} ${orderBy} LIMIT ${currentNumber}, ${pageSize}`
            } else {
                sql = `SELECT * FROM category ORDER BY ${sortField} ${orderBy}`
            }
        }
        connect.query(sql, (error, results, fields) => {
            if (error) throw error
            const data = {
                total: total,
                list: results
            }
            callback(null, data)
        })
    }

    async.waterfall([total, list], (error, results) => {
        if (error) console.log(error)
        res.send({
            status: 200,
            data: results
        })
    })
}

// 修改分类(分类详情)
module.exports.editCategory = (req, res) => {
    const id = req.params.categoryId
    const sql = `SELECT * FROM category WHERE id = ${id}`
    connect.query(sql, (error, results, fields) => {
        if (error) {
            console.log(error)
        }

        if (results.length === 1) {
            res.send({
                status: 200,
                data: results
            })
        }
    })
}

// 更新分类数据
module.exports.updateCategory = (req, res, data) => {
    const id = data.id
    const pid = data.pid
    const classname = data.classname
    const pid_classname = data.pid_classname
    const sql = `UPDATE category SET pid=${pid}, classname='${classname}', pid_classname='${pid_classname}' WHERE id=${id}`
    connect.query(sql, (error, results, fields) => {
        if (error) throw error
        res.send({
            status: 200,
            msg: '修改成功！'
        })
    })
}

// 添加分类
module.exports.addCategory = (req, res, data) => {
    const classname = data.classname // 获取分类名称
    const pid = data.pid // 获取所在层级

    var selectPidClassName = function(callback){
        if (pid === 0) {
            callback(null, '第一层级')
        } else {
            const sql = `SELECT classname FROM category WHERE id=${pid}`
            connect.query(sql, (error, results, fields) => {
                if (error) throw error
                if (results.length === 1) {
                    callback(null, results[0].classname)
                }
            })
        }
	}
 
	var addCategoryClassName =function(pid_classname, callback){
        
        const sql = `INSERT INTO category(classname, pid, pid_classname) VALUES ('${classname}', ${pid}, '${pid_classname}')`
        connect.query(sql, (error, results, fields) => {
            if (error) throw error
            callback(null, {
                status: 200,
                msg: '添加成功！'
            })
        })
    }

	async.waterfall([selectPidClassName, addCategoryClassName],function(error,result){
		if (error) throw error 
        res.send(result)
	})
}

// 删除分类
module.exports.deleteCategory = (req, res) => {
    const id = req.params.categoryId
    const sql = `DELETE FROM category WHERE id=${id}`
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

// 查询分类
module.exports.queryClass = (req, res) => {
    let params = req.body
    let sql = 'SELECT * FROM category WHERE'

    for (key in params) {
        sql += `${key} = ${params[key]} AND`
    }

    sql = sql.slice(0, -3)
    connect.query(sql, (error, results, fields) => {
        if (error) throw error
        res.send({
            status: 200,
            data: results
        })
    })
}