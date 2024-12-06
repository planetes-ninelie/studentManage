<template>
  <!-- <el-dialog v-model="props.drawerUser" :title="props.isUpdate ? '修改订单' : '添加订单'" width="500"
    :before-close="cancelUserDrawer" destroy-on-close>
    <template #default>
      <el-form :model="addUserForm" label-width="auto">
        <el-form-item label="订单名" prop="name">
          <el-input placeholder="请填写订单名" v-model="addUserForm.name"></el-input>
        </el-form-item>
        <el-form-item label="订单简介" prop="description">
          <el-input type="text" placeholder="请输入订单简介" v-model="addUserForm.description"></el-input>
        </el-form-item>
        <el-form-item label="订单状态" prop="status">
          <el-select v-model="addUserForm.status" placeholder="请输入订单状态" style="width: 240px">
            <el-option v-for="item in props.status" :key="item" :label="item" :value="item.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单地址" prop="address">
          <el-input type="text" placeholder="请输入订单地址" v-model="addUserForm.address"></el-input>
        </el-form-item>
      </el-form>
    </template>
<template #footer>
      <div style="flex: auto">
        <el-button @click="cancelUserDrawer">取消</el-button>
        <el-button type="primary" @click="confirmUserAdd">提交</el-button>
      </div>
    </template>
</el-dialog> -->
  <el-dialog
    v-model="props.drawerUser"
    title="修改状态"
    width="500"
    :before-close="cancelUserDrawer"
    destroy-on-close
  >
    <template #default>
      <el-form :model="addUserForm" label-width="auto">
        <el-form-item label="订单名" prop="name">
          <el-input
            placeholder="请填写订单名"
            v-model="addUserForm.name"
            disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="订单状态" prop="status">
          <el-select
            v-model="addUserForm.status"
            placeholder="请输入订单状态"
            style="width: 240px"
          >
            <el-option
              v-for="item in props.status"
              :key="item"
              :label="item"
              :value="item"
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
import { reqAddOrUpdateUserData } from '@/api/order/index'
import { ElMessageBox, ElMessage } from 'element-plus'
import { ref, reactive, onMounted, nextTick, watch } from 'vue'
import { record } from '@/api/order/type'
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
  status: {
    type: Array,
    require: false,
  },
})
const emits = defineEmits<{ (e: string, value: boolean): void }>()

onMounted(() => {})
watch(
  () => props.drawerUser,
  () => {
    editInit()
  },
)
let formRef = ref<any>()
//新增订单表单数据
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
    Object.assign(addUserForm, {
      id: props.rowData.id,
      userId: props.rowData.userId,
      name: props.rowData.name,
      description: props.rowData.description,
      status: props.rowData.status,
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

//提交新增或修改的订单信息
const confirmUserAdd = async () => {
  if (!props.isUpdate) {
    addUserForm.id = ''
    addUserForm.userId = GET_INFO()
  }
  addUserForm.status = Object.keys(orderStatus).find(
    (key) => orderStatus[key] === addUserForm.status,
  )
  delete addUserForm.orderStr

  let result: any = await reqAddOrUpdateUserData(addUserForm)
  if (result.code == '000000') {
    ElMessage({
      type: 'success',
      message: `${addUserForm.id ? '修改' : '添加'}订单昵称${addUserForm.username}成功!`,
    })
    emits('update:drawerUser', false)
  } else {
    ElMessage({
      type: 'error',
      message:
        result.message ||
        `${addUserForm.id ? '修改' : '添加'}订单昵称${addUserForm.username}失败!`,
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
