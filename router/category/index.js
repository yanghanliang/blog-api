/**
 * 分类
 */
const express = require('express')
const router = express.Router()

// 引入处理方法
var process = require('../../process/category/index.js')

// 获取分类数据
router.get('/category', (req, res) => {
    process.category(req, res)
})

// 获取修改分类的数据
router.get('/editCategory/:categoryId', (req, res) => {
    process.editCategory(req, res)
})

// 更新分类数据
router.put('/updateCategory', (req, res) => {
    process.updateCategory(req, res, req.body)
})

// 添加分类
router.post('/addCategory', (req, res) => {
    process.addCategory(req, res, req.body)
})

// 删除分类
router.delete('/deleteCategory/:categoryId', (req, res) => {
    process.deleteCategory(req, res)
})

// 查询分类
router.post('/category/query/className', (req, res) => {
    process.queryClass(req, res)
})

module.exports = router
