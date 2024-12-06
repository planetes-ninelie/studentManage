import { defineStore } from 'pinia'
import { reqLogin } from '@/api/user'
import type { loginFormData, loginResponseData } from '@/api/user/type'
import type { UserState } from './types/type'
//引入操作本地储存的工具方法
import {
  REMOVE_INFO,
  GET_INFO,
  SET_INFO,
  GET_ROLE,
  GET_USERNAME,
} from '@/utils/token'
//引入常量路由
import { constantRoute, asyncRoute, anyRoute } from '@/router/routes'
//引入深拷贝方法
import cloneDeep from 'lodash/cloneDeep'
import router from '@/router'
import { RouteInfo } from '@/utils/constant'

//过滤异步路由的方法
function filterAsyncRoute(asyncRoute: any, routes: any) {
  return asyncRoute.filter((item: any) => {
    if (routes.includes(item.name)) {
      if (item.children && item.children.length > 0) {
        item.children = filterAsyncRoute(item.children, routes)
      }
      return true
    }
  })
}

//创建用户小仓库
const useUserStore = defineStore('User', {
  //小仓库存储数据的地方
  state: (): UserState => {
    return {
      menuRoutes: constantRoute, //仓库储存生成菜单需要数组
      username: GET_USERNAME(),
      id: GET_INFO(),
      role: GET_ROLE(),
    }
  },
  //异步 | 逻辑的地方
  actions: {
    //用户登录的方法
    async userLogin(data: loginFormData) {
      const result: loginResponseData = await reqLogin(data)
      if (result.code == 0) {
        const res = result.data
        SET_INFO(res.id, res.role, res.username, res.sex, res.phone)
        this.getInfo()
        return 'ok'
      } else {
        return Promise.reject(new Error(result.msg))
      }
    },
    //获取信息
    async getInfo() {
      const routesEss = RouteInfo[GET_ROLE()]
      const userAsyncRoutes = filterAsyncRoute(cloneDeep(asyncRoute), [
        ...routesEss,
      ])
      // const userAsyncRoutes = [...routesTest]
      this.menuRoutes = [...constantRoute, ...userAsyncRoutes, ...anyRoute]
      const routes = [...userAsyncRoutes, ...anyRoute]
      sessionStorage.setItem('ROUTES', JSON.stringify(routes))
      routes.forEach((route: any) => {
        router.addRoute(route)
      })
      return 'ok'
    },
    //退出登录
    userLogout() {
      this.username = ''
      this.menuRoutes = []
      this.userId = 0
      this.phone = ''
      this.role = -1
      REMOVE_INFO()
      return 'ok'
    },
  },
  getters: {},
})

export default useUserStore
