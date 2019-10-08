const formatTime = (number, format) => {
  let formateArr = ['Y', 'M', 'D', 'h', 'm', 's']
  let returnArr = []

  let date = new Date(number * 1000)
  returnArr.push(date.getFullYear())
  returnArr.push(formatNumber(date.getMonth() + 1))
  returnArr.push(formatNumber(date.getDate()))

  returnArr.push(formatNumber(date.getHours()))
  returnArr.push(formatNumber(date.getMinutes()))
  returnArr.push(formatNumber(date.getSeconds()))

  for (let i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i])
  }
  return format
}
// 数据转化
const formatNumber = (n) => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
export { formatTime }
