/**
 * 上传文件
 */
const express = require('express')
const router = express.Router()

// 引入处理方法
var process = require('../../process/uploadFile/index.js')

// 添加文件 [添加文章评论]
router.post('/uploadFile', (req, res) => {
    process.uploadFile(req, res)
})

// 删除文件
router.post('/deleteFile', (req, res) => {
    process.deleteFile(req, res)
})

// 文件转换 [word转pdf]
router.post('/fileconversion', (req, res) => {
    process.fileConversion(req, res)
})

module.exports = router
