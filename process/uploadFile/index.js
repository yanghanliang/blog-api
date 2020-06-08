// 处理图片上传
const formidable = require('formidable')
// 引入fs模块
const fs = require('fs')
// WORD 转 PDF
// const toPdf = require("office-to-pdf")
// const libre = require('libreoffice-convert')
const util = require('util')
// 引入验证方法
const verification = require('./verification')

// 上传文件 [图片，word]
module.exports.uploadFile = (req, res) => {
    let form = new formidable()
    let uploadDir = req.query.uploadDir ? req.query.uploadDir : './uploadFile'
    let type = req.query.type ? req.query.type : 'image'

    //设置文件上传存放地址
    form.uploadDir = uploadDir
    // 保留图片的扩展名
    form.keepExtensions = true
    // 判断目录是否存在
    fs.access(uploadDir, fs.constants.F_OK, function (err) {
        if(err) {
            // 不存在则创建目录
            fs.mkdir(uploadDir, {'recursive': true}, function (err) {
                console.log(err)
            })
        }
    })

    //执行里面的回调函数的时候，表单已经全部接收完毕了。
    form.parse(req, function(error, fields, files) {
        // console.log("files:",files)  // 这里能获取到图片的信息
        // console.log("fields:",fields) // 这里能获取到传的参数的信息，如上面的message参数，可以通过fields。message来得到 
        // console.log("path:", files.file.path) // 获取图片路径
        if(error) throw error
        if (type === 'image') {
            verification.image(files, res)
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
    // const data = req.body
    // const from = data.from
    // const to = data.to ? data.to : `../../uploadFile/${new Date().getTime()}.pdf`
    // console.log(from, to, 'from, to')
    // const wordBuffer = fs.readFileSync('./uploadFile/word/upload_2933d38429b89103ddd899436d26bdd7.doc')
    
    // const data = await toPdf(wordBuffer).then((pdfBuffer) => {
    //         fs.writeFileSync('./uploadFile/pdf/test.pdf', pdfBuffer)
    //         // res.send({
    //         //     status: 200,
    //         //     url: to
    //         // })
    //     }, (err) => {
    //         console.log(err)
    //     }
    // )

    // console.log(data, 'data')

    

    
    // const extend = '.pdf'
    // // const enterPath = path.join(__dirname, '/resources/example.docx');
    // // const outputPath = path.join(__dirname, `/resources/example${extend}`);
    
    // // Read file
    // const enterPath = fs.readFileSync('./uploadFile/word/upload_2933d38429b89103ddd899436d26bdd7.doc');
    // console.log(enterPath, 'enterPath')
    // // Convert it to pdf format with undefined filter (see Libreoffice doc about filter)
    // libre.convert(enterPath, extend, undefined, (err, done) => {
    //     if (err) {
    //         console.log(`Error converting file: ${err}`)
    //     }
        
    //     // Here in done you have pdf file which you can save or transfer in another stream
    //     fs.writeFileSync('./uploadFile/pdf/test.pdf', done)
    // })


    
    const exec = util.promisify(require('child_process').exec)
    async function createPDFExample () {
        const { stdout, stderr } = await exec('unoconv -f pdf ./uploadFile/word/upload_2933d38429b89103ddd899436d26bdd7.doc')
        console.log('stdout:', stdout)
        console.log('stderr:', stderr)
    }

    createPDFExample()
}
