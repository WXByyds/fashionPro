<script setup>
import { ref, watch } from 'vue'
import {
  Search,
  ShoppingCart,
  List,
  Avatar,
  HomeFilled
} from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { useTextStore } from '@/stores/textStore'

const formModel = ref({
  name: ''
})

const textStore = useTextStore()

const router = useRouter()

const onSearch = () => {
  textStore.isFlush += 1
  textStore.isSearch = true
  router.push('/user/index')
}

const toShopping = () => {
  router.push('/user/shopping')
}

const toOrder = () => {
  router.push('/user/order')
}

const toProfile = () => {
  router.push('/user/profile')
}

const toIndex = () => {
  router.push('/user/index')
}

watch(
  () => formModel.value.name,
  () => {
    textStore.text = formModel.value.name
  }
)
</script>

<template>
  <div>
    <el-container class="all-layout">
      <el-header class="header-layout">
        <div class="head-nav">
          <h1>FashionPro</h1>
          <el-form :inline="true" :model="formModel" class="search">
            <el-form-item>
              <el-input
                placeholder="输入要查找的商品"
                :prefix-icon="Search"
                v-model="formModel.name"
                class="search-input"
                clearable
              >
                <template #append>
                  <el-link type="primary" :underline="false" @click="onSearch">
                    搜索
                  </el-link>
                </template>
              </el-input>
            </el-form-item>
          </el-form>
          <el-link
            type="default"
            :underline="false"
            @click="toIndex"
            class="el-link-icon"
          >
            <el-icon class="el-icon-left"><HomeFilled /></el-icon>首页
          </el-link>
          <el-link
            type="default"
            :underline="false"
            @click="toShopping"
            class="el-link-icon"
          >
            <el-icon class="el-icon-left"><ShoppingCart /></el-icon>购物车
          </el-link>
          <el-link
            type="default"
            :underline="false"
            @click="toOrder"
            class="el-link-icon"
          >
            <el-icon class="el-icon-left"><List /></el-icon>订单
          </el-link>
          <el-link
            type="default"
            :underline="false"
            @click="toProfile"
            class="el-link-icon"
          >
            <el-icon class="el-icon-left"><Avatar /></el-icon>我的
          </el-link>
        </div>
      </el-header>

      <el-main class="main-layout">
        <el-backtop target=".main-layout" :right="100" :bottom="100" />
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>
* {
  margin: 0px;
  padding: 0px;
}

.all-layout {
  height: 100%;
  overflow-y: scroll;
  background-image: url('@/assets/loginBackground.png');
}

.header-layout {
  width: 100%;
  height: 8vh;
  text-align: center;
  background-color: #d6090956;
}

.main-layout {
  width: 80%;
  height: 90vh;
  margin: 0px auto;
  background-color: #e7e1d496;
  overflow: auto;
}

.main-layout::-webkit-scrollbar {
  display: none;
}

.head-nav {
  position: relative;
  display: flex;
  width: 90%;
  margin: 0px auto;
  text-align: center;
  line-height: 50px;
}

.head-nav h1 {
  width: 15%;
  padding-left: 10%;
  padding-right: 15%;
}

.search-input {
  width: 500px;
}

.el-link-icon {
  margin: 0px 4px;
}

.el-icon-left {
  margin: 0px 4px;
}
</style>
