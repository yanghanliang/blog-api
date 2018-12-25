// 导入自定义操作数据库的方法
const connect = require('./database.js')

// 导入签发与验证 JWT 的功能包
const jwt = require('jsonwebtoken')

// 解决异步操作
const async = require('async')

// 格式化时间
const moment = require('moment')

// 访问首页
module.exports.getIndex = (req, res) => {
    // 获取文章的数据
    const article =  function(callback) {
        const sql = "SELECT * FROM article ORDER BY updatetime DESC LIMIT 0,5"
        connect.query(sql, function(error, results, fields) {
            if(error) throw error
    
            if(results.length >= 1) { // 判断是否有数据
                callback(null, results)
            } else {
                callback(null, { msg: '没有数据' })
            }
        })
    }

    // 获取个人信息
    const personalInformation = function(callback) {
        const sql = 'SELECT * FROM user'
        connect.query(sql, function(error, results, fields) {
            if(error) throw error
    
            if(results.length >= 1) { // 判断是否有数据
                callback(null, results[0])
            } else {
                callback(null, { msg: '没有数据' })
            }
        })
    }
    
    // 并行执行,但保证了 results 的结果是正确的
    async.parallel({article, personalInformation}, function(error, results) {
        if(error) throw error

        // 返回数据
        res.send(results)
    })
}

// 登录验证
module.exports.login = (req, res, data) => {
    const sql = "SELECT * FROM user WHERE username='"+ data.username +"' and password='" + data.password +"'"
    connect.query(sql, function(error, results, fields) {
        if(error) throw error

        if(results.length === 1) {
            // Token 数据
            const payload = {
                name: data.username,
                password: data.password
            }

            // 密钥
            const secret = 'YANGHANLIANG'

            // 签发 Token
            const token = jwt.sign(payload, secret, {
                expiresIn: '1day'
            })

            // 返回数据
            res.json({
                status: 200,
                msg: '登录成功!',
                token: token
            })
        } else {
            // 返回数据
            res.json({
                status: 401,
                msg: '用户名或密码不正确!'
            })
        }
    })
}

// 获取文章表的总条数
const getArticleNumber = function(callback) {
    const sql = 'SELECT COUNT(*) FROM article'
    connect.query(sql, (error, results, fields) => {
        callback(null, results[0]['COUNT(*)'])
    })
}

// 字符串拼接
/**
 * 
 * @param {string} str 字符串
 * @param {number} interceptLength 截取的长度
 */
const stitchingString = (str, interceptLength) => { // 字符串拼接
    if (str.length > interceptLength) {
        return str.substr(0, interceptLength) + '...'
    }
    return str
}

// 获取文章列表
module.exports.articleList = (req, res) => {
    const sortField = req.params.sortField // 排序的字段
    const orderBy = req.params.orderBy === 'descending' ? 'desc' : 'asc' // 修改排序方式 传入的排序方式(ascending || descending)
    const number = req.params.number // 获取条数
    // 获取文章列表数据
    const data = function(callback) {
        const sql = `SELECT a.*,c.classname FROM
        article AS a LEFT OUTER JOIN category AS c
        ON a.category_id = c.id
        ORDER BY ${sortField} ${orderBy}
        LIMIT 0,${number}` // 默认返回 6 条数据
        connect.query(sql, (error, results, fields) => {
            if (error) throw error

            if(results.length >= 1) { // 判断是否有数据
                let tableData = [] // 保存表格数据
                for (let i = 0; i < results.length; i++) {
                    let rowData = results[i] // 获取一行的数据
                    // 将一行数据转化为对象,并追加到表格数据中
                    tableData.push({
                        title: stitchingString(rowData.title, 26),
                        classname: rowData.classname,
                        synopsis: rowData.synopsis,
                        createtime: rowData.createtime == null ? '暂未更新' : moment(rowData.createtime).format('YYYY年-MM月-DD日 HH时:mm分:ss秒 星期E'),
                        updatetime: rowData.updatetime == null ? '暂未更新' : moment(rowData.updatetime).format('YYYY年-MM月-DD日 HH时:mm分:ss秒 星期E'),
                        read: rowData.read,
                        praise: rowData.praise,
                        original: rowData.original,
                        id: rowData.id
                    })
                }
                callback(null, tableData)
            } else {
                callback(null, { msg: '没有数据' })
            }
        })
    }

    // 并行执行,但保证了 results 的结果是正确的
    async.parallel({data, getArticleNumber}, function(error, results) {
        if (error) throw error
        // 返回数据
        res.send(results)
    })
}

// 文章详情
module.exports.articleDetails = (req, res) => {
    const sql = `SELECT a.*,c.classname FROM
    article AS a LEFT OUTER JOIN category AS c
    ON a.category_id = c.id
    WHERE a.id= ${req.params.articleId}`
    connect.query(sql, function(error, results, fields) {
        if(error) throw error

        if(results.length >= 1) {
            // 返回数据
            res.send(results)
        } else {
            // 返回数据
            res.json({
                status: 401,
                msg: '该文章没有评论'
            })
        }
    })
}

// 添加文章
module.exports.addArticle = (req, res, data) => {
    const createtime = new Date().getTime() // 获取当前时间戳（精确到毫米
    const classNameId = data.classname, // 类型
          title = data.title, // 标题
          synopsis = data.synopsis, // 简介
          content = data.content.replace(/[']+/g, '&apos;') // 内容, 单引号转义

    const sql = `INSERT INTO article(category_id, title, synopsis, createtime, content) values ('${classNameId}', '${title}', '${synopsis}', '${createtime}', '${content}')`
    connect.query(sql, function(error, results, fields) {
        if(error) {
            throw error
        } else {
            // 返回数据
            res.json({
                status: 200,
                msg: '文章添加成功!'
            })
        }
    })
}

// 修改文章
module.exports.editArticle = (req, res, data) => {
    const updatetime = new Date().getTime() // 获取当前时间戳（精确到毫米
    const categoryId = data.classname, // 类型
          title = data.title, // 标题
          synopsis = data.synopsis, // 简介
          content = data.content, // 内容
          id = req.params.articleId // id
    const sql = `UPDATE article SET category_id=${categoryId}, title='${title}', synopsis='${synopsis}', content='${content}', updatetime=${updatetime} WHERE id=${id}`
    connect.query(sql, function(error, results, fields) {
        if(error) {
            throw error
        } else {
            // 返回数据
            res.json({
                status: 200,
                msg: '文章修改成功!'
            })
        }
    })
}

// 删除文章
module.exports.deleteArticle = (req, res) => {
    const deleteData = function(callback) { // 删除数据
        id = req.params.articleId // id
        const sql = `DELETE FROM article WHERE id=${id}`
        connect.query(sql, function(error, results, fields) {
            if (error) {
                throw error
            } else {
                // 返回数据
                callback(null, { 
                    status: 200,
                    msg: '文章删除成功!'
                 })
            }
        })
    }

    // 并行执行,但保证了 results 的结果是正确的
    async.parallel({deleteData, getArticleNumber}, function(error, results) {
        if (error) throw error
        // 返回数据
        res.send(results)
    })
}

// 搜索数据
module.exports.searchData = (req, res, data) => {
    const sql = `SELECT a.*,c.classname FROM
    article AS a LEFT OUTER JOIN category AS c
    ON a.category_id = c.id
    WHERE title Like '%${data.searchData}%' or content Like '%${data.searchData}%' or c.classname Like '%${data.searchData}%' or synopsis Like '%${data.searchData}%'`
    connect.query(sql, function(error, results, fields) {
        if (error) throw error

        if (results.length > 0) {
            res.send({
                status: 200,
                data: results
            })
        } else {
            res.send({
                msg: '没有找到数据, 主人啥都没写,懒死他了~'
            })
        }
    })
}

// 文章分页
module.exports.paging = (req, res) => {
    const currentPage = req.params.currentPage, // 获取当前页
          number = req.params.number // 获取条数
    const sql = `SELECT a.*,c.classname FROM
    article AS a LEFT OUTER JOIN category AS c
    ON a.category_id = c.id LIMIT ${currentPage},${number}`
    connect.query(sql, (error, results, fields) => {
        if (error) throw error
        if (results.length > 0) {
            for (let i = 0; i < results.length; i++) { // 格式化时间
                results[i].createtime = results[i].createtime === null ? null : moment(results[i].createtime).format('YYYY年-MM月-DD日 HH时:mm分:ss秒 星期E')
                results[i].updatetime = results[i].updatetime === null ? null : moment(results[i].updatetime).format('YYYY年-MM月-DD日 HH时:mm分:ss秒 星期E')
            }
            res.send({
                status: 200,
                data: results
            })
        } else {
            res.send({
                msg: '大佬别点了, 真没了!'
            })
        }
    })
}

// 获取分类数据
module.exports.category = (req, res) => {
    const sql = 'SELECT classname,id FROM category'
    connect.query(sql, (error, results, fields) => {
        if (error) throw error
        res.send(results)
    })
}

// 文章排序数据
module.exports.getOrderData = (req, res) => {
    const sortField = req.params.sortField // 获取排序的字段
    const orderBy = req.params.orderBy === 'descending' ? 'desc' : 'asc' // 获取排序的方式
    const number = req.params.number // 获取条数
    const sql = `SELECT a.*,c.classname FROM
        article AS a LEFT OUTER JOIN category AS c
        ON a.category_id = c.id
        ORDER BY ${sortField} ${orderBy}
        LIMIT 0,${number}` // 默认返回 6 条数据
    connect.query(sql, (error, results, fields) => {
        if (error) throw error

        if(results.length >= 1) { // 判断是否有数据
            res.send(results) // 返回数据
        } else {
            res.send(null, { msg: '没有数据' })
        }
    })
}