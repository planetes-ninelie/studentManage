import { computed } from 'vue'
//获取用户相关的小仓库内部token数据
import useUserStore from '@/store/modules/user'
//引入大仓库
import pinia from '@/store'
//使用user仓库
const userStore = useUserStore(pinia)

// 辅助函数用于检查权限按钮是否存在
export const hasButton = (code: string) => {
  return computed(() => userStore.buttons.includes(code))
}
