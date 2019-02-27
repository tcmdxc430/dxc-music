import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'

export function getHotKey() {
    const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'
    // 深拷贝，commonParams参数传入接口中返回数据拷贝到{}对象中 其中第三项参数会覆盖第二项中重复数据
    const data = Object.assign({},commonParams,{
        platform: 'h5',
        needNewCode: 1
    })
    return jsonp(url,data,options)
}