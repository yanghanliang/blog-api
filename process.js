// 导入自定义操作数据库的方法
const connect = require('./database.js')

// 导入签发与验证 JWT 的功能包
const jwt = require('jsonwebtoken')

// 解决异步操作
const async = require('async')

// 访问首页
module.exports.getIndex = (req, res) => {
    // 获取文章的数据
    const article =  function(callback) {
        const sql = "SELECT * FROM article"
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
    const personal_information = function(callback) {
        const sql = "SELECT * FROM user"
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
    async.parallel({article, personal_information}, function(error, results) {
        if(error) {
            console.log(error)
        }

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

// 获取文章列表
module.exports.articleList = (req, res) => {
    const sql = 'SELECT * FROM article'
    connect.query(sql, (error, results, fields) => {
        if (error) throw error

        // 返回数据
        res.send(results)
    })
}

// 文章详情
module.exports.articleDetails = (req, res) => {
    const sql = 'SELECT * FROM article WHERE id='+ req.params.articleId
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
    const type = data.type, // 类型
          title = data.title, // 标题
          synopsis = data.synopsis, // 简介
          content = data.content // 内容

    const sql = `INSERT INTO article(type, title, synopsis, createtime, content) values ('${type}', '${title}', '${synopsis}', '${createtime}', '${content}')`
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
    const type = data.type, // 类型
          title = data.title, // 标题
          synopsis = data.synopsis, // 简介
          content = data.content, // 内容
          id = req.params.articleId // id
    const sql = `UPDATE article SET type='${type}', title='${title}', synopsis='${synopsis}', content='${content}', updatetime=${updatetime} WHERE id=${id}`
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
