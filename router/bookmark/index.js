/**
 * 书签
 */
const express = require('express')
const router = express.Router()

// 引入处理方法
var process = require('../../process/bookmark/index.js')

// 添加书签
router.post('/add', (req, res) => {
    process.add(req, res)
})

// 查询书签名称是否已存在
router.get('/query', (req, res) => {
    process.query(req, res)
})

// 获取书签列表
router.get('/list', (req, res) => {
    process.list(req, res)
})

// 获取书签详情
router.get('/detail', (req, res) => {
    process.detail(req, res)
})

// 修改书签详情
router.put('/edit', (req, res) => {
    process.edit(req, res, req.body)
})

// 获取书签导航列表
router.get('/nav', (req, res) => {
    process.bookmarkNav(req, res)
})

// 获取书签分类列表
router.get('/categoryList', (req, res) => {
    process.categoryList(req, res)
})

// 删除书签分类
router.delete('/delete/:categoryId', (req, res) => {
    process.deleteCatrgory(req, res)
})

module.exports = router
