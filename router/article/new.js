/**
 * 新的文章
 */
const express = require('express')
const router = express.Router()

// 方法
var article = require('../../process/article')

// 根据关键字和分类进行只能推荐
router.post('/recommend', (req, res) => {
    article.recommend(req, res)
})

// 修改文章点赞数
router.post('/praise', (req, res) => {
    article.praise(req, res)
})

// 查询文章是否存在
router.get('/isExistence', (req, res) => {
    article.isExistence(req, res)
})

module.exports = router
