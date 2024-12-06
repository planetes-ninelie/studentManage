//封装本地存储中存储数据与读取数据的方法
//存储数据
export const SET_INFO = (
  INFO: string,
  role: number,
  username: string,
  sex: number,
  phone: string,
) => {
  sessionStorage.setItem('INFO', INFO)
  sessionStorage.setItem('role', role)
  sessionStorage.setItem('username', username)
  sessionStorage.setItem('sex', sex)
  sessionStorage.setItem('phone', phone)
}

//本地存储获取数据
export const GET_INFO = () => {
  return sessionStorage.getItem('INFO')
}
export const GET_ROLE = () => {
  return sessionStorage.getItem('role')
}
export const GET_USERNAME = () => {
  return sessionStorage.getItem('username')
}
export const GET_ROUTES = () => {
  return JSON.parse(sessionStorage.getItem('ROUTES'))
}

export const GET_USER = () => {
  return {
    id: sessionStorage.getItem('INFO'),
    role: sessionStorage.getItem('role'),
    username: sessionStorage.getItem('username'),
    sex: sessionStorage.getItem('sex'),
    phone: sessionStorage.getItem('phone'),
  }
}
//本地存储删除数据的方法
export const REMOVE_INFO = () => {
  sessionStorage.clear()
}
