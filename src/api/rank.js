import jsonp from 'common/js/jsonp'
import {commonParams,options} from './config'
// 排行榜接口
export function getTopList() {
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'
    // 深拷贝，commonParams参数传入接口中返回数据拷贝到{}对象中
    const data = Object.assign({},commonParams,{
        platform: 'h5',
        needNewCode: 1,
        g_tk: 1928093487,
        format: 'jsonp'
    })
    return jsonp(url,data,options)
}
// 排行榜详情接口
export function getMusicList(topid) {
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'
    // 深拷贝，commonParams参数传入接口中返回数据拷贝到{}对象中
    const data = Object.assign({},commonParams,{
        topid,
        platform: 'h5',
        needNewCode: 1,
        page: 'detail',
        tpl: 3,
        type: top,
        g_tk: 1928093487,
        format: 'jsonp'
    })
    return jsonp(url,data,options)
}