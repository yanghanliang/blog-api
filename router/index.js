// 创建外置路由
// 引入 express 模块包
var express = require('express')

// 引入处理方法
var process = require('../process.js')

const comment = require('./comment/index.js')
const article = require('./article/index.js')
const category = require('./category/index.js')
const webInfo = require('./webInfo/index.js')
const uploadFile = require('./uploadFile/index.js')
const user = require('./user/index.js')
const jurisdiction = require('./jurisdiction/index')

// 创建路由对象
var router = express.Router()

router.use(comment)                             // 评论
router.use(article)                             // 文章
router.use(category)                            // 分类
router.use(webInfo)                             // 网站数据
router.use(uploadFile)                          // 上传文件
router.use('/user', user)                       // 用户
router.use('/jurisdiction', jurisdiction)       // 权限


// 调用自定义登录的方法
router.post('/login', (req, res) => {
    process.login(req, res, req.body) 
})

// 获取首页需要的数据
router.get('/index', (req, res) => {
    process.getIndex(req, res) 
})

router.get('/testData', (req, res) => {
    process.testData(req, res)
})

// 将 router 暴露出去
module.exports = router
