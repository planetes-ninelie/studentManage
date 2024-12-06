<template>
  <el-dialog
    v-model="props.drawerUser"
    :title="props.isUpdate ? '修改上商家' : '添加上商家'"
    width="500"
    :before-close="cancelUserDrawer"
    destroy-on-close
  >
    <template #default>
      <el-form :model="addUserForm" label-width="auto">
        <el-form-item label="上商家名" prop="name">
          <el-input
            placeholder="请填写上商家名"
            v-model="addUserForm.name"
          ></el-input>
        </el-form-item>
        <el-form-item label="上商家简介" prop="description">
          <el-input
            type="text"
            placeholder="请输入上商家简介"
            v-model="addUserForm.description"
          ></el-input>
        </el-form-item>
        <el-form-item label="上商家状态" prop="statusStr">
          <el-select
            v-model="addUserForm.statusStr"
            placeholder="请输入上商家状态"
            style="width: 240px"
          >
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上商家地址" prop="address">
          <el-input
            type="text"
            placeholder="请输入上商家地址"
            v-model="addUserForm.address"
          ></el-input>
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
import { reqAddOrUpdateUserData } from '@/api/store/index'
import { ElMessageBox, ElMessage } from 'element-plus'
import { ref, reactive, onMounted, nextTick, watch } from 'vue'
import { record } from '@/api/store/type'
import { StoreStatus, UserRole } from '@/utils/constant'
import { GET_INFO } from '@/utils/token'
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
})
const emits = defineEmits<{ (e: string, value: boolean): void }>()
let statusOptions = ref<[]>([])
onMounted(() => {
  getStoreStatus()
})
watch(
  () => props.drawerUser,
  () => {
    editInit()
  },
)
let formRef = ref<any>()
//新增上商家表单数据
let addUserForm = reactive<record>({
  id: '',
  userId: '',
  name: '',
  description: '',
  status: '',
  address: '',
})

//初始化表单
const editInit = () => {
  if (props.isUpdate) {
    const status = StoreStatus[props.rowData.status]
    Object.assign(addUserForm, {
      id: props.rowData.id,
      userId: props.rowData.userId,
      name: props.rowData.name,
      description: props.rowData.description,
      statusStr: props.rowData.statusStr,
      status: '',
      address: props.rowData.address,
    })
  } else {
    Object.assign(addUserForm, {
      id: '',
      userId: '',
      name: '',
      description: '',
      status: '',
      address: '',
    })
  }
}
//获取状态列表
const getStoreStatus = () => {
  Object.entries(StoreStatus).forEach((item) => {
    statusOptions.value.push({
      label: item[1],
      value: item[0],
    })
  })
}

//提交新增或修改的上商家信息
const confirmUserAdd = async () => {
  if (!props.isUpdate) {
    addUserForm.id = ''
    addUserForm.userId = GET_INFO()
  }
  addUserForm.status = Object.keys(StoreStatus).find(
    (key) => StoreStatus[key] === addUserForm.statusStr,
  )
  delete addUserForm.statusStr
  let result: any = await reqAddOrUpdateUserData(addUserForm)
  if (result.code == '000000') {
    ElMessage({
      type: 'success',
      message: `${addUserForm.id ? '修改' : '添加'}商家${addUserForm.name}成功!`,
    })
    emits('update:drawerUser', false)
  } else {
    ElMessage({
      type: 'error',
      message:
        result.message ||
        `${addUserForm.id ? '修改' : '添加'}商家${addUserForm.name}失败!`,
    })
  }
}

const cancelUserDrawer = (done: () => void) => {
  ElMessageBox.confirm('是否关闭当前对话框？').then(() => {
    emits('update:drawerUser', false)
  })
}
</script>

<style lang="scss" scoped></style>
