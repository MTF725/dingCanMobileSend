import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter);

  const routes = [
  {path:'/',name:'default',redirect:'/index',component:()=>import('../views/index.vue')},//默认加载路由
  {path: '/index',name: 'index',component:()=>import('../views/index.vue')},//首页
  {path: '/orderManage',name: 'orderManage',component:()=>import('../views/orderManage.vue')},//订单管理
  {path: '/login',name: 'login',component:()=>import('../views/logIn.vue')},//登录
  {path: '/setUp',name: 'setUp',component:()=>import('../views/setUp.vue')},//设置
  {path: '/orderInfo',name: 'orderInfo',component:()=>import('../views/orderInfo.vue')},//订单信息
  {path: '/assess',name: 'assess',component:()=>import('../views/assess.vue')},//评价
];


const router = new VueRouter({
  routes
});



export default router;
