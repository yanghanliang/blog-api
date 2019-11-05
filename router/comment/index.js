/**
 * 评论
 */
const express = require('express')
const router = express.Router()

// 引入处理方法
var process = require('../../process.js')

// 添加文章评论
router.post('/addComment', (req, res) => {
    process.addComment(req, res, req.body)
})

// 获取文章评论数据
router.get('/comment/:articleId', (req, res) => {
    process.getArticleCommentData(req, res)
})

// 回复文章评论
router.post('/addReply', (req, res) => {
    process.addReply(req, res, req.body)
})

// 获取文章评论数据
router.get('/getCommentData/:id', (req, res) => {
    process.getCommentData(req, res)
})

// 验证评论用户的身份
router.post('/verifyPassword', (req, res) => {
    process.verifyPassword(req, res, req.body)
})

// 验证昵称是否存在
router.get('/aliasValidation/:alias', (req, res) => {
    process.aliasValidation(req, res)
})

// 修改评论信息
router.post('/modifyCommentInformation', (req, res) => {
    process.modifyCommentInformation(req, res, req.body)
})

module.exports = router
