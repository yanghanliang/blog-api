
// 导入 mysql 包
const mysql = require('mysql')
const fs = require('fs')
const exec = require('child_process').exec

// 普通连接-start
// 配置连接参数
// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'root',
//     database: 'blog'
// })

// 连接数据库
// connection.connect()

// 将操作数据库的方法暴露出去
// module.exports = connection
// 普通连接-end

// 连接池连接-start
let pool  = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'blog'
})

// 实现数据备份
let today = new Date().getTime()
pool.on('acquire', function (connection) {
    let time = new Date().getTime()
    // 每隔1个小时删除一次备份数据
    if (time - today > 1 * 60 * 60 * 1000) {
        today = time
        let backupsSqlData = fs.readdirSync('./backupsSqlData')
        // 遍历所有的备份文件
        backupsSqlData.map((file, key) => {
            // 留最后一个备份数据
            if (key < backupsSqlData.length - 1) {
                // 删除备份文件
                fs.unlink(`./backupsSqlData/${file}`,(error) => {
                    if (error) throw error
                })
            }
        })
    }

    // 数据备份
    let path = `${__dirname}//backupsSqlData//${time}.sql`
    let sql = `mysqldump -h127.0.0.1 -P3306 -uroot -proot blog -B > ${path}`
    exec(sql, (error, stdout, stderr) => {
        if (error) throw error
    })
})

// pool.on('connection', function (connection) {
//     console.log('b')
// })

// pool.on('enqueue', function () {
//     console.log('c')
// })

// 将操作数据库的方法暴露出去
module.exports = pool
// 连接池连接-end


// 关闭数据库
// connection.end()