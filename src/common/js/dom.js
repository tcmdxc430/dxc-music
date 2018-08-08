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
// 给event添加index值
export function getData(el,name,val) {
    const prefix = "data-"
    name = prefix+name
    if(val) {
        // 设置name=val
        return el.setAttribute(name,val) 
    }else {
        // 获取value为data-index的key
        console.log(name)
        return el.getAttribute(name)
    }
}