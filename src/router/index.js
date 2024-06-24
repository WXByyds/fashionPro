import { useUserStore } from '@/stores/userStore'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/loginView/loginPage.vue')
    },
    {
      path: '/user',
      name: 'user',
      component: () => import('@/views/userView/userView.vue'),
      redirect: '/user/index',
      meta: { type: 'user' },
      children: [
        {
          path: '/user/index',
          name: 'index',
          meta: { type: 'user' },
          component: () => import('@/views/userView/indexView.vue')
        },
        {
          path: '/user/order',
          name: 'order',
          meta: { type: 'user' },
          component: () => import('@/views/userView/orderView.vue')
        },
        {
          path: '/user/shopping',
          name: 'shopping',
          meta: { type: 'user' },
          component: () => import('@/views/userView/shoppingView.vue')
        },
        {
          path: '/user/profile',
          name: 'profile',
          meta: { type: 'user' },
          component: () => import('@/views/userView/profileView.vue')
        }
      ]
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/adminView/layoutView.vue'),
      redirect: '/admin/customer',
      meta: { type: 'admin' },
      children: [
        {
          path: '/admin/customer',
          name: 'customer',
          meta: { type: 'admin' },
          component: () => import('@/views/adminView/customerView.vue')
        },
        {
          path: '/admin/category',
          name: 'category',
          meta: { type: 'admin' },
          component: () => import('@/views/adminView/categoryView.vue')
        },
        {
          path: '/admin/commodity',
          name: 'commodity',
          meta: { type: 'admin' },
          component: () => import('@/views/adminView/commodityView.vue')
        },
        {
          path: '/admin/amount',
          name: 'amount',
          meta: { type: 'admin' },
          component: () => import('@/views/adminView/sellManage/amountView.vue')
        },
        {
          path: '/admin/record',
          name: 'record',
          meta: { type: 'admin' },
          component: () => import('@/views/adminView/sellManage/recordView.vue')
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  if (!userStore.token && to.path !== '/login') return next('/login')
  else next()
})

export default router
