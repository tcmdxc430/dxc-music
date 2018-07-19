// 抽象出歌手列表中数据共同字段,构造一个singer类
export default class Singer {
    constructor({id,name}) {
        this.id = id
        this.name = name
        this.avatar = `https://y.gtimg.cn/music/photo_new/T001R300x300M000${id}.jpg?max_age=2592000`
    }
}