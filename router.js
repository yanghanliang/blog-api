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

// 上一篇和下一篇(title id)
router.get('/during/:updatetime', (req, res) => {
    process.during(req, res)
})

// 获取目录数据
router.get('/catalog', (req, res) => {
    process.catalog(req, res)
})
// 文章-end


// 分类-start
// 获取分类数据
router.get('/category', (req, res) => {
    process.category(req, res)
})

// 获取修改分类的数据
router.get('/editCategory/:categoryId', (req, res) => {
    process.editCategory(req, res)
})

// 更新分类数据
router.put('/updateCategory', (req, res) => {
    process.updateCategory(req, res, req.body)
})

// 添加分类
router.post('/addCategory', (req, res) => {
    process.addCategory(req, res, req.body)
})

// 删除分类
router.delete('/deleteCategory/:categoryId', (req, res) => {
    process.deleteCategory(req, res)
})
// 分类-end

// 评论->comment-start
// 添加文章评论
router.post('/addComment', (req, res) => {
    process.addComment(req, res, req.body)
})

// 获取文章评论数据
router.get('/comment/:articleId', (req, res) => {
    process.getArticleCommentData(req, res)
})

// 回复文章评论
router.post('/addReply', (req, res) => {
    process.addReply(req, res, req.body)
})
// comment-end


router.get('/testData', (req, res) => {
    process.testData(req, res)
})

// 将 router 暴露出去
module.exports = router
