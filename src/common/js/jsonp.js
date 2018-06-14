import originJSONP from 'jsonp'

export default function jsonp(url,data,options) {
    url += (url.indexOf('?')<0?'?':'&')+param(data) // 如url中没有？则加上？，如已有加上&
 return new Promise((resolve,reject) => {
    originJSONP(url,options,(err,data) => {
        // err==null 表示成功
        if(!err) {
            resolve(data)
        }else {
            reject(err)
        }
    })
 })
}

function param(data) {
    let url = ''
    for(var k in data) {
        let value = data[k] !== undefined?data[k]:'' // 如果data[k]是undefined赋值为空
        url += `&${k}=${encodeURIComponent(value)}` // key:value
    }
    return url?url.substring(1):'' // 
}