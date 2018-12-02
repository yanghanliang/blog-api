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

router.get('/aa', function (req, res) {
    res.send('aa页面')
})

router.post('/login', function (req, res) {
    process.login(req, res, req.body) // 调用自定义登录的方法
})

router.get('/index', function (req, res) {
    process.getIndex(req, res) // 获取首页需要的数据
})

router.get('/articleDetakils/:articleId', (req, res) => {
    process.articleDetails(req, res) // 获取文章详情数据
})
// 将 router 暴露出去
module.exports = router