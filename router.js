// 创建外置路由
// 引入 express 模块包
var express = require('express')

// 引入处理方法
var process = require('./process.js')

// 创建路由对象
var router = express.Router()

// 调用自定义登录的方法
router.post('/login', (req, res) => {
    process.login(req, res, req.body) 
})

// 获取首页需要的数据
router.get('/index', (req, res) => {
    process.getIndex(req, res) 
})

// 文章-start
// 添加文章
router.post('/addArticle', (req, res) => {
    process.addArticle(req, res, req.body)
})

// 获取文章列表
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
// 文章-end


// 分类-start
// 获取分类数据
router.get('/category', (req, res) => {
    process.category(req, res)
})

router.post('/addCategory', (req, res) => {
    process.addCategory(req, res, req.body)
})
// 分类-end

router.get('/testData', (req, res) => {
    process.testData(req, res)
})

// 将 router 暴露出去
module.exports = router
