// 抓取qq音乐接口


import jsonp from 'common/js/jsonp'
import {commonParams,options} from './config'
// 歌手列表
export function getSingerList() {
    const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
    // 其中第三项参数会覆盖第二项中重复数据
    const data = Object.assign({},commonParams,{
        channel: 'singer',
        page: 'list',
        key: 'all_all_all',
        pagesize: 100,
        pagenum: 1,
        hostUin: 0,
        needNewCode: 0,
        platform: 'yqq',
        g_tk: 1664029744
    })

    return jsonp(url,data,options)
}

// 歌手详情
export function getSingerDetail(singerId) {
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
    // 其中第三项参数会覆盖第二项中重复数据
    const data = Object.assign({},commonParams,{
        hostUin: 0,
        needNewCode: 0,
        platform: 'yqq',
        order: 'listen',
        begin: 0,
        num: 100,
        songstatus: 1,
        singermid: singerId,
        g_tk: 1664029744
    })

    return jsonp(url,data,options)
}