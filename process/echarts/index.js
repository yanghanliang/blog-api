/**
 *  获取图表数据
 */
// 处理异步请求
const async = require('async')
// 导入自定义操作数据库的方法
const connect = require('../../database.js')
// 处理时间的
const moment = require('moment')

// 网站数据(日报表)折线图
module.exports.webInfo = (req, res) => {
    const data = req.body,
        endDate = moment(data.endTime).add(1, 'days').format('YYYY-MM-DD'), // 包括今天
        startTime = new Date(data.startTime).getTime(),
        endTime = new Date(endDate).getTime(),
        file = data.file // 0 只返回有数据的日期,1把没有数据的日期补零

    let dateObjValue = {
        [data.startTime]: 0
    }
    if (file) {
        let tempDate = data.startTime // 开始时, 临时时间等于开始时间
    
        // 如果临时时间小于结束时间,那么就将临时时间加1天,并存到时间范围内
        while (tempDate < data.endTime) {
            tempDate = moment(tempDate).add(1, 'days').format('YYYY-MM-DD')
            dateObjValue[tempDate] = 0
        }
    }
   
    // 注册人数
    const enrolment = (callback) => {
        const sql = `SELECT * FROM user WHERE createtime <= ${endTime} AND createtime >= ${startTime}`
        connect.query(sql, (error, results, fields) => {
            if (error) throw error
            let valueObj = {}
            results.forEach((item) => {
                let key = moment(item.createtime).format('YYYY-MM-DD')
                if (valueObj[key]) {
                    valueObj[key] = valueObj[key] + 1
                } else {
                    valueObj[key] = 1
                }
            })

            if (file) {
                let dateObj = Object.assign({}, dateObjValue)
                for (key in dateObj) {
                    if (valueObj[key]) {
                        dateObj[key] = valueObj[key]
                    }
                }
                valueObj = dateObj
            }
            callback(null, valueObj)
        })
    }

    // 浏览人数
    const previewNumber = (callback) => {
        const sql = `SELECT * FROM previewdata WHERE last_time <= ${endTime} AND last_time >= ${startTime}`
        connect.query(sql, (error, results, fields) => {
            if (error) throw error
            let valueObj = {}
            results.forEach((item) => {
                let key = moment(item.last_time).format('YYYY-MM-DD')
                if (valueObj[key]) {
                    valueObj[key] = valueObj[key] + 1
                } else {
                    valueObj[key] = 1
                }
            })

            if (file) {
                let dateObj = Object.assign({}, dateObjValue)
                for (key in dateObj) {
                    if (valueObj[key]) {
                        dateObj[key] = valueObj[key]
                    }
                }
                valueObj = dateObj
            }
            callback(null, valueObj)
        })
    }

    // 文章发布量
    const articleViews = (callback) => {
        const sql = `SELECT * FROM article WHERE createtime <= ${endTime} AND createtime >= ${startTime}`
        connect.query(sql, (error, results, fields) => {
            if (error) throw error
            let valueObj = {}
            results.forEach((item) => {
                let key = moment(item.createtime).format('YYYY-MM-DD')
                if (valueObj[key]) {
                    valueObj[key] = valueObj[key] + 1
                } else {
                    valueObj[key] = 1
                }
            })

            if (file) {
                let dateObj = Object.assign({}, dateObjValue)
                for (key in dateObj) {
                    if (valueObj[key]) {
                        dateObj[key] = valueObj[key]
                    }
                }
                valueObj = dateObj
            }
            callback(null, valueObj)
        })
    }

    async.parallel([enrolment, previewNumber, articleViews], (errer, results) => {
        if (errer) throw error
        res.send({
            status: 200,
            data: {
                enrolment: results[0],
                previewNumber: results[1],
                articleViews: results[2]
            }
        })
    })
}

// 判断ip是否存在
module.exports.ipIsExistence = (req, res) => {
    const ip = req.body.ip
    const sql = `SELECT * FROM previewdata WHERE ip = '${ip}'`

    connect.query(sql, (error, results, fields) => {
        if (error) throw error
        if (results.length > 0) {
            res.send({
                status: 200,
                data: results,
                msg: '此ip存在'
            })
        } else {
            res.send({
                status: 201,
                data: [],
                msg: '此ip不存在'
            })
        }
    })
}

// 记录浏览本站的用户
module.exports.addBrowseUser = (req, res) => {
    const data = req.body,
        ip = data.ip,
        lastTime = new Date().getTime(),
        sumTime = data.sumTime

    const sql = `insert into previewdata(ip, last_time, sum_time) values ('${ip}',' ${lastTime}', '${sumTime}')`
    connect.query(sql, (error, results, fields) => {
        if (error) throw error
        res.send({
            status: 200,
            msg: '本站正在更新中，或许您下一次打开，就会不一样了噢~'
        })
    })
}

// 更新浏览用户的数据
module.exports.updateBrowseUser = (req, res) => {
    const data = req.query,
    id = data.id,
    lastTime = new Date().getTime(),
    sumTime = data.sumTime

    const sql = `UPDATE previewdata SET last_time='${lastTime}', sum_time='${sumTime}' WHERE id=${id}`
    // console.log(sql, 'sql')
    connect.query(sql, (error, results, fields) => {
        if (error) throw error
        res.send({
            status: 200,
            data: results,
            msg: '更新浏览用户的数据'
        })
    })
}

// 文章数据总报表
module.exports.articleSumReport = (req, res) => {
    // 文章阅读数、点赞数、原创数、转载数
    const article = (callback) => {
        const sql = 'SELECT SUM(`read`),SUM(`praise`),COUNT(IF(`original`=0,TRUE,NULL)),COUNT(IF(`original`=1,TRUE,NULL)) FROM article'
        connect.query(sql, (error, results, fields) => {
            if (error) throw error
            if (results.length > 0) {
                callback(null, Object.values(results[0]))
            } else {
                callback(null, [])
            }
        })
    }

    // 评论数(不包括回复数)
    const comment = (callback) => {
        const sql = 'SELECT COUNT(IF(`comment_id`=0,TRUE,NULL)) FROM comment'
        connect.query(sql, (error, results, fields) => {
            if (error) throw error
            if (results.length > 0) {
                callback(null, Object.values(results[0]))
            } else {
                callback(null, [])
            }
        })
    }

    // 评论总条数
    const commentSum = (callback) => {
        const sql = 'SELECT COUNT(*) FROM comment'
        connect.query(sql, (error, results, fields) => {
            if (error) throw error
            if (results.length > 0) {
                callback(null, Object.values(results[0]))
            } else {
                callback(null, [])
            }
        })
    }

    async.parallel([article, comment, commentSum], function (errer, result) {
        if (errer) throw error
        let replyNumber = result[2] - result[1]
        // 阅读数、点赞数、原创数、转载数、评论数、回复数
        let data = [].concat(result[0], result[1], replyNumber)
        res.send({
            status: 200,
            data: {
                title: ['阅读数', '点赞数', '原创数', '转载数', '评论数', '回复数'],
                data: data
            }
        })
    })
}
