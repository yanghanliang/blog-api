/**
 * 用户
 */
const express = require('express')
const router = express.Router()

// 引入处理方法
var process = require('../../process/user/index.js')

// 添加用户
router.post('/addUser', (req, res) => {
    process.addUser(req, res, req.body)
})

// 验证昵称是否已存在
router.get('/userNameValidation', (req, res) => {
    process.userNameValidation(req, res)
})

module.exports = router
