/**
 *  分类
 */

// 导入自定义操作数据库的方法
const connect = require('../../database.js')
// 解决异步操作
const async = require('async')

// 获取分类数据
module.exports.category = (req, res) => {
    const type = req.query.type === undefined ? '' : req.query.type // 分类类型
    let sql = ''
    if (type) {
        sql = `SELECT * FROM category WHERE type in ('${type}') ORDER BY pid`
    } else {
        sql = `SELECT * FROM category ORDER BY pid`
    }
    connect.query(sql, (error, results, fields) => {
        if (error) throw error
        res.send(results)
    })
}

// 修改分类(分类详情)
module.exports.editCategory = (req, res) => {
    const id = req.params.categoryId
    const sql = `SELECT * FROM category WHERE id = ${id}`
    connect.query(sql, (error, results, fields) => {
        if (error) throw error
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
    const type = data.type.join(',')
    const sql = `UPDATE category SET pid=${pid}, classname='${classname}', pid_classname='${pid_classname}', type='${type}' WHERE id=${id}`
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
    const type = data.type.join(',') // 分类类型
    // const sql = `INSERT INTO category(classname, pid) VALUES ('${classname}', ${pid})`
    // connect.query(sql, (error, results, fields) => {
    //     if (error) throw error
    //     res.send({
    //         status: 200,
    //         msg: '添加成功！'
    //     })
    // })

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
        const sql = `INSERT INTO category(classname, pid, pid_classname, type) VALUES ('${classname}', ${pid}, '${pid_classname}', '${type}')`
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
    console.log(sql, 'sql')
    connect.query(sql, (error, results, fields) => {
        if (error) throw error
        res.send({
            status: 200,
            data: results
        })
    })
}
