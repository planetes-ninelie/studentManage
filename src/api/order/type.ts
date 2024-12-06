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

//定义获取订单信息返回数据类型
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

//获取单个订单的数据
export interface record {
  orderId: string | number | undefined
  userId: string | number
  businessId: number
  totalAmount: number
  paymentStatus: string
  deliveryAddress: string
  deliveryFee: number
  remarks: string
  status: number
  createdAt?: string
  updatedAt?: string
}

//获取订单表单数据
export interface UsersData extends pageData<record> {}

export interface UserData extends ResponseData {
  data: record
}

// 分页查询订单提交的表单
export interface StoreListDto {
  orderStatus: string
  page?: number
  pageSize?: number
}
