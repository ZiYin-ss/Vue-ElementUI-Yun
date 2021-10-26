import Vue  from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)


export default new VueRouter({
  routes:[
      {
        path:'/',
        name:'Login',
        /*
        这个name
          通过name属性，为一个页面中不同的router-view渲染不同的组件,
            如：将上面代码的Hello渲染在 name为Hello的router-view中，
            将text渲染在name为text的router-view中。不设置name的将为默认的渲染组件。
          可以用name传参 使用$route.name获取组件name值
          用于pramas传参的引入 pramas必须用name来引入
            query可以用name或者path来引入（不明白vue-router传参的可以参考我的另一篇文章vue-router中 query传参和params传参的区别和注意事项）
        */
        component: () => import("../views/Login"),
        hidden:true
      },
      {
        path:'/home',
        name:'导航一',
        component: () => import("../views/Home"),
        children:[
          {
            path:'/test1',
            name:'选项1',
            component:() => import("../views/Test1"),
          },
          {
            path:'/test2',
            name:'选项2',
            component:() => import("../views/Test2"),
          }
        ]
      },


  ]
})
