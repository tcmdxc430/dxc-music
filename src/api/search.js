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

export function search(query,page,zhida,perpage) {
    // const url = 'http://ustbhuangyi.com/music/api/search'
    const url = 'https://c.y.qq.com/soso/fcgi-bin/client_search_cp'
    const data = Object.assign({},commonParams,{
        w:query,
        p:page,
        catZhida: zhida?1:0,
        t: 0,
        flag_qc: 0,
        aggr: 1,
        cr: 1,
        n: perpage,
        remoteplace: 'txt.yqq.song',
        g_tk: 5381,
        loginUin: 0,
        hostUin: 0,
        needNewCode: 0,
        platform: 'yqq.json',
        format: 'jsonp'
    })
    // const data = Object.assign({},commonParams,{
    //     w:query,
    //     p:page,
    //     catZhida: zhida?1:0,
    //     zhidaqu:1,
    //     t: 0,
    //     flag: 1,
    //     aggr: 0,
    //     cr: 1,
    //     ie:'utf-8',
    //     sem:1,
    //     n: perpage,
    //     uin:0,
    //     perpage:perpage,
    //     remoteplace: 'txt.mqq.all',
    //     g_tk: 1928093487,
    //     needNewCode: 1,
    //     platform: 'h5',
    //     format: 'jsonp'
    // })
    return jsonp(url,data,options)
}