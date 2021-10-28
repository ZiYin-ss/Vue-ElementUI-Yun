import Vue from 'vue'  // 这个import是es6的语法
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue'
import router from  './router'
import store from './store'
import {postRequest,getRequest,putRequest,deleteRequest} from './utils/api'
import {initMenu} from '@/utils/menus'
import 'font-awesome/css/font-awesome.css'
import {downloadRequest} from '@/utils/download'

// 关闭控制台提示 浏览器里面
Vue.config.productionTip = false
Vue.use(ElementUI);

// 放到原型上面 是不是tm直接 vue.xxx用啊 vue实例得话 是不是用this.xx
// 这样就不要总是写了啊
Vue.prototype.postRequest = postRequest;
Vue.prototype.getRequest = getRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.deleteRequest = deleteRequest;
Vue.prototype.downloadRequest = downloadRequest

router.beforeEach((to,from,next)=>{
  // 这个地方就判断是不是登录
  // 就是说在每次路由跳转的时候 都要初始化一下菜单 要不然不见了
  if(window.sessionStorage.getItem('tokenStr')) {
    initMenu(router, store)
    // 判断用户信息是否存在
    if(!window.sessionStorage.getItem('user')){
      return getRequest('/admin/info').then(resp=>{
        if (resp){
          window.sessionStorage.setItem('user',JSON.stringify(resp))
          next()
        }
      })
    }
    next()
  }else {
      if(to.path=='/'){
        next();
      }else{
        // 其实这个地方是 添加了?redirect = to.path
        next('/redirect='+to.path)
      }
  }
})

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
