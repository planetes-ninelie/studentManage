<template>
  <div>
    <header>
      <el-form :model="userSearchDto" label-width="80px" :inline="true">
        <el-form-item label="用户昵称">
          <el-input
            type="text"
            placeholder="请输入用户昵称"
            v-model="userSearchDto.username"
          ></el-input>
        </el-form-item>
        <el-form-item label="所属角色">
          <el-select
            v-model="userSearchDto.role"
            placeholder="请选择用户所属角色"
            style="width: 140px"
          >
            <el-option
              v-for="item in roleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
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

    <!-- 新增用户或修改用户抽屉 -->
    <AddUser
      :drawerUser="drawerUser"
      @update:drawerUser="
        (newVal) => {
          drawerUser = newVal
          getHasUser()
        }
      "
      :isUpdate="isUpdate"
      :rowData="rowData"
      :roleOptions="roleOptions"
    ></AddUser>

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
        property="username"
        label="用户名"
        align="center"
        width="150"
        show-overflow-tooltip
      />
      <el-table-column
        property="sexStr"
        label="性别"
        align="center"
        width="150"
        show-overflow-tooltip
      />
      <el-table-column
        property="roleStr"
        label="角色"
        align="center"
        width="150"
        show-overflow-tooltip
      />
      <el-table-column
        property="phone"
        label="手机号"
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
  username: '',
  role: '',
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
  getRoles()
})

//获取用户数据
const getHasUser = async () => {
  const data = {
    username: userSearchDto.value.username,
    role: userSearchDto.value.role,
    page: pageNo.value,
    pageSize: pageSize.value,
  }
  let result: UsersData = await reqUsersData(data)
  if (result.code == 0) {
    total.value = result.data.total
    usersData.value = getUsersData(result.data.list)
  }
}

//改变当前页数
const changeSize = () => {
  pageNo.value = 1
  getHasUser()
}

//搜索用户
const search = async () => getHasUser()

//获取角色列表
const getRoles = () => {
  roleOptions.value.push({
    label: '未选择',
    value: '',
  })
  Object.entries(UserRole).forEach((item) => {
    roleOptions.value.push({
      label: item[1],
      value: item[0],
    })
  })
}

//获取表单数据
const getUsersData = (records: record[]) => {
  return records.map((record: record) => {
    const sexStr = Sex[record.sex]
    const roleStr = UserRole[record.role]
    return {
      ...record,
      sexStr,
      roleStr,
    }
  })
}

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

//删除用户
const deleteUser = async (row: any) => {
  let result: any = await reqDeleteById(row.id)
  if (result.code == 0) {
    ElMessage({
      type: 'success',
      message: `删除用户昵称${row.username}成功!`,
    })
    getHasUser()
  } else {
    ElMessage({
      type: 'error',
      message: `删除用户昵称${row.username}失败!`,
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
