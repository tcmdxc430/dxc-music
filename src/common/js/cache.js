// 封装本地缓存

// 保存点击过的字段
import storage from 'good-storage';// 由于localstorage存储的是字符串，需要存储数组转换麻烦，引入第三方封装好的storage库
// 仅内部使用的key列表 为了不会命名冲突
const SEARCH_KEY = '__search__'
const SEARCH_MAX_LENGTH = 15 // 最多存15条历史

const PLAY_KEY = '__play__'
const PLAY_MAX_LENGTH = 200// 播放记录最大值

const FAVORITE_KEY = '__favorite__'
const FAVORITE_MAX_LENGTH = 200// 收藏列表最大值
// 去除重复字段并使最新字段展示在最前方
function insertArray(arr, val,compare,maxLen){
    // 查找arr数组中是否有这个字段，并返回位置，传入一个function，compare
    const index = arr.findIndex(compare)
    console.log(index)
    // 如果该字段本来就再最前方，直接返回
    if(index === 0){
        return
    }
    if(index>0){
        // 如果该字段已有 但不在最前方 删除该字段
        arr.splice(index,1)
    }
    // 并将刚传入字段插入到最前方位置 或者当列表中本来就没有该字段时也插入到最前方
    arr.unshift(val)
    // 当传入了maxLen并且已经超出限制长度
    if(maxLen&&arr.length>maxLen){
        // 将数组最后放的字段删除
        arr.pop()
    }
}
// 通用方法：从数组中删除一个
function deleteFromArray(arr,compare){
    // 查找arr数组中是否有这个字段，并返回位置，传入一个function，compare
    const index = arr.findIndex(compare)
    if(index>-1){
        arr.splice(index,1)
    }
}

export function saveSearch(query) {
    // 获取现有历史列表，如果没有返回[]
    let searches = storage.get(SEARCH_KEY,[])
    // 列表中每一个值和query进行比较
    insertArray(searches,query,(item)=>{
        console.log(item)
        console.log(query)
        return item === query
    },SEARCH_MAX_LENGTH)
    // 存储生成的searches
    storage.set(SEARCH_KEY,searches)
    return searches
}
// 存储播放记录
export function savePlay(song) {
    // 获取现有播放记录，如果没有返回[]
    let songs = storage.get(PLAY_KEY,[])
    // 把正在播放的song插入的songs中，并判断是否已经存在
    insertArray(songs,song,(item)=>{
        return item.id === song.id
    },PLAY_MAX_LENGTH)
    // 存储生成的songs到本地
    storage.set(PLAY_KEY,songs)
    return songs
}

// 从本都缓存读取searchlist
export function loadSearch(){
    // 如果没有设为空
    return storage.get(SEARCH_KEY,[])
}

// 从本都缓存读取songs播放记录
export function loadPlay(){
    // 如果没有设为空
    return storage.get(PLAY_KEY,[])
}

// 删除指定历史记录方法
export function deleteSearch(query){
    // 获取现有历史列表，如果没有返回[]
    let searches = storage.get(SEARCH_KEY,[])
    deleteFromArray(searches,(item)=>{
        return item === query
    })
    // 存储生成的searches
    storage.set(SEARCH_KEY,searches)
    return searches
}
// 删除全部搜索记录
export function clearSearch(){
    storage.remove(SEARCH_KEY)
    return []
}
// 存储收藏歌曲
export function saveFavorite(song){
    // 获取现有收藏列表，如果没有返回[]
    let songs = storage.get(FAVORITE_KEY,[])
    // 把正在播放的song插入的songs中，并判断是否已经存在 
    insertArray(songs,song,(item)=>{
        return item.id === song.id
    },FAVORITE_MAX_LENGTH)
    // 存储生成的songs到本地
    storage.set(FAVORITE_KEY,songs)
    return songs
}
// 删除指定收藏
export function deleteFavorite(song){
    // 获取现有收藏列表，如果没有返回[]
    let songs = storage.get(FAVORITE_KEY,[])
    deleteFromArray(songs,(item)=>{
        return item.id === song.id
    })
    // 存储生成的songs到本地
    storage.set(FAVORITE_KEY,songs)
    return songs
}
// 从本都缓存读取初始化收藏
export function loadFavorite(){
    // 如果没有设为空
    return storage.get(FAVORITE_KEY,[])
}
