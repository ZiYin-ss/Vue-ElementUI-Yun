import Vue from 'vue'  // 这个import是es6的语法
import App from './App.vue'
import router from  './router'

// 关闭控制台提示 浏览器里面
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
