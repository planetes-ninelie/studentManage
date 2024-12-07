<template>
  <div>
    <header>
      <el-form :model="userSearchDto" label-width="80px" :inline="true">
        <el-form-item label="用户昵称">
          <el-input type="text" placeholder="请输入用户昵称" v-model="userSearchDto.username"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Plus" style="margin-right: 15px" @click="editUser(false, null)">
            添加
          </el-button>
          <el-button type="success" icon="Search" style="margin-right: 15px" @click="search">
            搜索
          </el-button>
          <el-button type="default" icon="Refresh" style="margin-right: 15px" @click="reset">
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </header>

    <!-- 新增用户或修改用户抽屉 -->
    <AddUser :drawerUser="drawerUser" @update:drawerUser="(newVal) => {
      drawerUser = newVal
      getHasUser()
    }
      " :isUpdate="isUpdate" :rowData="rowData"></AddUser>

    <!-- 表格数据 -->
    <el-table border :data="usersData" style="margin-bottom: 10px">
      <el-table-column property="id" align="center" label="id" width="350" show-overflow-tooltip />
      <el-table-column property="name" label="学生姓名" align="center" width="150" show-overflow-tooltip />
      <el-table-column property="age" label="年龄" align="center" width="150" show-overflow-tooltip />
      <el-table-column property="grade" label="年级" align="center" width="150" show-overflow-tooltip />
      <el-table-column label="操作" align="center" width="300" fixed="right">
        <template #="{ row }">
          <el-button type="primary" size="small" icon="Edit" @click="editUser(true, row)">
            编辑
          </el-button>
          <el-popconfirm :title="`确定删除${row.name}吗？`" @confirm="deleteUser(row)" width="250">
            <template #reference>
              <el-button type="warning" size="small" icon="Delete">
                删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination @size-change="changeSize" @current-change="getHasUser()" :pager-count="9"
      v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[5, 10, 15, 20]" :background="true"
      layout="prev, pager, next, jumper, ->, sizes, total" :total="total" />
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, reactive, ref, toRaw, watch } from 'vue'
import {
  reqAddOrUpdateUserData,
  reqToAssign,
  reqUsersData,
  reqDeleteById,
} from '@/api/user/index'
import { UsersData, record, usersListDto } from '@/api/user/type'
import { ElMessage, ElTable, ElMessageBox } from 'element-plus'
import { GetRoleResponseData, RoleRecords } from '@/api/acl/role/type'
import { getRolesData } from '@/api/acl/role/index'
import { Sex, UserRole } from '@/utils/constant'
import { formatDateTime } from '@/utils/time'
import type { UsersRow } from '@/components/AddUser/type'

//当前页数
let pageNo = ref<number>(1)
//每页最大页数
let pageSize = ref<number>(5)
//数据总数
let total = ref<number>(0)
//用户数据
let usersData = ref<record[]>([])
//搜索用户
let userSearchDto = ref<usersListDto>({
  username: ''
})
// 角色列表
let roleOptions = ref<string[]>([])
//控制新增用户或更新用户的抽屉显示与隐藏
let drawerUser = ref<boolean>(false)
//控制抽屉表单是新增用户或更新用户
let isUpdate = ref<boolean>(false)
//行数据
let rowData = ref<UsersRow>({})
//组件挂载初始化
onMounted(() => {
  getHasUser()
})

//获取用户数据
const getHasUser = async () => {
  const data = {
    username: userSearchDto.value.username,
    page: pageNo.value,
    size: pageSize.value,
  }
  let result: UsersData = await reqUsersData(data)
  total.value = result.numberOfElements
  usersData.value = result.content
}

//改变当前页数
const changeSize = () => {
  pageNo.value = 1
  getHasUser()
}

//搜索用户
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
    currentPage: pageNo.value,
    pageSize: pageSize.value,
  })
}

//删除用户
const deleteUser = async (row: any) => {
  let result: any = await reqDeleteById(row.id)
  ElMessage({
    type: 'success',
    message: `删除${row.name}成功!`,
  })
  getHasUser()
}
</script>

<style scoped lang="scss">
.el-form-item__content {
  width: 150px;
  display: inline;
}
</style>
