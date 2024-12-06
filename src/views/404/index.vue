<template>
  <div class="box">
    <div class="top">
      <img src="../../assets/images/error_images/404.png" alt="" />
    </div>
    <div class="bottom">
      <el-link @click="goHome" class="link">回到首页</el-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

let $router = useRouter()
const goHome = () => {
  $router.push('/home')
}
</script>

<style scoped lang="scss">
.box {
  width: 100vw;
  height: 100vh;

  .top {
    display: flex;
    justify-content: center;

    img {
      margin-top: 100px;
      width: 800px;
      height: 400px;
    }
  }

  .bottom {
    display: flex;
    justify-content: center;
    .link {
      font-size: 20px;
    }
  }
}
</style>
