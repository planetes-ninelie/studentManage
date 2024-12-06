<template>
  <div>
    <header>
      <el-form :model="userSearchDto" label-width="80px" :inline="true">
        <el-form-item label="订单状态">
          <el-select
            v-model="userSearchDto.orderStatus"
            placeholder="请选择订单状态"
            style="width: 100px"
          >
            <el-option
              v-for="item in status"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="success"
            icon="Search"
            style="margin-right: 15px"
            @click="search"
          >
            搜索
          </el-button>
          <el-button
            type="default"
            icon="Refresh"
            style="margin-right: 15px"
            @click="reset"
          >
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </header>

    <!-- 新增订单或修改订单抽屉 -->
    <EditOrder
      :drawerUser="drawerUser"
      @update:drawerUser="
        (newVal) => {
          drawerUser = newVal
          getHasUser()
        }
      "
      :isUpdate="isUpdate"
      :rowData="rowData"
      :status="status"
    ></EditOrder>

    <!-- 表格数据 -->
    <el-table border :data="usersData" style="margin-bottom: 10px">
      <el-table-column
        property="orderId"
        align="center"
        label="id"
        width="100"
        show-overflow-tooltip
      />
      <el-table-column
        property="userId"
        label="创建者id"
        align="center"
        width="150"
        show-overflow-tooltip
      />
      <el-table-column
        property="businessId"
        label="菜品id"
        align="center"
        width="150"
        show-overflow-tooltip
      />
      <el-table-column
        property="totalAmount"
        label="总金额"
        align="center"
        width="150"
        show-overflow-tooltip
      />
      <el-table-column
        property="deliveryAddress"
        label="配送地点"
        align="center"
        width="150"
        show-overflow-tooltip
      />
      <el-table-column
        property="deliveryFee"
        label="配送费"
        align="center"
        width="150"
        show-overflow-tooltip
      />
      <el-table-column
        property="remarks"
        label="备注"
        align="center"
        width="150"
        show-overflow-tooltip
      />
      <el-table-column
        property="status"
        label="状态"
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
import type { UsersRow } from './EditOrder/index.vue'
import EditOrder from './EditOrder/index.vue'

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
//控制抽屉表单是新增订单或更新订单
let isUpdate = ref<boolean>(false)
//行数据
let rowData = ref<UsersRow>({})
//组件挂载初始化
onMounted(() => {
  getHasUser()
  status.value = ['待处理', '配送中', '取消', '配送到达']
})
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
  isUpdate.value = val
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
</script>

<style scoped lang="scss">
.el-form-item__content {
  width: 150px;
  display: inline;
}
</style>
