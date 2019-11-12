/**
 * 网站信息
 */
const express = require('express')
const router = express.Router()
const sql = require('../../sql/webInfo/index.js')

// 网站展示数据
router.get('/view', (req, res) => {
    sql.getIndex(req, res)
})

module.exports = router
