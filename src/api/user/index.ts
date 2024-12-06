//统一管理项目用户相关的接口
import request from '@/utils/request'
import type {
  loginFormData,
  loginResponseData,
  record,
  usersListDto,
} from './type'

//项目用户相关的请求地址
enum API {
  //用户登录url
  LOGIN_URL = '/user/login',
  //获取用户表单数据url
  USERSDATA_URL = '/user/listUser',
  //新增用户数据url
  ADDUSERDATA_URL = '/user/register',
  //更新用户数据url
  UPDATEUSERDATA_URL = '/user/update',
  //根据id删除用户数据url
  DELETEBYID_URL = '/user/out/',
}

//登录接口
export const reqLogin = (data: loginFormData) =>
  request.post<any, loginResponseData>(API.LOGIN_URL, data)

//获取用户表单数据接口
export const reqUsersData = (data: usersListDto) =>
  request.post<any, any>(API.USERSDATA_URL, data)

//新增用户数据接口与更新用户数据接口
export const reqAddOrUpdateUserData = (data: record) => {
  data.sex = +data.sex
  if (data.id) return request.put<any, any>(API.UPDATEUSERDATA_URL, data)
  else return request.post<any, any>(API.ADDUSERDATA_URL, data)
}

//根据id删除用户信息接口
export const reqDeleteById = (id: number | string) =>
  request.post<any, any>(API.DELETEBYID_URL, { id })
