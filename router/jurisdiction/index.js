/**
 * 权限
 */
const express = require('express')
const router = express.Router()

// 引入处理方法
var process = require('../../process/jurisdiction/index.js')

router.get('/list/:distribution?', (req, res) => {
    process.list(req, res)
})

router.post('/add', (req, res) => {
    process.add(req, res)
})

router.post('/verification', (req, res) => {
    process.verification(req, res)
})

router.get('/details/:id', (req, res) => {
    process.details(req, res)
})

router.put('/edit/:id', (req, res) => {
    process.edit(req, res)
})

router.delete('/delete/:id', (req, res) => {
    process.delete(req, res)
})

module.exports = router
