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

module.exports = router
