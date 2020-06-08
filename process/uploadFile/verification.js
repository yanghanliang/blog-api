// 引入fs模块
const fs = require('fs')

// 图片验证
module.exports.image = function (files, res) {
    if (files.file.size/1024/1024 > 5 || files.file === undefined) {
        fs.unlink(files.file.path, function(error) {
            if (error) throw error
        })
        res.send({
            status: 201,
            msg: '上传头像图片大小不能超过 5MB!'
        })
    } else if (files.file.type.indexOf('image') === -1) {
        console.log(files.file.path, 'files.file.path')
        fs.unlink(files.file.path, function(error) {
            if (error) throw error
        })
        console.log('????123')
        res.send({
            status: 201,
            msg: '请提交图片格式的文件，如后缀名为： .gif、.png、.jpg'
        })
    }
}

// 