/**
 * 获取url后参数
 */
export const GetRequest = () => {
  let url = location.search // 获取url中"?"符后的字串
  let theRequest = {}
  if (url.indexOf('?') !== -1) {
    let str = url.substr(1)
    let strs = str.split('&')
    for (let i = 0; i < strs.length; i++) {
      theRequest[strs[i].split('=')[0]] = (strs[i].split('=')[1])
    }
  }
  return theRequest
}
// 防抖
export function _debounce (fn, delay = 300) {
  let timer
  return function () {
    let th = this
    let args = arguments
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(function () {
      timer = null
      fn.apply(th, args)
    }, delay)
  }
}

// 节流
export function _throttle (func, delay = 1000) {
  var timer = null
  var startTime = Date.now()
  return function () {
    var curTime = Date.now()
    var remaining = delay - (curTime - startTime)
    var context = this
    var args = arguments
    clearTimeout(timer)
    if (remaining <= 0) {
      func.apply(context, args)
      startTime = Date.now()
    } else {
      timer = setTimeout(func, remaining)
    }
  }
}
