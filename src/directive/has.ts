// import pinia from '@/store'
// import useUserStore from '@/store/modules/user'

// const userStore = useUserStore(pinia)
export const isHasButton = (app: any) => {
  //全局自定义指令
  app.directive('has', {
    // mounted(el: any, options: any) {
    //   if (!userStore.buttons.includes(options.value)) {
    //     el.parentNode.removeChild(el)
    //   }
    // },
    // beforeMount(el: any, binding: any) {
    //   if (!userStore.buttons.includes(binding.value)) {
    //     el.style.display = 'none' // 或者 el.parentNode.removeChild(el);
    //   }
    // },
    // updated(el: any, binding: any) {
    //   if (!userStore.buttons.includes(binding.value)) {
    //     el.style.display = 'none' // 或者 el.parentNode.removeChild(el);
    //   } else {
    //     el.style.display = '' // 显示元素
    //   }
    // },
  })
}
