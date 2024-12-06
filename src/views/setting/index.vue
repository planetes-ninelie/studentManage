<template>
  <div>
    <header>
      <el-form :model="userSearchDto" label-width="80px" :inline="true">
        <el-form-item>
          <el-button
            type="success"
            icon="Search"
            style="margin-right: 15px"
            @click="search"
          >
            刷新
          </el-button>
        </el-form-item>
      </el-form>
    </header>

    <el-dialog
      v-model="drawerUser"
      title="修改优先级"
      width="500"
      :before-close="cancelUserDrawer"
      destroy-on-close
    >
      <template #default>
        <el-form :model="addUserForm" label-width="auto">
          <el-form-item label="推荐类型" prop="type">
            <el-input v-model="addUserForm.type" disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="推荐商家/菜品id" prop="targetId">
            <el-input v-model="addUserForm.targetId" disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="推荐度" prop="status">
            <el-input
              v-model="addUserForm.displayOrder"
              placeholder="请输入推荐度"
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

    <!-- 表格数据 -->
    <el-table border :data="usersData" style="margin-bottom: 10px">
      <el-table-column
        property="id"
        align="center"
        label="id"
        width="100"
        show-overflow-tooltip
      />
      <el-table-column
        property="type"
        label="推荐类型"
        align="center"
        width="150"
        show-overflow-tooltip
      />
      <el-table-column
        property="targetId"
        label="商家/菜品id"
        align="center"
        width="150"
        show-overflow-tooltip
      />
      <el-table-column
        property="createdBy"
        label="推荐人"
        align="center"
        width="150"
        show-overflow-tooltip
      />
      <el-table-column
        property="createdAt"
        label="创建时间"
        align="center"
        width="150"
        show-overflow-tooltip
      />
      <el-table-column
        property="updatedAt"
        label="修改时间"
        align="center"
        width="150"
        show-overflow-tooltip
      />
      <el-table-column label="操作" align="center" width="300" fixed="right">
        <template #="{ row }">
          <el-button
            type="primary"
            size="small"
            icon="Edit"
            @click="editUser(true, row)"
            v-has="`btn.User.update`"
          >
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      @size-change="changeSize"
      @current-change="getHasUser()"
      :pager-count="9"
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[5, 10, 15, 20]"
      :background="true"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="total"
    />
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, reactive, ref, toRaw, watch } from 'vue'
import {
  reqAddOrUpdateUserData,
  reqToAssign,
  reqUsersData,
} from '@/api/order/index'
import { UsersData, record, StoreListDto } from '@/api/order/type'
import { ElMessage, ElTable, ElMessageBox } from 'element-plus'
import { Sex, UserRole } from '@/utils/constant'
import type { UsersRow } from './type.ts'

//当前页数
let pageNo = ref<number>(1)
//每页最大页数
let pageSize = ref<number>(5)
//数据总数
let total = ref<number>(0)
//订单数据
let usersData = ref<record[]>([])
//搜索订单
let userSearchDto = ref<StoreListDto>({
  orderStatus: '',
})
//控制新增订单或更新订单的抽屉显示与隐藏
let drawerUser = ref<boolean>(false)
//行数据
let rowData = ref<UsersRow>({})
//组件挂载初始化
onMounted(() => {
  getHasUser()
})

watch(
  () => drawerUser.value,
  () => {
    editInit()
  },
)
let status = ref<string[]>([])
//获取订单数据
const getHasUser = async () => {
  const data = {
    orderStatus: userSearchDto.value.orderStatus,
    page: pageNo.value,
    pageSize: pageSize.value,
  }
  let result: UsersData = await reqUsersData(data)
  if (result.code == 0) {
    total.value = result.data.total
    usersData.value = result.data.list
  }
}

//改变当前页数
const changeSize = () => {
  pageNo.value = 1
  getHasUser()
}

//搜索订单
const search = async () => getHasUser()

// 添加/编辑按钮
const editUser = (val, row) => {
  rowData.value = row
  drawerUser.value = true
}

//重置列表
const reset = () => {
  Object.assign(userSearchDto.value, {
    username: '',
    role: '',
    currentPage: pageNo.value,
    pageSize: pageSize.value,
  })
}

const editInit = () => {
  Object.assign(addUserForm, {
    id: rowData.id,
    userId: rowData.userId,
    name: rowData.name,
    description: rowData.description,
    status: rowData.status,
    address: rowData.address,
  })
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
      message: `${addUserForm.id ? '修改' : '添加'}${addUserForm.username}成功!`,
    })
    emits('update:drawerUser', false)
  } else {
    ElMessage({
      type: 'error',
      message:
        result.message ||
        `${addUserForm.id ? '修改' : '添加'}${addUserForm.username}失败!`,
    })
  }
}

const cancelUserDrawer = (done: () => void) => {
  ElMessageBox.confirm('是否关闭当前对话框？').then(() => {
    emits('update:drawerUser', false)
  })
}
</script>

<style scoped lang="scss">
.el-form-item__content {
  width: 150px;
  display: inline;
}
</style>
