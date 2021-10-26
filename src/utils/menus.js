import {getRequest} from '@/utils/api'

export const initMenu =(router,store) =>{
  if(store.state.routes.length>0){
    return
  }
  getRequest('/stystem/config/menu').then(data=>{
    if (data){
      // 格式化好的数据
      let fmtRoutes = formatRoutes(data)
      // 添加到路由配置 routes里面的 这个addRoutes 就是函数 把东西添加到routes里面
      router.addRoutes(fmtRoutes)
      //  存储数据
      store.commit('initRoutes',fmtRoutes)
    }
  })
}

export const formatRoutes=(routes) =>{
  let fmtRoutes = [];
  routes.forEach(route=>{
    let {path,component,name,icoCls,children}=route
    if(children&&children instanceof Array){
      children = formatRoutes(children)
    }
    let fmRouter={
      path:path,
      name:name,
      icoCls:icoCls,
      children:children,
      component(resolve){
        require(['../views/'+component+'.vue'],resolve)
      }
    }
    //  注意这个地方有点难理解 其实就是fmRouter这个东西其实就是路由routes里面的一个个路由啊
    //  component不好理解 有没有发现在routes里面 组件是不是也是一个个函数啊 是不是啊 就是这样的写法
    //  children其实到最后是不是也会返回 routes里面的children的格式啊 不是递归了吗
    //  有个通用理解 你就想你这个函数会返回什么 按着他的流程走一遍 就知道了 多理解
    fmtRoutes.push(fmRouter)
  });
  return fmtRoutes
}