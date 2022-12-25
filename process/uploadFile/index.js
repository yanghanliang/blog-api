// 处理图片上传
const formidable = require('formidable')
// 引入fs模块
const fs = require('fs')
// WORD 转 PDF
const util = require('util')
// 引入验证方法
const verification = require('./verification')
// 解析excel
const xlsx = require('node-xlsx');
const { resolve } = require('path');
// 上传文件 [图片，word]
module.exports.uploadFile = async (req, res) => {
    let form = new formidable()
    let uploadDir = req.query.uploadDir ? req.query.uploadDir : './uploadFile'
    let type = req.query.type ? req.query.type : 'image'

    //设置文件上传存放地址
    form.uploadDir = uploadDir
    // 保留图片的扩展名
    form.keepExtensions = true
    await new Promise((resolve) => {
      // 判断目录是否存在
      fs.access(uploadDir, fs.constants.F_OK, function (err) {
        if(err) {
          console.log('准备创建目录');
          // 不存在则创建目录
          fs.mkdir(uploadDir, {'recursive': true}, function (success) {
            console.log(success, '创建成功')
            resolve('创建成功')
          })
        } else {
          resolve('目录存在，无需创建')
        }
      })
    })

    console.log('??');
    //执行里面的回调函数的时候，表单已经全部接收完毕了。
    form.parse(req, async (error, fields, files) => {
        console.log('!!');
        // console.log("files:",files)  // 这里能获取到图片的信息
        // console.log("fields:",fields) // 这里能获取到传的参数的信息，如上面的message参数，可以通过fields。message来得到 
        // console.log("path:", files.file.path) // 获取图片路径
        if(error) throw error
        if (type === 'image') {
            verification.image(files, res)
        }

        if (req.query.name) {
          //重命名
          // let ttt = sd.format(new Date(), 'YYYYMMDDHHmmss');
          // let ran = parseInt(Math.random() * 89999 + 10000);
          // let extname = path.extname(files.file.name);
          // __dirname = 'D:\web\mySelf\blog-api\process\uploadFile'
          // files.file = 'uploadFile\word\upload_d22b4fed8a9aaa590d5a465f215b5e71.xls'
          let oldpath = files.file.path
          console.log(files.file.path.split('\\'), '!!')
          let newpath = files.file.path.split('\\').slice(0, -1).join('\\') + '\\' + req.query.name;
          console.log(oldpath, '???', newpath)
          await new Promise((resolve) => {
            fs.rename(oldpath, newpath,function(err){
              if(err){
                console.log(err, '改名失败')
              }
              // 改名成功
              resolve(true)
            });
          })
          const [ data ] = xlsx.parse(newpath);
          console.log(data);
          res.send({
            status: 200,
            url: newpath.replace(/[\\]/g, '/'),
            data,
          })
          return;
        }

        res.send({
          status: 200,
          url: files.file === undefined ? false : files.file.path.replace(/[\\]/g, '/')
        })
    })
}

// 删除文件 [图片]
module.exports.deleteFile = (req, res) => {
    const url = req.body.path
    fs.unlink(url, function(error) {
        if (error) throw error
        res.send({
            status: 200,
            msg: '删除成功'
        })
    })
}

// 文件转换
module.exports.fileConversion = async (req, res) => {
    const data = req.body
    // ./uploadFile/word/upload_2933d38429b89103ddd899436d26bdd7.doc
    const wordUrl = data.wordUrl

    const exec = util.promisify(require('child_process').exec)
    try {
        await exec(`unoconv -f pdf ${wordUrl}`)
        res.send({
            status: 200,
            data: {
                url: wordUrl.match(/[a-zA-Z]{1}.+[.]{1}/) + 'pdf'
            }
        })
    } catch (err) {
        res.send({
            status: 201,
            msg: '转换失败'
        })
    }
}
