import jsonp from 'common/js/jsonp'
import {commonParams,options} from './config'
import axios from 'axios'
//获取轮播数据
export function getRecommend() {
    const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'

    const data = Object.assign({},commonParams,{
        platform: 'h5',
        uin: 0,
        needNewCode: 1
    })

    return jsonp(url,data,options)
}

//获取歌单数据
export function getDiscList() {
    // 直接请求本地代理的接口
    const url = '/api/getDiscList'

    const data = Object.assign({},commonParams,{
        platform: 'yqq',
        hostUin: 0,
        sin: 0,
        ein: 29,
        sortId: 5,
        needNewCode: 0,
        categoryId: 10000000,
        rnd:Math.random(),
        format:'json'
    })
    return axios.get(url,{
        params: data
    }).then((res)=>{
        // 将res.data作为一个Promis对象返回给上面 [object Promise]
        return Promise.resolve(res.data)
    })
    

}
// 获取歌单歌曲数据，请求index中真实接口
export function getSongList(disstid) {
    const url = '/api/getSongList'
    const data = Object.assign({},commonParams,{
        disstid,
        type: 1,
        json: 1,
        utf8: 1,
        onlysong: 0,
        needNewCode: 0,
        hostUin: 0,
        platform: 'yqq.json',
        g_tk: 5381
    })

    return axios.get(url, {
        params: data
      }).then((res) => {
        return Promise.resolve(res.data)
    })
}