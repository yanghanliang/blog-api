// 创建外置路由
// 引入 express 模块包
var express = require('express')

// 引入处理方法
var process = require('../process.js')

const comment = require('./comment/index.js')
const article = require('./article/index.js')
const category = require('./category/index.js')
const webInfo = require('./webInfo/index.js')
const handleFile = require('./handleFile/index.js')
const user = require('./user/index.js')
const jurisdiction = require('./jurisdiction/index')
const components = require('./components/index')
const echarts = require('./echarts/index.js')
const bookmark = require('./bookmark/index')

const baseURL = '/api';
// 创建路由对象
var router = express.Router()
router.use(baseURL, comment)                             // 评论
router.use(baseURL, article)                             // 文章
router.use(baseURL, category)                            // 分类
router.use(baseURL, webInfo)                             // 网站数据
router.use(baseURL, handleFile)                          // 操作文件
router.use(baseURL + '/user', user)                       // 用户
router.use(baseURL + '/jurisdiction', jurisdiction)       // 权限
router.use(baseURL + '/components', components)           // 组件
router.use(baseURL + '/echarts', echarts)                 // 图表数据
router.use(baseURL + '/bookmark', bookmark)               // 书签

// 调用自定义登录的方法
router.post(baseURL + '/login', (req, res) => {
    process.login(req, res, req.body)
})

// 获取首页需要的数据
router.get(baseURL + '/index', (req, res) => {
    process.getIndex(req, res) 
})

router.get(baseURL + '/testData', (req, res) => {
    process.testData(req, res)
})

router.all('*', (req, res) => {
    // `Access to XMLHttpRequest at 'http://127.0.0.1:3001/chart/web/is/ip' from origin 'http://localhost:8080' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: It does not have HTTP ok status.`
    // 有时候报这种跨域问题时因为没有找到对应的路由导致的
    console.log(req.originalUrl, 'req??')
    res.send({
        status: 404,
        data: ''
    })
})

// 将 router 暴露出去
module.exports = router
