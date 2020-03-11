/**
 * 获取图表数据
 */
const express = require('express')
const router = express.Router()

// 引入处理方法
var process = require('../../process/echarts/index.js')

// 获取网站信息
router.post('/web/info', (req, res) => {
    process.webInfo(req, res)
})

// 判断ip是否存在
router.post('/web/is/ip', (req, res) => {
    process.ipIsExistence(req, res)
})

// 记录浏览本站的用户
router.post('/add/browse/user', (req, res) => {
    process.addBrowseUser(req, res)
})

// 更新浏览用户的数据
router.get('/update/browse/user', (req, res) => {
    process.updateBrowseUser(req, res)
})

// 文章数据总报表
router.get('/article/sum/report', (req, res) => {
    process.articleSumReport(req, res)
})

module.exports = router
