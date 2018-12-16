// 创建外置路由
// 引入 express 模块包
var express = require('express')

// 引入处理方法
var process = require('./process.js')


// const async = require('async')

// 创建路由对象
var router = express.Router()

// 设置路由
// router.get('/', function (req, res) {
//     process.getIndex(req, res)
//     // res.send('hello world')
// })

router.get('/aa', (req, res) => {
    res.send('aa页面')
})

// 调用自定义登录的方法
router.post('/login', (req, res) => {
    process.login(req, res, req.body) 
})

// 获取首页需要的数据
router.get('/index', (req, res) => {
    process.getIndex(req, res) 
})

// 添加文章
router.post('/addArticle', (req, res) => {
    process.addArticle(req, res, req.body)
})

// 获取文章列表
router.get('/articleList', (req, res) => {
    process.articleList(req, res)
})

// 修改文章
router.put('/editArticle/:articleId', (req, res) => {
    process.editArticle(req, res, req.body)
})

// 获取文章详情数据
router.get('/articleDetakils/:articleId', (req, res) => {
    process.articleDetails(req, res)
})

// 将 router 暴露出去
module.exports = router
