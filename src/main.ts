import { createApp } from 'vue'
import App from '@/App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//引入暗黑模式文件
import 'element-plus/theme-chalk/dark/css-vars.css'
import '@/utils/polyfill'

//@ts-expect-error 代码是指ts忽略zhCn.mjs的检查
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import 'virtual:svg-icons-register'

import globalComponent from '@/components'
import '@/styles/index.scss'
//引入路由器
import router from '@/router'
//引入仓库
import pinia from './store'
//引入路由鉴权文件
import './permisson.ts'
//引入自定义指令组件
import { isHasButton } from './directive/has.ts'
//获取实例对象
const app = createApp(App)
//安装element-plus插件
app.use(ElementPlus, {
  locale: zhCn,
})
//安装自定义组件
app.use(globalComponent)
//安装仓库
app.use(pinia)
//注册模板路由
app.use(router)
//注册自定义组件
isHasButton(app)
//将应用挂载到挂载点上
app.mount('#app')
