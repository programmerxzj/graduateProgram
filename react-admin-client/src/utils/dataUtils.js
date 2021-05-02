/*
包含n个日期时间处理的工具函数模块
*/

/*
  格式化日期
*/
export function formateDate(time) {
  if (!time) return ''
  let date = new Date(time)
  let year = style(date.getFullYear())
  let month = style((date.getMonth() + 1))
  let day = style(date.getDate())
  let hours = style(date.getHours())
  let minutes = style(date.getMinutes())
  let seconds = style(date.getSeconds())
  return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
}

function style(e) {
  return e >= 10 ? e : '0' + e
}
