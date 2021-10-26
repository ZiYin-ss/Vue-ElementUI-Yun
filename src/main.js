import Vue from 'vue'  // 这个import是es6的语法
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue'
import router from  './router'
import store from './store'
import {postRequest,getRequest,putRequest,deleteRequest} from './utils/api'

// 关闭控制台提示 浏览器里面
Vue.config.productionTip = false
Vue.use(ElementUI);

// 放到原型上面 是不是tm直接 vue.xxx用啊 vue实例得话 是不是用this.xx
// 这样就不要总是写了啊
Vue.prototype.postRequest = postRequest;
Vue.prototype.getRequest = getRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.deleteRequest = deleteRequest;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
