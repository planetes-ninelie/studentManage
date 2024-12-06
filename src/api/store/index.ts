import request from '@/utils/request'
import type { record, StoreListDto } from './type'

//项目商家相关的请求地址
enum API {
  //获取商家表单数据url
  USERSDATA_URL = '/shop/listShop',
  //新增商家数据url
  ADDUSERDATA_URL = '/shop/addShop',
  //更新商家数据url
  UPDATEUSERDATA_URL = '/shop/updateShop',
  //根据id删除商家数据url
  DELETEBYID_URL = '/shop/deleteShop/',
}

//获取商家表单数据接口
export const reqUsersData = (data: StoreListDto) =>
  request.post<any, any>(API.USERSDATA_URL, data)

//新增商家数据接口与更新商家数据接口
export const reqAddOrUpdateUserData = (data: record) => {
  data.status = +data.status
  data.price = (+data.price).toFixed(2)
  if (data.id) return request.put<any, any>(API.UPDATEUSERDATA_URL, data)
  else return request.post<any, any>(API.ADDUSERDATA_URL, data)
}

//根据id删除商家信息接口
export const reqDeleteById = (id: number | string) =>
  request.post<any, any>(API.DELETEBYID_URL, { id })
