import {getLyric} from 'api/song'
import {ERR_OK} from 'api/config'
import {Base64} from 'js-base64' // 解码库
// 构造歌曲类
export default class Song {
    // duration歌曲时间长度  singer歌手名字  name歌曲名字
    constructor({id,mid,singer,name,album,duration,image,url}) {
        this.id = id
        this.name = name
        this.singer = singer
        this.mid = mid
        this.album = album
        this.duration = duration
        this.image = image
        this.url = url
    }
    getLyric(){
        if(this.lyric){
            return Promise.resolve(this.lyric)
        }
        return new Promise((resolve,reject)=>{
            getLyric(this.mid).then((res)=>{
                if(res.retcode == ERR_OK){
                    this.lyric = Base64.decode(res.lyric)
                    resolve(this.lyric)
                }else{
                    reject('没词了')
                }
            })
        })
        
    }
}
// 构造一个数据factory 存放处理好的歌曲数据
export function createSong(musicData,songVkey) {
    return new Song({
        id: musicData.songid,
        mid: musicData.songmid,
        singer: filterSinger(musicData.singer),
        name: musicData.songname,
        album: musicData.albumname,
        duration: musicData.interval,
        // image: `https://y.gtimg.cn/music/photo_new/T001R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
        image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
        url: `http://dl.stream.qqmusic.qq.com/C400${musicData.songmid}.m4a?vkey=${songVkey}&guid=1819638027&uin=0&fromtag=66`

    })
}

export function filterSinger(singer) {
    let ret = []
    if(!singer) {
        return ''
    }

    singer.forEach((s) => {
        ret.push(s.name)
    });
    //数组数据用/分开
    return ret.join('/')
}