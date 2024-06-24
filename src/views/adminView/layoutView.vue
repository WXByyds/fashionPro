<script setup>
import { useUserStore } from '@/stores/userStore'
import {
  User,
  Money,
  Menu,
  Handbag,
  UserFilled,
  SwitchButton,
  Document,
  Histogram
} from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
const userStore = useUserStore()
const router = useRouter()

const exitSystem = () => {
  userStore.token = ''
  router.push('/login')
}
</script>

<template>
  <div class="all-layout">
    <el-container>
      <el-header class="header-layout">
        <h1 style="width: 80%; display: inline-block">FashionPro管理系统</h1>
        <span style="background-color: transparent">
          <el-icon>
            <UserFilled />
          </el-icon>
          {{ userStore.account }}
        </span>
        <el-link type="primary" @click="exitSystem">
          <el-icon class="el-icon-left"><SwitchButton /></el-icon>退出系统
        </el-link>
      </el-header>
      <el-container>
        <el-aside class="aside-layout">
          <el-menu
            router
            default-active="/admin/customer"
            active-text-color="#ffd04b"
            background-color="#c18f8f"
            text-color="#fff"
            class="menu-layout"
          >
            <el-menu-item index="/admin/customer">
              <el-icon><User /></el-icon>
              <span>顾客管理</span>
            </el-menu-item>
            <el-menu-item index="/admin/category">
              <el-icon><Menu /></el-icon>
              <span>服装分类管理</span>
            </el-menu-item>
            <el-menu-item index="/admin/commodity">
              <el-icon><Handbag /></el-icon>
              <span>服装管理</span>
            </el-menu-item>
            <el-sub-menu index="/admin/sell">
              <template #title>
                <el-icon><Money /></el-icon>
                <span>销售管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="/admin/record">
                  <el-icon><Document /></el-icon>
                  <span>销售订单</span>
                </el-menu-item>
                <el-menu-item index="/admin/amount">
                  <el-icon><Histogram /></el-icon>
                  <span>销售统计</span>
                </el-menu-item>
              </el-menu-item-group>
            </el-sub-menu>
          </el-menu>
        </el-aside>
        <el-main class="el-main-layout">
          <div class="main-layout">
            <router-view></router-view>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>
.all-layout {
  background-image: url('@/assets/loginBackground.png');
}

.header-layout,
.header-layout span {
  height: 8vh;
  width: 100%;
  background-color: #af4343d8;
  color: #faf6f6;
  line-height: 50px;
  overflow: hidden;
  vertical-align: middle;
}

.test {
  color: #c18f8f;
}

.aside-layout {
  width: 250px;
}

.menu-layout {
  height: 92vh;
}

.el-icon-left {
  margin: 0px 4px;
}

.main-layout {
  width: 100%;
  height: 86vh;
  margin: 0px auto;
  border: rgba(0, 0, 0, 0.089) solid 1px;
  border-radius: 10px;
  box-shadow: 6px 3px 2px 2px rgba(0, 0, 255, 0.2);
}

.el-main-layout {
  width: 100%;
  height: 92vh;
  background-color: #d9f3e400;
}
</style>
