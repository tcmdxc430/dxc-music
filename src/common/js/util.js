// 通用工具方法


// 制造随机数组方法 
export function shuffle(arr) {
    // slice返回一个复制arr的数组
    let _arr = arr.slice()
    // 随机对调数组中的两个索引
    for(i in _arr.length){
        let j = getRandomInt(0,i)
        let t = _arr[i]
        _arr[i] = _arr[j]
        _arr[j] = t
    }
    return _arr
}
// 制造随机数组的辅助方法  返回min和max之间的随机数 且包含max min
function getRandomInt(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min)
}