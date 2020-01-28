/**
 * 上传文件
 */
const express = require('express')
const router = express.Router()

// 引入处理方法
var process = require('../../process/uploadFile/index.js')

// 添加文章评论
router.post('/uploadFile', (req, res) => {
    process.uploadFile(req, res, req.body)
})

module.exports = router
