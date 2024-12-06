//对外暴露配置路由(常量路由)
export const constantRoute = [
  {
    //登录
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    name: 'login',
    meta: {
      title: '登录', //菜单标题
      hidden: true, //代表路由标题在菜单中是否隐藏
      icon: 'Promotion', //菜单文字左侧的图标，支持element-plus全部图标
    },
  },
  {
    //登录成功以后展示数据的路由
    path: '/',
    component: () => import('@/layout/index.vue'),
    name: 'layout',
    meta: {
      title: 'layout',
      hidden: true,
      icon: 'Avatar',
    },
    redirect: '/home',
    children: [
      {
        path: '/home',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: '首页',
          hidden: false,
          icon: 'HomeFilled',
        },
      },
    ],
  },

  {
    path: '/404',
    component: () => import('@/views/404/index.vue'),
    name: '404',
    meta: {
      title: '404',
      hidden: true,
      icon: 'DocumentDelete',
    },
  },
]

//异步路由
export const asyncRoute = [
  {
    //用户管理
    path: '/user',
    component: () => import('@/layout/index.vue'),
    name: 'User',
    meta: {
      title: '用户管理', //菜单标题
      hidden: false, //代表路由标题在菜单中是否隐藏
      icon: 'UserFilled', //菜单文字左侧的图标，支持element-plus全部图标
    },
    children: [
      {
        path: '/user/manage',
        component: () => import('@/views/user/index.vue'),
        name: 'UserManage',
        meta: {
          title: '用户管理',
          hidden: false,
          icon: 'UserFilled',
        },
      },
    ],
  },

  {
    //商家管理
    path: '/store',
    component: () => import('@/layout/index.vue'),
    name: 'Store',
    meta: {
      title: '商家管理',
      hidden: false,
      icon: 'ShoppingCart',
    },
    children: [
      {
        path: '/store/manage',
        component: () => import('@/views/store/index.vue'),
        name: 'StoreManage',
        meta: {
          title: '商家管理',
          hidden: false,
          icon: 'ShoppingCart',
        },
      },
    ],
  },
  {
    //菜品管理
    path: '/dish',
    component: () => import('@/layout/index.vue'),
    name: 'Dish',
    meta: {
      title: '菜品管理',
      hidden: false,
      icon: 'Dish',
    },
    children: [
      {
        path: '/dish/manage',
        component: () => import('@/views/dish/index.vue'),
        name: 'DishManage',
        meta: {
          title: '菜品管理',
          hidden: false,
          icon: 'Dish',
        },
      },
    ],
  },
  {
    //订单管理
    path: '/order',
    component: () => import('@/layout/index.vue'),
    name: 'Order',
    meta: {
      title: '订单管理',
      hidden: false,
      icon: 'Document',
    },
    children: [
      {
        path: '/order/manage',
        component: () => import('@/views/order/index.vue'),
        name: 'OrderManage',
        meta: {
          title: '订单管理',
          hidden: false,
          icon: 'Document',
        },
      },
    ],
  },
  {
    //系统设置
    path: '/setting',
    component: () => import('@/layout/index.vue'),
    name: 'Setting',
    meta: {
      title: '系统设置',
      hidden: false,
      icon: 'Tools',
    },
    children: [
      {
        path: '/setting/manage',
        component: () => import('@/views/setting/index.vue'),
        name: 'SettingManage',
        meta: {
          title: '系统设置',
          hidden: false,
          icon: 'Tools',
        },
      },
    ],
  },
]

//任意路由
export const anyRoute = [
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    name: 'Any',
    meta: {
      title: '任意路由',
      hidden: true,
      icon: 'DataLine',
    },
  },
]
