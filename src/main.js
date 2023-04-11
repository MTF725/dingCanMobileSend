import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import Vant from 'vant';
import axios from 'axios';
import 'vant/lib/index.css';




// 全局引入顶部导航组件
import topFixedNav from './components/topFixedNav.vue';
Vue.component('top-fixed-nav',topFixedNav);

Vue.prototype.$axios = axios; 
Vue.use(Vant);

Vue.config.productionTip = false;





new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
