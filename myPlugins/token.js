// 导入签发与验证 JWT 的功能包
const jwt = require('jsonwebtoken')

module.exports.createdToken = (userName, jurisdictionId) => {
    // Token 数据
    const payload = {
        userName: userName,
        jurisdictionId: jurisdictionId
    }

    // 密钥
    const secret = 'YANGHANLIANG'

    // 签发 Token
    const token = jwt.sign(payload, secret, {
        expiresIn: '1day' // 添加时效
    })

    return token
}