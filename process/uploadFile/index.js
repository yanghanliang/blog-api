// 处理图片上传
var formidable = require('formidable')

module.exports.uploadFile = (req, res) => {
    var form = new formidable.IncomingForm()
    //设置文件上传存放地址
    form.uploadDir = "./uploadFileURl"
    // 保留图片的扩展名
    form.keepExtensions = true

    //执行里面的回调函数的时候，表单已经全部接收完毕了。
    form.parse(req, function(error, fields, files) {
        // console.log("files:",files)  // 这里能获取到图片的信息
        // console.log("fields:",fields) // 这里能获取到传的参数的信息，如上面的message参数，可以通过fields。message来得到 
        // console.log("path:", files.file.path) // 获取图片路径
        if(error) throw error
        if (files.file.size/1024/1024 > 5 || files.file === undefined) {
            res.send({
                status: 201,
                msg: '上传头像图片大小不能超过 5MB!'
            })
        } else if (files.file.type.indexOf('image') === -1) {
            res.send({
                status: 201,
                msg: '请提交图片格式的文件，如后缀名为： .gif、.png、.jpg'
            })
        } else {
            res.send({
                status: 200,
                url: files.file === undefined ? false : files.file.path.replace(/[\\]/g, '/')
            })
        }
    })
}
