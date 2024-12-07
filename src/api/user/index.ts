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
  LOGIN_URL = '/common/login',
  //获取用户表单数据url
  USERSDATA_URL = '/students/name',
  //获取所有学生列表
  GETLIST_URL = '/students/getList',
  //新增用户数据url
  ADDUSERDATA_URL = '/students/add',
  //更新用户和删除数据url
  STU_URL = '/students/',
}

//登录接口
export const reqLogin = (data: loginFormData) =>
  request.post<any, loginResponseData>(API.LOGIN_URL, data)

//获取用户表单数据接口
export const reqUsersData = (data: usersListDto) => {
  if (data.username == '') {
    const url = API.GETLIST_URL + `?page=${data.page}&size=${data.size}`
    return request.get<any, any>(url)
  } else {
    const url =
      API.USERSDATA_URL +
      `/${data.username}?page=${data.page}&size=${data.size}`
    return request.post<any, any>(url)
  }
}

//新增用户数据接口与更新用户数据接口
export const reqAddOrUpdateUserData = (data: record) => {
  data.sex = +data.sex
  if (data.id) return request.put<any, any>(API.STU_URL + data.id, data)
  else return request.post<any, any>(API.ADDUSERDATA_URL, data)
}

//根据id删除用户信息接口
export const reqDeleteById = (id: number | string) =>
  request.delete<any, any>(API.STU_URL + id)
