/**
 * 组件
 */
const express = require('express')
const router = express.Router()
// 引入处理方法
var process = require('../../process/components/index.js')

// 修改组件内容
router.put('/edit', (req, res) => {
    process.edit(req, res)
})

// 获取组件详情
router.get('/details', (req, res) => {
    process.details(req, res)
})

module.exports = router
