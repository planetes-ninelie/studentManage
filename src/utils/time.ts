import moment from 'moment'
/* 
  封装一个函数：获取一个结果： 
  早上 4:00 - 10:00
  中午 10:00 - 14:00
  下午 14:00 - 18:00
  晚上 18:00 - 4:00
*/
export const getTime = () => {
  let message = ''
  const hour = new Date().getHours()
  if ((hour >= 0 && hour < 4) || (hour >= 18 && hour <= 23)) {
    message = '晚上'
  } else if (hour >= 4 && hour < 10) {
    message = '早上'
  } else if (hour >= 10 && hour < 14) {
    message = '中午'
  } else if (hour >= 14 && hour < 18) {
    message = '下午'
  } else {
    message = '获取时间错误！'
  }
  return message
}

// 格式化时间
export function formatDateTime(dateTime: Date): string {
  return moment(dateTime).format('YYYY-MM-DD HH:mm:ss')
}
