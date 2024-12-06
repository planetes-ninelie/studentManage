<template>
  <div class="login_container">
    <transition name="el-zoom-in-center">
      <el-form
        class="login_form"
        :model="loginForm"
        :rules="rules"
        ref="loginForms"
        v-show="isLogin"
      >
        <h1>{{ title }}</h1>
        <el-form-item class="item" prop="username">
          <el-input
            class="input"
            :prefix-icon="User"
            placeholder="请输入账号"
            v-model="loginForm.username"
          ></el-input>
        </el-form-item>
        <el-form-item class="item" prop="password">
          <el-input
            class="input"
            type="password"
            placeholder="请输入密码"
            :prefix-icon="Lock"
            v-model="loginForm.password"
            show-password
          ></el-input>
        </el-form-item>
        <!-- <el-form-item class="item-select">
          <el-col :span="12" class="col-left">
            <el-checkbox v-model="checked">自动登录</el-checkbox>
          </el-col>
          <el-col :span="12" class="col-right">
            <span class="link">忘记密码</span>
          </el-col>
        </el-form-item> -->
        <el-form-item class="item">
          <el-button
            :loading="loading"
            class="login_btn"
            size="default"
            @click="login"
          >
            登录
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-col :span="24" class="register">
            <span class="link" @click="register">注册账号</span>
          </el-col>
        </el-form-item>
      </el-form>
    </transition>

    <transition name="el-zoom-in-center">
      <el-form
        class="login_form"
        :model="registerForm"
        :rules="rules"
        ref="loginForms"
        v-show="!isLogin"
      >
        <h2>注册账号</h2>
        <el-form-item class="item" prop="username">
          <el-input
            class="input"
            :prefix-icon="User"
            placeholder="请输入账号"
            v-model="registerForm.username"
          ></el-input>
        </el-form-item>
        <el-form-item class="item" prop="password">
          <el-input
            class="input"
            type="password"
            placeholder="请输入密码"
            :prefix-icon="Lock"
            v-model="registerForm.password"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item class="item" prop="password">
          <el-input
            class="input"
            type="password"
            placeholder="请再次输入密码"
            :prefix-icon="Lock"
            v-model="registerForm.rawPassword"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item class="item">
          <el-button
            :loading="loading"
            class="login_btn"
            size="default"
            @click="registerSubmit"
          >
            注册
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-col :span="24" class="register">
            <span class="link" @click="register">返回登录页</span>
          </el-col>
        </el-form-item>
      </el-form>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import useUserStore from '@/store/modules/user'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElNotification } from 'element-plus'
//引入获取当前时间的函数
import { getTime } from '@/utils/time'
import { record } from '@/api/user/type'
import { reqAddOrUpdateUserData } from '@/api/user/index'

//引入用户相关的小仓库
let userStore = useUserStore()
//获取路由器
let $router = useRouter()
//定义变量控制按钮加载效果
let loading = ref(false)
//收集账号与密码的数据
let loginForm = reactive({ username: '', password: '' })
//获取el-form组件
let loginForms = ref()
//获取路由
let $route = useRoute()
//自动登录
let checked = ref<boolean>(true)
//是否为登录页面
let isLogin = ref<boolean>(true)
//收集注册表单
let registerForm = reactive<record>({
  id: '',
  username: '',
  password: '',
  rawPassword: '',
  sex: 0,
  phone: '',
  role: 3,
})

//登录按钮回调
const login = async () => {
  await loginForms.value.validate()
  loading.value = true
  try {
    const res = await userStore.userLogin(loginForm)
    let redirect: any = $route.query.redirect
    $router.push({ path: redirect || '/' })
    ElNotification({
      type: 'success',
      message: '欢迎回来',
      title: `HI!${getTime()}好`,
    })
    loading.value = false
  } catch (error) {
    loading.value = false
    ElNotification({
      type: 'error',
      message: error as Error,
    })
  }
}

//自定义校验规则函数
const validatorUserName = (_rule: any, value: any, callback: any) => {
  if (value.length >= 2) {
    callback()
  } else {
    callback(new Error('账号长度至少两位'))
  }
}

const validatorPassword = (_rule: any, value: any, callback: any) => {
  if (value.length >= 6) {
    callback()
  } else {
    callback(new Error('密码长度至少六位'))
  }
}

//定义表单校验需要配置对象
const rules = {
  username: [{ trigger: 'change', validator: validatorUserName }],
  password: [{ trigger: 'change', validator: validatorPassword }],
}

//标题
const title = import.meta.env.VITE_APP_TITLE

//切换场景
const register = () => (isLogin.value = !isLogin.value)

//注册
const registerSubmit = async () => {
  delete registerForm.id
  const res = await reqAddOrUpdateUserData(registerForm)
  if (res.code == 0) {
    ElMessage({
      type: 'success',
      message: `注册用户昵称${registerForm.username}成功!`,
    })
    register()
  } else {
    ElMessage({
      type: 'error',
      message: res.msg || `注册用户名${registerForm.username}失败!`,
    })
  }
}
</script>

<style scoped lang="scss">
.login_container {
  width: 100vw;
  height: 100vh;
  background: url('@/assets/images/background.svg') no-repeat;
  background-color: #f0f2f5;
  background-size: cover;
  display: flex;
  justify-content: center;
}

.login_form {
  position: relative;
  top: 20vh;
  width: 450px;
  height: 350px;
  background-color: rgba($color: #000000, $alpha: 0);
  background-size: cover;
  padding: 40px;
  border-radius: 20px;
  text-align: center;

  h1 {
    margin: 20px 0;
    color: #00aaff;
    font-size: 40px;
    font-weight: 600;
  }

  h2 {
    margin: 20px 0;
    color: #00aaff;
    font-size: 25px;
    font-weight: 600;
  }

  .item {
    height: 60px;

    .input,
    .login_btn {
      height: 80%;
    }
  }

  .item-select {
    width: 100%;
    height: 30px;

    .col-left {
      text-align: left;
    }

    .col-right {
      display: flex;
      justify-content: flex-end;
    }
  }

  .register {
    display: flex;
    justify-content: flex-end;
  }

  .login_btn {
    width: 100%;
    background-color: #00aaff;
    color: white;
    font-size: 20px;
    letter-spacing: 5px;

    &:hover {
      background-color: #1ddddd;
    }
  }
}

.link {
  font-size: 18px;
  color: #00aaff;

  &:hover {
    cursor: pointer;
  }
}

.el-checkbox {
  color: #13c2c2;
  --el-checkbox-font-size: 18px;
  --el-color-primary: #00aaff;
}

.el-input {
  --el-color-primary: #00aaff;
}

.transition-box {
  margin-bottom: 10px;
  width: 200px;
  height: 100px;
  border-radius: 4px;
  background-color: #409eff;
  text-align: center;
  color: #fff;
  padding: 40px 20px;
  box-sizing: border-box;
  margin-right: 20px;
}
</style>
