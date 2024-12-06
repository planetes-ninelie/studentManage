<template>
  <div>
    <el-card class="card">
      <div class="right">
        <h1 class="title">{{ getTime() }}好！{{ GET_USERNAME() }}</h1>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
// import { ref } from 'vue'
//引用设置标题与logo配置文件
import setting from '@/setting'
import useUserStore from '@/store/modules/user'
import { getTime } from '@/utils/time'
import { GET_USERNAME } from '@/utils/token.ts'
</script>

<style lang="scss" scoped>
.card {
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: left;

  .right {
    padding: 20px;

    .title {
      font-size: 20pt;
      font-weight: bolder;
    }
  }
}

.card-menu {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;

  .item {
    width: 150px;
    margin: 10px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    cursor: pointer;

    .info {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      text-align: center;

      .name {
        font-size: 25px;
        line-height: 30px;
      }
    }
  }
}

.el-card__body {
  width: 100%;
}

h2 {
  margin: 15px;
  font-size: 25px;
  font-weight: bold;
}
</style>
