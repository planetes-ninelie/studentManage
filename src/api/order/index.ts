import request from '@/utils/request'
import type { record, StoreListDto } from './type'

//项目订单相关的请求地址
enum API {
  //获取订单表单数据url
  USERSDATA_URL = '/sysOrder/getOrderList',
  //新增订单数据url
  ADDUSERDATA_URL = '/sysOrder/addOrder',
  //更新订单数据url
  UPDATEUSERDATA_URL = '/sysOrder/updateOrder',
}

//获取订单表单数据接口
export const reqUsersData = (data: StoreListDto) =>
  request.post<any, any>(API.USERSDATA_URL, data)

//新增订单数据接口与更新订单数据接口
export const reqAddOrUpdateUserData = (data: record) => {
  data.status = +data.status
  if (data.id) return request.put<any, any>(API.UPDATEUSERDATA_URL, data)
  else return request.post<any, any>(API.ADDUSERDATA_URL, data)
}
