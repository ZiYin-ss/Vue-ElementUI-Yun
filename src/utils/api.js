import axios from 'axios'
import {Message} from 'element-ui'
import router from '../router'

// 请求拦截器
axios.interceptors.request.use(config=>{
  // 如果存在token 那么请求会携带这个token
  // 再说一遍这个是全局的所有请求都会经过 当然了第一次登录的时候也不需要加 登录之后做登录之后才能做的事 不就会判断是否登录
  // 还记得django的request.user 用户登录之后产生了 一个user 现在知道怎么产生的吗
  if(window.sessionStorage.getItem('tokenStr')){
    config.headers['Authorization'] = window.sessionStorage.getItem('tokenStr')
  }
  return config
},error => {
  console.log(error)
})


// 响应拦截器
//这个是整体的响应拦截器 因为无论请求那个url都会调用到这个axios的拦截器
// 还有一个叫实例拦截器 instance
axios.interceptors.response.use(success=>{
  // 业务逻辑错误  这个if这 只有请求错误的时候 打印错误信息 然后才return
  // 但是当请求正常的时候  只打印信息 是不会return的 同时也没法走啊
  if(success.status&&success.status==200){
    if(success.data.code==500 || success.data.code==401|| success.data.code==403){
      Message.error({message:success.data.message})
      return
    }
    if(success.data.message){
      Message.success({message:success.data.message})
    }
  }
  // 其实这个是不是和 supermall项目的时候 也是返回这个 success.data 但是没有做上面的拦截器 也就是说拦截器可以靠这样做好
  return success.data
},error => {
  if(error.response.code == 504 || error.response.code==404){
    Message.error({message:'服务器被吃了 囧囧( ╯□╰ )'})
  }else if(error.response.code==403){
    Message.error({message:'权限不足 请联系管理员'})
  }else if(error.response.code==401){
    // 还需要跳转登录页面
    Message.error({message:'没有登录'})
    router.replace('/'); //这个不就是替换当前路由页面 把路由replace为'/'
  }else {
    if (error.response.data.message){
      Message.error({message:error.response.data.message})
    }else{
      Message.error({message:'未知错误'})
    }
  }
  return
})


let base = ''


// 传送json格式的post请求
export const postRequest = (url,params)=>{
  return axios({
    method:'post',
    url:`${base}${url}`,
    params:params
  })
}

// 传送json格式的put请求
export const putRequest = (url,params)=>{
  return axios({
    method:'put',
    url:`${base}${url}`,
    params:params
  })
}

// 传送json格式的get请求
export const getRequest = (url,params)=>{
  return axios({
    method:'get',
    url:`${base}${url}`,
    params:params
  })
}

// 传送json格式的delete请求
export const deleteRequest = (url,params)=>{
  return axios({
    method:'delete',
    url:`${base}${url}`,
    params:params
  })
}