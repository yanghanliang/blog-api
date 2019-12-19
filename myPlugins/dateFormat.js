var minute = 1000 * 60
var hour = minute * 60
var day = hour * 24
var month = day * 30

// 把年月日时间转化成刚刚，几分钟前，几小时前，几天前
function getDate(dateTimeStamp) {
    if (!dateTimeStamp) {
        return false
    } else {
        dateTimeStamp = dateTimeStamp.replace(/\-/g, "/")
        var sTime = new Date(dateTimeStamp).getTime() // 把时间 pretime 的值转为时间戳
        var now = new Date().getTime() // 获取当前时间的时间戳
        var diffValue = now - sTime
        var monthC = diffValue / month
        var weekC = diffValue / (7 * day)
        var dayC = diffValue / day
        var hourC = diffValue / hour
        var minC = diffValue / minute

        if (monthC >= 1) {
           return parseInt(monthC) + "个月前"
        } else if (weekC >= 1) {
            return parseInt(weekC) + "周前"
        } else if (dayC >= 1) {
           return parseInt(dayC) + "天前"
        } else if (hourC >= 1) {
            return parseInt(hourC) + "个小时前"
        } else if (minC >= 1) {
            return parseInt(minC) + "分钟前"
        } else {
            return "刚刚"
        }
    }

}

/**
 * 解决nodejs中json序列化时Date类型默认为UTC格式
 * @param {object}           date // new Data('2019-01-02')
 */
function dateFormat(date, fmt) {
    fmt = fmt ? fmt : 'yyyy-MM-dd hh:mm:ss'
    if (null == date || undefined == date) return '';
    var o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }

    return getDate(fmt)
}

exports.dateFormat = dateFormat
