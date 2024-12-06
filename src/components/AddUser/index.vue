<template>
  <el-dialog v-model="props.drawerUser" :title="props.isUpdate ? '修改用户' : '添加用户'" width="500"
    :before-close="cancelUserDrawer" destroy-on-close>
    <template #default>
      <el-form :model="addUserForm" :rules="rules" ref="formRef" label-width="auto">
        <el-form-item label="学生姓名" prop="name">
          <el-input placeholder="请填写学生姓名" v-model="addUserForm.name"></el-input>
        </el-form-item>
        <el-form-item label="学生年龄" prop="age">
          <el-input placeholder="请填写学生年龄" v-model="addUserForm.age" type="number"></el-input>
        </el-form-item>
        <el-form-item label="学生年级" prop="grade">
          <el-input placeholder="请填写学生年级" v-model="addUserForm.grade"></el-input>
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
  }
})
const emits = defineEmits<{ (e: string, value: boolean): void }>()
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
  name: '',
  age: '',
  grade: '',
})

//初始化表单
const editInit = () => {
  if (props.isUpdate) {
    Object.assign(addUserForm, {
      id: props.rowData.id,
      name: props.rowData.name,
      age: props.rowData.age,
      grade: props.rowData.grade,
    })
  } else {
    Object.assign(addUserForm, {
      id: '',
      name: '',
      age: '',
      grade: '',
    })
  }
}

//提交新增或修改的用户信息
const confirmUserAdd = async () => {
  await formRef.value.validate()
  if (!props.isUpdate) {
    addUserForm.id = ''
  }
  let result: any = await reqAddOrUpdateUserData(addUserForm)
  ElMessage({
    type: 'success',
    message: `${addUserForm.id ? '修改' : '添加'}学生${addUserForm.name}成功!`,
  })
  emits('update:drawerUser', false)
}

const cancelUserDrawer = (done: () => void) => {
  ElMessageBox.confirm('是否关闭当前对话框？').then(() => {
    emits('update:drawerUser', false)
  })
}

//新增用户表单校验
const rules = {
  age: [{ required: true, message: '请输入学生年龄', trigger: 'blur' }],
  name: [{ required: true, message: '请输入学生姓名', trigger: 'blur' }],
  grade: [{ required: true, message: '请输入学生年级', trigger: 'blur' }],
}
</script>

<style lang="scss" scoped></style>
