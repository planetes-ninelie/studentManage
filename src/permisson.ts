//路由鉴全，项目当中路由能不能被访问权限的设置
import router from '@/router'
//引入进度条插件
import nprogress from 'nprogress'
//引入进度条样式
import 'nprogress/nprogress.css'
nprogress.configure({ showSpinner: false })
//获取用户相关的小仓库内部token数据
import useUserStore from './store/modules/user'
//引入大仓库
import pinia from './store'
import setting from './setting'
import { GET_INFO } from './utils/token'
const userStore = useUserStore(pinia)

//全局前置守卫
router.beforeEach(async (to: any, _from: any, next: any) => {
  document.title = setting.title + '-' + to.meta.title
  nprogress.start()
  const id = GET_INFO()
  const rule = id !== null && id !== ''
  if (rule) {
    if (to.path == '/login') {
      next({ path: '/' })
    } else {
      try {
        await userStore.getInfo()
        next()
        // next({ ...to, replace: true })
      } catch (error) {
        await userStore.userLogout()
        next({ path: '/login', query: { redirect: to.path } })
      }
    }
  } else {
    if (to.path == '/login') {
      next()
    } else {
      next({ path: '/login', query: { redirect: to.path } })
    }
  }
})

//全局后置守卫
router.afterEach(() => {
  nprogress.done()
})
