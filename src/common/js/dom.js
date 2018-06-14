// 操作dom的公共js

// 添加样式,el=>dom对象
export function addClass(el, className) {
    if(hasClass(el,className)) {
        return
    }
    //将el中className用空格分割
    let newClass = el.className.split(' ')
    // 将新传入className push加入
    newClass.push(className)
    // 依旧在新className前加空格链接
    el.className = newClass.join(' ')
}
// 判断如果dom本身已经含有该className 则直接使用dom的className
export function hasClass(el,className) {
    // ^=>className   \\s=>空白字符  $=>结束 注意正则中小括号
    let reg = new RegExp('(^|\\s)'+className+'(\\s|$)')
    return reg.test(el.className)
}