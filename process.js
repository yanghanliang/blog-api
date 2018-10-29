// 导入自定义操作数据库的方法
const connect = require('./database.js')

// 访问首页
module.exports.getIndex = function(req, res) {
    connect.query("SELECT * FROM user WHERE username='admin' and password='123456'", function(error, results, fields) {
        if(error) throw error

        if(results.length === 1) {
            res.json({
                state: 1,
                msg: '正确'
            })
        } else {
            res.json({
                state: 0,
                msg: '用户名或密码不正确'
            })
        }
    })
}

// 登录验证
module.exports.login = function(req, res, data) {
    const sql = "SELECT * FROM user WHERE username='"+ data.username +"' and password='" + data.password +"'"
    connect.query(sql, function(error, results, fields) {
        if(error) throw error

        if(results.length === 1) {
            res.json({
                state: 1,
                msg: '登录成功!'
            })
        } else {
            res.json({
                state: 0,
                msg: '用户名或密码不正确!'
            })
        }
    })
}
