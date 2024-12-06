<template>
  <el-dialog
    v-model="props.drawerUser"
    :title="props.isUpdate ? '修改菜品' : '添加菜品'"
    width="500"
    :before-close="cancelUserDrawer"
    destroy-on-close
  >
    <template #default>
      <el-form :model="addUserForm" label-width="auto">
        <el-form-item label="菜品名" prop="name">
          <el-input
            placeholder="请填写菜品名"
            v-model="addUserForm.name"
          ></el-input>
        </el-form-item>
        <el-form-item label="菜品价格" prop="price">
          <el-input
            type="number"
            placeholder="请输入菜品价格"
            v-model="addUserForm.price"
          ></el-input>
        </el-form-item>
        <el-form-item label="菜品商家" prop="status">
          <el-select
            v-model="addUserForm.shopId"
            placeholder="请输入菜品所属商家"
            style="width: 180px"
          >
            <el-option
              v-for="item in props.stores"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜品状态" prop="status">
          <el-select
            v-model="addUserForm.status"
            placeholder="请选择菜品状态"
            style="width: 180px"
          >
            <el-option
              v-for="item in status"
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
import { reqAddOrUpdateUserData } from '@/api/dish/index'
import { ElMessageBox, ElMessage } from 'element-plus'
import { ref, reactive, onMounted, nextTick, watch } from 'vue'
import { record } from '@/api/dish/type'
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
  stores: {
    type: Array,
    require: false,
  },
})
const emits = defineEmits<{ (e: string, value: boolean): void }>()
let status = ref<[]>(['已下架', '已上架'])

watch(
  () => props.drawerUser,
  () => {
    editInit()
  },
)
let formRef = ref<any>()
//新增菜品表单数据
let addUserForm = reactive<record>({
  id: '',
  name: '',
  shopId: '',
  price: '',
  dishImg: '',
  status: '',
})

//初始化表单
const editInit = () => {
  if (props.isUpdate) {
    const statusStr = status.value[props.rowData.status]
    Object.assign(addUserForm, {
      id: props.rowData.id,
      name: props.rowData.name,
      status: statusStr,
      shopId: props.rowData.shopId,
      price: props.rowData.price,
      dishImg: '',
    })
  } else {
    Object.assign(addUserForm, {
      id: '',
      name: '',
      shopId: '',
      price: '',
      dishImg: '',
      status: '',
    })
  }
}

//提交新增或修改的菜品信息
const confirmUserAdd = async () => {
  if (!props.isUpdate) {
    addUserForm.id = ''
    addUserForm.userId = GET_INFO()
  }
  addUserForm.status = addUserForm.status == '已下架' ? 0 : 1
  let result: any = await reqAddOrUpdateUserData(addUserForm)
  if (result.code == 0) {
    ElMessage({
      type: 'success',
      message: `${addUserForm.id ? '修改' : '添加'}菜品${addUserForm.name}成功!`,
    })
    emits('update:drawerUser', false)
  } else {
    ElMessage({
      type: 'error',
      message:
        result.message ||
        `${addUserForm.id ? '修改' : '添加'}菜品${addUserForm.name}失败!`,
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
