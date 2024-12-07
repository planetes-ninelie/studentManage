<template>
  <div class="layout_container">
    <el-container>
      <el-header>
        <Header />
      </el-header>
      <el-container>
        <el-main>
          <!-- 二级出口 -->
          <Main></Main>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
//获取路由对象
import { useRoute } from 'vue-router'
//引入菜单组件
import Menu from './menu/index.vue'
//右侧内容展示区域
import Main from './main/index.vue'
import Header from './header/index.vue'

//获取用户相关的小仓库
import useUserStore from '@/store/modules/user'
//获取layout相关小仓库
import useLayOutSettingStore from '@/store/modules/setting'
let userStore = useUserStore()

//获取layout配置仓库
let LayOutSettingStore = useLayOutSettingStore()

//获取路由对象
let $route = useRoute()
</script>

<script lang="ts">
export default {
  name: 'Layout',
}
</script>

<style scoped lang="scss">
.layout_container {
  width: 100%;
  height: 100vh;

  .el-header {
    top: 0;
    position: sticky;
    z-index: 999;
    background-color: #899faa;
  }

  Main {
    margin: 20px 250px;
    background-color: #899faa2d;
    border-radius: 20px;
  }
}
</style>
