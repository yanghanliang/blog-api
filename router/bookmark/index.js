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

module.exports = router
