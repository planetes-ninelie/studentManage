<template>
  <div>
    <header>
      <el-form :model="userSearchDto" label-width="80px" :inline="true">
        <el-form-item label="商家名称">
          <el-input
            type="text"
            placeholder="请输入商家名称"
            v-model="userSearchDto.name"
          ></el-input>
        </el-form-item>
        <el-form-item label="商家地址">
          <el-input
            type="text"
            placeholder="请输入商家地址"
            v-model="userSearchDto.address"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="Plus"
            style="margin-right: 15px"
            @click="editUser(false, null)"
            v-has="`btn.User.add`"
          >
            添加
          </el-button>
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

    <!-- 新增商家或修改商家抽屉 -->
    <EditStore
      :drawerUser="drawerUser"
      @update:drawerUser="
        (newVal) => {
          drawerUser = newVal
          getHasUser()
        }
      "
      :isUpdate="isUpdate"
      :rowData="rowData"
    ></EditStore>

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
        property="name"
        label="商家名"
        align="center"
        width="150"
        show-overflow-tooltip
      />
      <el-table-column
        property="description"
        label="描述"
        align="center"
        width="150"
        show-overflow-tooltip
      />
      <el-table-column
        property="statusStr"
        label="状态"
        align="center"
        width="150"
        show-overflow-tooltip
      />
      <el-table-column
        property="userId"
        label="所属用户id"
        align="center"
        width="150"
        show-overflow-tooltip
      />
      <el-table-column
        property="address"
        label="地址"
        align="center"
        width="150"
        show-overflow-tooltip
      />
      <el-table-column label="操作" align="center" width="300" fixed="right">
        <template #="{ row }">
          <el-button
            type="primary"
            size="small"
            icon="Star"
            @click="recommend(row)"
          >
            推荐
          </el-button>
          <el-button
            type="primary"
            size="small"
            icon="Edit"
            @click="editUser(true, row)"
            v-has="`btn.User.update`"
          >
            编辑
          </el-button>
          <el-popconfirm
            :title="`确定删除${row.username}吗？`"
            @confirm="deleteUser(row)"
            width="250"
          >
            <template #reference>
              <el-button
                type="warning"
                size="small"
                icon="Delete"
                v-has="`btn.User.remove`"
              >
                删除
              </el-button>
            </template>
          </el-popconfirm>
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
  reqDeleteById,
  reqDeleteByIdArr,
} from '@/api/store/index'
import { UsersData, record, usersListDto } from '@/api/store/type'
import { ElMessage, ElTable, ElMessageBox } from 'element-plus'
import { StoreStatus, UserRole } from '@/utils/constant'
import type { UsersRow } from './EditStore/index.vue'
import EditStore from './EditStore/index.vue'
import { addRecommendation } from '@/api/setting/index'

//当前页数
let pageNo = ref<number>(1)
//每页最大页数
let pageSize = ref<number>(5)
//数据总数
let total = ref<number>(0)
//商家数据
let usersData = ref<record[]>([])
//搜索商家
let userSearchDto = ref<usersListDto>({
  name: '',
  address: '',
})
// 角色列表
// let roleOptions = ref<string[]>([])
//控制新增商家或更新商家的抽屉显示与隐藏
let drawerUser = ref<boolean>(false)
//控制抽屉表单是新增商家或更新商家
let isUpdate = ref<boolean>(false)
//行数据
let rowData = ref<UsersRow>({})
//组件挂载初始化
onMounted(() => {
  getHasUser()
  //getRoles()
})

//获取商家数据
const getHasUser = async () => {
  const data = {
    name: userSearchDto.value.name,
    address: userSearchDto.value.address,
    page: pageNo.value,
    pageSize: pageSize.value,
  }
  let result: UsersData = await reqUsersData(data)
  if (result.code == 0) {
    total.value = result.data.total
    result.data.list.forEach((item) => {
      item.statusStr = StoreStatus[item.status]
    })
    usersData.value = result.data.list
  }
}

//改变当前页数
const changeSize = () => {
  pageNo.value = 1
  getHasUser()
}

//搜索商家
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
    name: '',
    address: '',
  })
}

//删除商家
const deleteUser = async (row: any) => {
  let result: any = await reqDeleteById(row.id)
  if (result.code == 0) {
    ElMessage({
      type: 'success',
      message: `删除商家${row.username}成功!`,
    })
    getHasUser()
  } else {
    ElMessage({
      type: 'error',
      message: `删除商家${row.username}失败!`,
    })
  }
}

const recommend = async (row) => {
  const data = {
    type: 'shop',
    targetId: row.id,
    displayOrder: 50,
  }
  console.log(data)
  const res = await addRecommendation(data)
  if (res.code == 0) {
    ElMessage({
      type: 'success',
      message: `推荐菜品${row.name}成功!`,
    })
    getHasUser()
  } else {
    ElMessage({
      type: 'error',
      message: `推荐菜品${row.name}失败!`,
    })
  }
}
</script>

<style scoped lang="scss">
.el-form-item__content {
  width: 150px;
  display: inline;
}
</style>
