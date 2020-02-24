/**
 *  权限
 */

// 导入自定义操作数据库的方法
const connect = require('../../database.js')

// 权限列表
module.exports.list = (req, res) => {
    const sql = 'SELECT * FROM jurisdiction ORDER BY distribution'

    connect.query(sql, (error, results, fields) => {
        if (error) throw error
        if (results.length > 0) {
            res.send({
                status: 200,
                data: results
            })
        } else {
            res.send({
                status: 201,
                data: []
            })
        }
    })
}

// 添加权限
module.exports.add = (req, res) => {
    const data = req.body,
        name = data.name,
        identification = data.identification,
        pid = data.pid,
        distribution = data.distribution
    const sql = `INSERT INTO jurisdiction(j_name, identification, j_pid, distribution) VALUES ('${name}', '${identification}', ${pid}, '${distribution}')`
    connect.query(sql, (error, results, fields) => {
        if (error) throw error
        res.send({
            status: 200,
            msg: '添加成功'
        })
    })
}

// 查询权限名称和标识的唯一性
module.exports.verification = (req, res) => {
    const data = req.body,
    name = data.name ? data.name : '',
    identification = data.identification ? data.identification : ''

    let sql = `SELECT j_name, identification FROM jurisdiction WHERE j_name = '${name}' OR identification = '${identification}'`
    connect.query(sql, (error, results, fields) => {
        if (error) throw error
        if(results.length > 0) {
            res.send({
                status: 200,
                data: {
                    verification: false
                }
            })
        } else {
            res.send({
                status: 200,
                data: {
                    verification: true
                }
            })
        }
    })
}

// 获取权限详情
module.exports.details = (req, res) => {
    const id = req.params.id
    let sql = `SELECT * FROM jurisdiction WHERE id = ${id}`
    connect.query(sql, (error, results, fields) => {
        if (error) throw error
        if(results.length > 0) {
            res.send({
                status: 200,
                data: results[0]
            })
        } else {
            res.send({
                status: 200,
                data: {}
            })
        }
    })
}

// 修改权限
module.exports.edit = (req, res) => {
    const data = req.body,
        name = data.name,
        identification = data.identification,
        distribution = data.distribution,
        pid = data.pid
        id = req.params.id
    const sql = `UPDATE jurisdiction SET j_name='${name}', identification='${identification}', j_pid=${pid}, distribution=${distribution} WHERE id=${id}`
    connect.query(sql, (error, results, fields) => {
        if (error) throw error
        res.send({
            status: 200,
            msg: '修改成功'
        })
    })
}

// 删除权限
module.exports.delete = (req, res) => {
    const id = req.params.id
    const sql = `DELETE FROM jurisdiction WHERE id = ${id}`
    console.log(sql, 'sql')
    connect.query(sql, (error, results, fields) => {
        if (error) throw error
        res.send({
            status: 200,
            msg: '删除成功'
        })
    })
}