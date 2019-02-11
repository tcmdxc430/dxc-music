import {commonParams} from './config'
import axios from 'axios'
// mid歌曲id
export function getLyric(mid) {
  const url = '/api/lyric'

  const data = Object.assign({}, commonParams, {
    g_tk:5381,
    songmid: mid,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    // categoryId: 10000000,
    pcachetime: +new Date(),
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    // 如果嫩更匹配到callback个事返回，将callback转为json
    var reg = /^\w+\(({[^()]+})\)$/
    var matches = res.data.match(reg)
    if(matches) {
      res.data = JSON.parse(matches[1])
    }
    return Promise.resolve(res.data)
  })
}

export function getMusic(mid) {
  const url = '/api/getMusic'

  const data = Object.assign({}, commonParams, {
    songmid: mid,
    filename: 'C400' + mid + '.m4a',
    guid: 1819638027,
    platform: 'yqq',
    loginUin: 0,
    hostUin: 0,
    needNewCode: 0,
    g_tk:5381,
    uin: 0,
    cid: 205361747,
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}