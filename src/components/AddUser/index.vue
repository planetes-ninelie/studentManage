<template>
  <el-dialog
    v-model="props.drawerUser"
    :title="props.isUpdate ? '修改用户' : '添加用户'"
    width="500"
    :before-close="cancelUserDrawer"
    destroy-on-close
  >
    <template #default>
      <el-form
        :model="addUserForm"
        :rules="rules"
        ref="formRef"
        label-width="auto"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            placeholder="请填写用户名"
            v-model="addUserForm.username"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password" v-if="!isUpdate">
          <el-input
            placeholder="请填写用户密码"
            v-model="addUserForm.password"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item label="再次输入密码" prop="rawPassword" v-if="!isUpdate">
          <el-input
            placeholder="请再次填写用户密码"
            v-model="addUserForm.rawPassword"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select
            v-model="addUserForm.sexStr"
            placeholder="请选择用户性别"
            style="width: 240px"
          >
            <el-option
              v-for="item in sexOptions"
              :key="item.value"
              :label="item.label"
              :value="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户电话" prop="phone">
          <el-input
            type="text"
            placeholder="请输入用户电话"
            v-model="addUserForm.phone"
          ></el-input>
        </el-form-item>
        <el-form-item label="所属角色" v-if="setRole">
          <el-select
            v-model="addUserForm.roleStr"
            placeholder="请选择用户所属角色"
            style="width: 240px"
          >
            <el-option
              v-for="item in props.roleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancelUserDrawer">取消</el-button>
        <el-button type="primary" @click="confirmUserAdd">提交</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reqAddOrUpdateUserData } from '@/api/user/index'
import { ElMessageBox, ElMessage } from 'element-plus'
import { ref, reactive, onMounted, nextTick, watch } from 'vue'
import { record } from '@/api/user/type'
import { Sex, UserRole } from '@/utils/constant'
import useUserStore from '@/store/modules/user'
import pinia from '@/store'
import { useRouter, useRoute } from 'vue-router'
//获取路由器对象
let $router = useRouter()
const userStore = useUserStore(pinia)
const props = defineProps({
  drawerUser: {
    type: Boolean,
    require: true,
  },
  isUpdate: {
    type: Boolean,
    require: true,
  },
  rowData: {
    type: Object,
    require: false,
  },
  roleOptions: {
    type: Array,
    require: false,
  },
})
const emits = defineEmits<{ (e: string, value: boolean): void }>()
let sexOptions = ref<[]>([])
let setRole = ref<boolean>(false)
onMounted(() => {
  getSex()
  if (sessionStorage.getItem('role') == 1) {
    setRole.value = true
  }
})
watch(
  () => props.drawerUser,
  () => {
    editInit()
  },
)
let formRef = ref<any>()
//新增用户表单数据
let addUserForm = reactive<record>({
  id: '',
  username: '',
  password: '',
  rawPassword: '',
  sex: 0,
  phone: '',
  role: 3,
})

//初始化表单
const editInit = () => {
  if (props.isUpdate) {
    const sexStr = Sex[props.rowData.sex]
    const roleStr = UserRole[props.rowData.role]
    Object.assign(addUserForm, {
      id: props.rowData.id,
      username: props.rowData.username,
      password: '',
      rawPassword: '',
      sex: props.rowData.sex,
      phone: props.rowData.phone,
      role: props.rowData.role,
      sexStr,
      roleStr,
    })
  } else {
    Object.assign(addUserForm, {
      id: '',
      username: '',
      password: '',
      rawPassword: '',
      phone: '',
      sex: '',
      role: '',
    })
  }
  nextTick(() => {
    // formRef.value.clearValidate('username')
    // formRef.value.clearValidate('name')
    // formRef.value.clearValidate('phone')
  })
}
//获取角色列表
const getSex = () => {
  Object.entries(Sex).forEach((item) => {
    sexOptions.value.push({
      label: item[1],
      value: item[0],
    })
  })
}

//提交新增或修改的用户信息
const confirmUserAdd = async () => {
  await formRef.value.validate()
  if (!props.isUpdate) {
    addUserForm.id = ''
    delete addUserForm.password
    delete addUserForm.rawPassword
  }
  addUserForm.sex = Object.keys(Sex).find(
    (key) => Sex[key] === addUserForm.sexStr,
  )
  addUserForm.role = Object.keys(UserRole).find(
    (key) => UserRole[key] === addUserForm.roleStr,
  )
  delete addUserForm.sexStr
  delete addUserForm.roleStr
  let result: any = await reqAddOrUpdateUserData(addUserForm)
  if (result.code == 0) {
    ElMessage({
      type: 'success',
      message: `${addUserForm.id ? '修改' : '添加'}用户昵称${addUserForm.username}成功!`,
    })
    emits('update:drawerUser', false)
    if (addUserForm.id == sessionStorage.getItem('INFO')) {
      await userStore.userLogout()
      $router.push({
        path: '/login',
      })
    }
  } else {
    ElMessage({
      type: 'error',
      message:
        result.message ||
        `${addUserForm.id ? '修改' : '添加'}用户昵称${addUserForm.username}失败!`,
    })
  }
}

const cancelUserDrawer = (done: () => void) => {
  ElMessageBox.confirm('是否关闭当前对话框？').then(() => {
    emits('update:drawerUser', false)
  })
}

//校验用户昵称回调函数
const validatorUsername = (_rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 1) callBack()
  else callBack(new Error('用户昵称至少为一位'))
}

//校验用户姓名回调函数
const validatorName = (_rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 2) callBack()
  else callBack(new Error('用户姓名至少为两位'))
}

//校验用户密码回调函数
const validatorPassword = (_rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 5) callBack()
  else callBack(new Error('用户密码至少为六位'))
}

//校验用户电话回调函数
const validatorPhone = (_rule: any, value: any, callBack: any) => {
  if (!value) callBack()
  const reg = /^1[3-9]\d{9}$/
  if (reg.test(value)) callBack()
  else callBack(new Error('请输入有效的手机号'))
}

//新增用户表单校验
const rules = {
  username: [{ required: true, trigger: 'blur', validator: validatorUsername }],
  password: [{ required: true, trigger: 'blur', validator: validatorPassword }],
  rawPassword: [
    { required: true, trigger: 'blur', validator: validatorPassword },
  ],
  // phone: [{ required: true, trigger: 'blur', validator: validatorPhone }],
}
</script>

<style lang="scss" scoped></style>
