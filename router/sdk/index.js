// TypeScript
import AlipaySdk from 'alipay-sdk'

// 
export function testData (req, res) {
    console.log(AlipaySdk, 'AlipaySdk')
    AlipaySdk = AlipaySdk.default
    // 普通公钥模式
    const alipaySdk = new AlipaySdk({
        // 参考下方 SDK 配置
        appId: '2021001171617650',
        privateKey: 'MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC4+waa22XSMIPbYC7ydpmoIltvYSqMC2VMXowYOXp5gblDAhL1ohEwgO1bAVQuJXPhdjQ9BoY076ZCugta/PuPbEe5vwBQveX9tLiFxy/IRfz06sibeFjiFn7dCOl0qIE/OmV/kglMyZYCzvC82suJlgTZY98D9cTZdaY1pdWgvDLl4Ys+jAU7/p+PyHCUdIGkrjgZwHRxfzBlXDEJBJH64y3uTa61TVg9Zp09nzWkjEiF9HVUm4mrWVoAyqS8DPdIovdBIsJ0wgMv7r7+1Mx2v7YqO6HPO+HVP/iHBREo8PqzAZSaKygL4FX46etM32BBR7R12LCPEdfEWaE/t0G7AgMBAAECggEARU6wk9b+WHma/dgU3v225rswvROP6HbglnOaU/09OUd0jXm6dtQpUp4L0Jw32S5pM6GhQvgt0qm0Bq5EUOwWqQ8t9Jdu29G62Ysb0+vkqEoo0+8gCLhXvSYmlFShe/cirfkITHsABwhEr3qv0mK7/in6WSVFSuuLvNqK0vD2kMkvFz3nqSzycTkUR+EfxZtIvcwj9KKlK0aoc7uX5OmXbo+SmSL5YO1cW04zfhQVurO0cUHoVRmhAgR1CmQYtDb3yatAH4VCV30o/0qWGrcaQLwAa0SyPGEOLf4e2Buy9h+tDisgO+/CD/Cqxa5lei0EixKfgFJa61V/KSrpFDJwSQKBgQDuxFzzMK4q/osxUcv3AJoC+hSxCWg7yveEOjdIj+612p2atest6o6O1ibwEYydqSKNFqcTBkspRby+hBKxABxY1x/pYO+UEwVZsLF+9UnUm2g/5Fu/aybYlqSABhFMX4nX2AI7vCdVPZx4La6C/dlZdcytrfH7vCLFX16F9QkI9QKBgQDGVN0rsJ0qcTVcp5UpPaoof4hr+wSe4m/nsco9ol2YO645sD3cvHRbB/6vfoBrL4P4yihTSwJsY9hQZLJU6wkhIbwq7H+Ex/mwN4FV4C6zwjaerf5aYMuKWA2R5eW8MqnLoFSydsfttPRiggBFneihHP8UzchgNpZtry3QZK0x7wKBgQDG6eQd3eJbgy/m6KQppOCptjniu1mQ5qiKCg3gb7iI3BYMu52v5QbazGIoAhbJigx0yfhqiwW23pg9h74io1r6UE4PmWg+ThJZBDD6+dKGQun4wIAG2nfEXMuytFtY6wblQNmrdja2dtuR60zFaEHYm6Dm2FEOTVASaj9PDjJ2uQKBgQCoKzlGXIFHhaqrn+WYjJMFt+3jMXtfhb1Bhr1nuY8HEEPQ4qHx01IOBh9siyU0vZt3j2LWDZpGcfrvYBLeclTRZRt6ggI2gqIzSz09pdOz1JAfyIUN+VldOwB2n6tHAuZ6pL5sfM9VvcQi6vx0C0s/oaig6URoYKD47Ds6osNAvQKBgELgjkj1H65rThyLGlIsx+j5xBC9a5zfCKfF6C2r7DuiFpfnFHBJd5RRZ5hrt+xHJWdxpVYBw4maLWfjYAb9D+8U3ycl5T5+Iye/s77dpO+UCllwxuMZyyRKR1ERjoYnbC+5JerskqUx0N06TshvhEN6RhvoT2rRQwP6i1yW0Dns',
    });
    console.log(alipaySdk, 'alipaySdk')

    const result = alipaySdk.exec('alipay.system.oauth.token', {
        grantType: 'authorization_code',
        code: 'code',
        refreshToken: 'token'
    });

    console.log(result, 'result')

    res.send({
        status: 200,
        data: result
    })
}