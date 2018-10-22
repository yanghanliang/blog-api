// 引入express 第三方包
const express = require('express')

// 创建 app 对象
const app = express()

// 设置请求路径, 当发送 get 请求,访问 "/" 会执行回调函数
app.get('/', (req, res) => res.send('Hello World!'))

// 开启服务器的监听
app.listen(3000, () => console.log('Example app listening on port 3000!'))
