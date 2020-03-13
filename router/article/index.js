/**
 * 文章
 */
const express = require('express')
const router = express.Router()

// 引入新的文章接口
var article = require('./new')
// 引入处理方法
var process = require('../../process.js')

router.use('/article', article)

// 添加文章
router.post('/addArticle', (req, res) => {
    process.addArticle(req, res, req.body)
})

// 获取文章列表(后台)
router.get('/articleList/:sortField/:orderBy/:number', (req, res) => {
    process.articleList(req, res)
})

// 修改文章
router.put('/editArticle/:articleId', (req, res) => {
    process.editArticle(req, res, req.body)
})

// 删除文章
router.delete('/deleteArticle/:articleId', (req, res) => {
    process.deleteArticle(req, res)
})

// 获取文章详情数据
router.get('/articleDetails/:articleId', (req, res) => {
    process.articleDetails(req, res)
})

// 搜索内容
router.post('/searchData', (req, res) => {
    process.searchData(req, res, req.body)
})

// 文章分页
router.post('/paging', (req, res) => {
    process.paging(req, res, req.body)
})

// 获取文章分类数据
router.get('/articleCategory/:classname', (req, res) => {
    process.articleCategory(req, res)
})

// 记录文章阅读数
router.get('/recordReadingNumber/:articleId', (req, res) => {
    process.recordReadingNumber(req, res)
})

// 上一篇和下一篇(title id)
router.get('/during/:createtime', (req, res) => {
    process.during(req, res)
})

// 获取目录数据
router.get('/catalog', (req, res) => {
    process.catalog(req, res)
})

module.exports = router
