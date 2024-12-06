import { ResponseData, pageData } from '@/api/page'

//登录接口需要携带参数ts类型
export interface loginFormData {
  username: string
  password: string
}

//定义全部接口返回数据都拥有ts类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

//登录接口返回数据类型
export interface loginResponseData extends ResponseData {
  data: record
}

//定义获取商家信息返回数据类型
export interface userInfoResponseData extends ResponseData {
  data: {
    routes: string[]
    buttons: string[]
    roles: string[]
    name: string
    avatar: string
    userId: number
    username: string
  }
}

//更换头像携带的ts类型
export interface updateAvatar {
  id: number
  avatar: string
}

//获取单个商家的数据
export interface record {
  id: string | number | undefined
  userId: string | number
  name: string
  description: string
  status: number
  createdAt?: string
  updatedAt?: string
  address: string
}

//获取商家表单数据
export interface UsersData extends pageData<record> {}

export interface UserData extends ResponseData {
  data: record
}

// 分页查询商家提交的表单
export interface StoreListDto {
  name: string
  address: number
  page?: number
  pageSize?: number
}
