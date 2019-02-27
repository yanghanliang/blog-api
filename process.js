// 导入自定义操作数据库的方法
const connect = require('./database.js')

// 导入签发与验证 JWT 的功能包
const jwt = require('jsonwebtoken')

// 解决异步操作
const async = require('async')

var formidable = require('formidable');
var fs = require("fs");

// 访问首页
module.exports.getIndex = (req, res) => {
    // 获取文章的数据
    const article =  function(callback) {
        const sql = `SELECT a.*,c.classname FROM
        article AS a LEFT OUTER JOIN category AS c
        ON a.category_id = c.id ORDER BY createtime DESC LIMIT 0,5`
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
    var sql = 'SELECT COUNT(*) FROM article'
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
                        createtime: rowData.createtime,
                        updatetime: rowData.updatetime,
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
    const id = req.params.articleId // 获取文章 id
    const sql = `SELECT a.*,c.classname FROM
    article AS a LEFT OUTER JOIN category AS c
    ON a.category_id = c.id
    WHERE a.id= ${id}`
    connect.query(sql, function(error, results, fields) {
        if(error) throw error

        if(results.length >= 1) {
            results[0].content = results[0].content.replace(/(&apos;)+/g, '\'') // 还原单引号
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

    const sql = `INSERT INTO article(category_id, title, synopsis, createtime, content) VALUES ('${classNameId}', '${title}', '${synopsis}', '${createtime}', '${content}')`
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
          content = data.content.replace(/[']+/g, '&apos;'), // 内容, 单引号转义
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
    const getData = (callback) => {
    const sql = `SELECT a.*,c.classname FROM
    article AS a LEFT OUTER JOIN category AS c
    ON a.category_id = c.id
    WHERE title Like '%${data.searchData}%' or content Like '%${data.searchData}%' or c.classname Like '%${data.searchData}%' or synopsis Like '%${data.searchData}%'
    ORDER BY updatetime desc
    LIMIT 0,5`
    connect.query(sql, function(error, results, fields) {
        if (error) throw error

        if (results.length > 0) {
            callback(null, { status: 200, data: results })
        } else {
            callback(null, { msg: '没有找到数据, 主人啥都没写,懒死他了~' })
        }
        })
    }

    const getNumber = (callback) => {
        const sql = `SELECT COUNT(*) FROM
            article AS a LEFT OUTER JOIN category AS c
            ON a.category_id = c.id
            WHERE title Like '%${data.searchData}%' or content Like '%${data.searchData}%' or c.classname Like '%${data.searchData}%' or synopsis Like '%${data.searchData}%'`
        connect.query(sql, (error, results, fields) => {
            callback(null, results[0]['COUNT(*)'])
    })

}

    // 并行执行,但保证了 results 的结果是正确的
    async.parallel({getNumber, getData}, function(error, results) {
        if (error) throw error
        // 返回数据
        res.send(results)
    })
}

// 文章分页
module.exports.paging = (req, res, data) => {
    const sortField = data.sortField ? data.sortField : 'createtime', // 获取排序的字段(默认以创建时间排序)
          currentNumber = (data.currentPage - 1) * data.pageSize // 当前第几条 = (当前页-1) * 每页条数, // 获取当前页
          pageSize = data.pageSize, // 获取条数
          orderBy = data.orderBy === 'descending' ? 'desc' : 'asc', // 获取排序的方式
          searchData = data.searchData, // 搜索的内容
          classname = data.classname // 类名

    if (classname) {
        const sql = `SELECT a.*,c.classname FROM
            article AS a LEFT OUTER JOIN category AS c
            ON a.category_id = c.id
            WHERE classname = '${classname}'
            ORDER BY ${sortField} ${orderBy}
            LIMIT ${currentNumber},${pageSize}`
        connect.query(sql, (error, results, fields) => {
            if (error) throw error
            if (results.length > 0) {
                // formatTime(results) // 格式化时间
                res.send({
                    getData: {
                        status: 200,
                        data: results
                    }
                })
            } else {
                res.send({
                    getData: {
                        status: 201,
                        msg: '没有更多了~'
                    }
                })
            }
        })
    } else if (searchData === '' || searchData === undefined) { // 如果没有搜索内容则不做搜索查询
        const sql = `SELECT a.*,c.classname FROM
            article AS a LEFT OUTER JOIN category AS c
            ON a.category_id = c.id
            ORDER BY ${sortField} ${orderBy}
            LIMIT ${currentNumber},${pageSize}`
        connect.query(sql, (error, results, fields) => {
            if (error) throw error
            if (results.length > 0) {
                // formatTime(results) // 格式化时间
                res.send({
                    getData: {
                        status: 200,
                        data: results
                    }
                })
            } else {
                res.send({
                    getData: {
                        status: 201,
                        msg: '没有更多了~'
                    }
                })
            }
        })
    } else {
        const getNumber = (callback) => {
            const sql = `SELECT COUNT(*) FROM
                article AS a LEFT OUTER JOIN category AS c
                ON a.category_id = c.id
                WHERE title Like '%${data.searchData}%' or content Like '%${data.searchData}%' or c.classname Like '%${data.searchData}%' or synopsis Like '%${data.searchData}%'`
            connect.query(sql, (error, results, fields) => {
                callback(null, results[0]['COUNT(*)'])
            })
        }

        const getData = (callback) => {
            const sql = `SELECT a.*,c.classname FROM
                    article AS a LEFT OUTER JOIN category AS c
                    ON a.category_id = c.id
                    WHERE title Like '%${data.searchData}%' or content Like '%${data.searchData}%' or c.classname Like '%${data.searchData}%' or synopsis Like '%${data.searchData}%'
                    ORDER BY ${sortField} ${orderBy}
                    LIMIT ${currentNumber},${pageSize}`
            connect.query(sql, function(error, results, fields) {
                if (error) throw error
    
                if (results.length > 0) {
                    callback(null, { status: 200, data: results })
                } else {
                    callback(null, { msg: '没有更多了~' })
                }
            })
        }

        // 并行执行,但保证了 results 的结果是正确的
        async.parallel({getNumber, getData}, function(error, results) {
            if (error) throw error
            // 返回数据
            res.send(results)
        })
    }
}

// 获取分类数据
module.exports.category = (req, res) => {
    const sql = 'SELECT * FROM category ORDER BY pid'
    connect.query(sql, (error, results, fields) => {
        if (error) throw error
        res.send(results)
    })
}

// 获取文章分类数据
module.exports.articleCategory = (req, res) => {
    const classname = req.params.classname
    const getNumber = (callback) => {
        const sql = `SELECT COUNT(*) FROM
            article AS a LEFT OUTER JOIN category AS c
            ON a.category_id = c.id
            WHERE classname = '${classname}'`
        connect.query(sql, (error, results, fields) => {
            if (error) throw error
            callback(null, results[0]['COUNT(*)'])
        })
    }
    const getData = (callback) => {
        const sql = `SELECT a.*,c.classname FROM
            article AS a LEFT OUTER JOIN category AS c
            ON a.category_id = c.id
            WHERE classname = '${classname}'
            ORDER BY updatetime desc
            LIMIT 0, 5`
        connect.query(sql, (error, results, fields) => {
            if (error) throw error
            if (results.length > 0) {
                callback(null, { status: 200, data: results })
            } else {
                callback(null, { msg: '没有找到数据, 主人啥都没写,懒死他了~' })
            }
        })
    }
    // 并行执行,但保证了 results 的结果是正确的
    async.parallel({getNumber, getData}, function(error, results) {
        if (error) throw error
        // 返回数据
        res.send(results)
    })
}

// 添加分类
module.exports.addCategory = (req, res, data) => {
    const classname = data.classname // 获取分类名称
    const pid = data.pid // 获取所在层级
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

// 修改分类
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
    const sql = `UPDATE category SET pid=${pid}, classname='${classname}', pid_classname='${pid_classname}' WHERE id=${id}`
    connect.query(sql, (error, results, fields) => {
        if (error) throw error
        res.send({
            status: 200,
            msg: '修改成功！'
        })
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

module.exports.testData = (req, res) => {
    const sql = `SELECT * FROM note as n LEFT OUTER JOIN category as c
        ON n.category_id = c.id`
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
                msg: '没有数据~'
            })
        }
    })
}

// 记录文章阅读数
module.exports.recordReadingNumber = (req, res) => {
    const id = req.params.articleId // 获取文章 id
    const sql = 'UPDATE article SET `read`=`read`+1 WHERE id = '+ id
    connect.query(sql, function(error) {
        if (error) throw error
        res.send({
            status: 200
        })
    })
}

// 获取上一篇和下一篇文章的 title && id
module.exports.during = (req, res) => {
    const createtime = req.params.createtime // 获取当前文章的 id
    const preArticle = (callback) => { // 上一篇
        const sql = `SELECT title, id FROM article
        WHERE createtime > ${createtime}
        ORDER BY createtime
        LIMIT 1`
        connect.query(sql, (error, results, fields) => {
            if (error) throw error
            if (results.length > 0) {
                callback(null, { status: 200, data: results[0] })
            } else {
                callback(null, { status: 201, msg: '没有上一篇了' })
            }
        })
    }

    const nextArticle = (callback) => { // 下一篇
        const sql = `SELECT title, id FROM article
        WHERE createtime < ${createtime}
        ORDER BY createtime desc
        LIMIT 1`
        connect.query(sql, (error, results, fields) => {
            if (error) throw error
            if (results.length > 0) {
                callback(null, { status: 200, data: results[0] })
            } else {
                callback(null, { status: 201, msg: '没有下一篇了' })
            }
        })
    }
    // 并行执行,但保证了 results 的结果是正确的
    async.parallel({preArticle, nextArticle}, function(error, results) {
        if (error) throw error
        // 返回数据
        res.send(results)
    })
}

// 获取目录数据(index)
module.exports.catalog = (req, res) => {
    const sql = 'SELECT createtime, title, id FROM article ORDER BY createtime DESC'
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
                msg: '暂无数据!'
            })
        }
    })
}

// 添加文章评论
module.exports.addComment = (req, res, data) => {
    const alias = data.alias,
          mailbox = data.mailbox,
          article_id = data.article_id,
          comment_content = data.comment_content

    const sql = `INSERT INTO comment(article_id, alias, ${mailbox ? 'mailbox,' : ''} comment_content)
    VALUES(${article_id}, '${alias}', ${mailbox ? "'"+mailbox+"'," : ''} '${comment_content}')`
    connect.query(sql, (error, result, fields) => {
        if (error) throw error
        res.send({
            status: 200,
            msg: '添加成功~'
        })
    })
}

// 获取文章评论数据
module.exports.getArticleCommentData = (req, res) => {
    const articleId = req.params.articleId // 获取文章id
    const sql = `SELECT * FROM comment WHERE article_id = ${articleId} ORDER BY time DESC`
    connect.query(sql, (error, result, fields) => {
        if (error) throw error
        if (result.length > 0) {
            var dataStructure = function(sourceData) {
                var data = [],
                    tempData = []
                // 先拆分
                for(var i = 0; i < sourceData.length; i++) {
                    if (sourceData[i].comment_id === 0) {
                        data.push([sourceData[i]])
                    } else {
                        tempData.push(sourceData[i])
                    }
                }
    
                // 拼凑数据结构
                var assemble = function(data, tempData) {
                    for(var i = 0; i < data.length; i++) {
                        var arr2 = data[i]
                        var length = arr2.length
                        for(var j = 0; j < arr2.length; j++) {
                            for(var y = 0; y < tempData.length; y++) {
                                if (arr2[j].id === tempData[y].comment_id) {
                                    arr2.push(tempData[y])
                                }
                            }
                        }
                    }
                }
                assemble(data, tempData)
                return data
            }
    
            res.send({
                status: 200,
                data: dataStructure(result)
            })
        } else {
            res.send({
                status: 201,
                msg: '暂无评论~'
            })
        }
    })
}

// 回复文章评论
module.exports.addReply = (req, res, data) => {
    const alias = data.alias,
          mailbox = data.mailbox,
          comment_id = data.comment_id,
          article_id = data.article_id,
          comment_content = data.comment_content
    const sql = `INSERT INTO comment(article_id, alias, ${mailbox ? 'mailbox,' : ''} comment_content, comment_id)
    VALUES(${article_id}, '${alias}', ${mailbox ? "'"+mailbox+"'," : ''} '${comment_content}', ${comment_id})`

    connect.query(sql, (error, result, fields) => {
        if (error) throw error
        res.send({
            status: 200,
            msg: 'ok!'
        })
    })
}

// 图片上传
module.exports.pictureUpload = (req, res) => {
    var form = new formidable.IncomingForm()
    //设置文件上传存放地址
    form.uploadDir = ".//user_head_portrait"
    // 保留图片的扩展名
    form.keepExtensions = true
    //执行里面的回调函数的时候，表单已经全部接收完毕了。
    form.parse(req, function(err, fields, files) {
        // console.log("files:",files)  //这里能获取到图片的信息
        // console.log("fields:",fields) //这里能获取到传的参数的信息，如上面的message参数，可以通过fields。message来得到 
        // console.log("path:", files.file.path) // 获取图片路径
        if (files.file.size/1024/1024 > 1 || files.file === undefined) {
            res.send({
                status: 201,
                msg: '上传头像图片大小不能超过 1MB!'
            })
        } else if (files.file.type.indexOf('image') !== -1) {
            const commentId = fields.commentId,
            head_portrait_url = files.file.path.replace(/[\\]/g, '\/\/')
        
            const sql = `UPDATE comment SET head_portrait_url='${head_portrait_url}' WHERE comment_id=${commentId} `

            connect.query(sql, (error, result, fields) => {
                if (error) throw error
                res.send({
                    status: 200,
                    head_portrait_url: head_portrait_url
                })
            })
        } else {
            res.send({
                status: 201,
                msg: '请提交图片格式的文件，如后缀名为： .gif、.png、.jpg'
            })
        }
    })
}
