import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    component: () => import('@/views/login/login.vue')
  },
  {
    path: '/home',
    component: () => import('@/views/layout/index.vue'),
    children: [
      {
        path: 'todolist',
        component: () => import('@/views/TodoLister/todolist.vue')
      },
      {
        path: 'notice',
        component: () => import('@/views/noticeMessage/noticeMessage.vue')
      },
      {
        path: 'menuManage',
        component: () => import('@/views/menuManage/menuManage.vue')
      },
      {
        path: 'goodsPrice',
        component: () => import('@/views/AllPlay/smallCards.vue')
      },
      {
        path: 'goodsNotice',
        component: () => import('@/views/goodsNotice/goodsNotice.vue')
      },
      {
        path: 'UploadImage',
        component: () => import('@/views/upLoadImage/index.vue')
      },
      {
        path: '/home',
        redirect: 'content'
      },
      {
        path: 'content',
        component: () => import('@/views/layout/content.vue')
      }
    ]
  },
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '*',
    redirect: '/home'
  }
]
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
const router = new VueRouter({
  routes
})

export default router
