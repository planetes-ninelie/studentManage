//定义用户表行类型
export interface UsersRow {
  id: string | number
  idStr: string | number
  username: string
  phone: string
  rawPassword: string
  password: string
  phone: string
  email: string
  role: number
  status: number
}
