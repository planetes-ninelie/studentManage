import request from '@/utils/request'
import type { record, DishListDto } from './type'

//项目菜品相关的请求地址
enum API {
  //获取菜品表单数据url
  USERSDATA_URL = '/dish/queryDish',
  //新增菜品数据url
  ADDUSERDATA_URL = '/dish/addDish',
  //更新菜品数据url
  UPDATEUSERDATA_URL = '/dish/updateDish',
  //根据id删除菜品数据url
  DELETEBYID_URL = '/dish/deleteDish/',
}

//获取菜品表单数据接口
export const reqDishData = (data: DishListDto) =>
  request.post<any, any>(API.USERSDATA_URL, data)

//新增菜品数据接口与更新菜品数据接口
export const reqAddOrUpdateUserData = (data: record) => {
  data.status = +data.status
  if (data.id) return request.post<any, any>(API.UPDATEUSERDATA_URL, data)
  else return request.post<any, any>(API.ADDUSERDATA_URL, data)
}

//根据id删除菜品信息接口
export const reqDeleteById = (id: number | string) =>
  request.post<any, any>(API.DELETEBYID_URL, { id })
