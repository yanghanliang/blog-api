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

// 获取用户列表
router.get('/list', (req, res) => {
    process.userList(req, res)
})

// 获取用户权限(前端-不需要传任何参数，从token中获取权限)
router.get('/jurisdiction', (req, res) => {
  console.log('userJurisdiction, userJurisdiction')
    process.userJurisdiction(req, res)
})

// 获取用户权限(后端-需要传入userName)
router.post('/jurisdictions', (req, res) => {
    process.userJurisdictions(req, res)
})

// 修改用户权限
router.put('/jurisdiction/edit', (req, res) => {
    process.editUserJurisdiction(req, res)
})

// 获取用户不存且需要验证的路由权限
router.get('/not/jurisdiction', (req, res) => {
    process.getNotJurisdiction(req, res)
})

// 获取用户详情
router.get('/details', (req, res) => {
    process.details(req, res)
})

router.get('/ip', (req, res) => {
    process.getUserIp(req, res)
})

module.exports = router
