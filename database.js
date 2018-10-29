// 导入 mysql 包
const mysql = require('mysql')

// 配置连接参数
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'blog'
})

// 连接数据库
connection.connect()

// 将操作数据库的方法暴露出去
module.exports = connection
// 关闭数据库
// connection.end()