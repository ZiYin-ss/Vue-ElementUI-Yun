<template>
  <div>
    <el-form :rules="rules"
             v-loading="loading"
             element-loading-text="正在登录中"
             element-loading-spinner="el-icon-loading"
             element-loading-background="rgba(0, 0, 0, 0.8)"
             ref="loginForm"
             :model="loginForm"
             class="loginContainer">
      <h3 class="loginTitle">系统登录</h3>
      <el-form-item prop="username">
        <el-input type="text" auto-complete="false" v-model="loginForm.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item prop="password">
          <!--   auto-complete 这个就是关掉自动补全 就是输入用户名不有一大堆这个那个 关联        -->
        <el-input type="password" auto-complete="false" v-model="loginForm.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input type="text" auto-complete="false" v-model="loginForm.code" placeholder="点击图片更换验证码" style="width: 250px;margin-right: 5px;"></el-input>
        <img :src="captchaUrl"  @click="updateCaptcha" alt="你好">
      </el-form-item>
      <el-checkbox v-model="checked" class="loginRemember">记住我</el-checkbox>
      <el-button type="primary" @click="submitLogin" style="width: 100%">登录</el-button>
  </el-form>
  </div>
</template>

<script>
  import router from '../router'

  export default {
    name: "Login",
    data(){
      return{
        // 如果不加这个参数 会认为 还是调用原来那个地址 因为请求过来会有缓存吗
        captchaUrl:'/captcha?time='+new Date(),
        loginForm:{
          username:'admin',
          password:'123',
          code:''
        },
        loading:false, //判断是否显示正在加载中 自己调
        checked:true,
        rules:{  // 这个是这个UI的方法 并不是vue的方法 怪不得没见过 在element UI文档就有
          username:[{required:true,message:'请输入用户名',trigger:'blur'}],
          password:[{required:true,message:'请输入密码',trigger:'blur'}],
          code:[{required:true,message:'请输入验证码',trigger:'blur'}],
        }
      }
    },
    methods:{
      updateCaptcha(){
        this.captchaUrl = '/captcha?time='+ new Date();
      },
      submitLogin(){
        this.$refs.loginForm.validate((valid)=>{
          if(valid){
            // 验证得时候是不是要加载
            this.loading=true
            router.push('/home')
            this.postRequest('/login',this.loginForm).then(resp=>{
              if(resp){
                // 完毕了是不是就跳转
                this.loading=false
                // 存储用户token sessionStorage存数据
                const tokenStr = resp.obj.tokenHead+resp.obj.token;
                window.sessionStorage.setItem('tokenStr',tokenStr)
                // 跳转首页
                this.$router.replace('/home')
              }
            })
          }else {
            this.$message.error('这个是一条错误信息')
            return false
          }
        })
      }
    }
  }
</script>

<style scoped>
  .loginContainer{
    border-radius: 15px;     /*圆角*/
    background-clip:padding-box; /*背景范围*/
    margin: 180px auto;  /*第一个是上下 第二个是左右*/
    width: 350px;
    padding: 15px 35px 15px 35px;  /*边距上右下左*/
    background-color: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;  /*给边框上阴影  水平 垂直 大小 颜色*/
  }
  .loginTitle{
    margin: 0 auto 40px auto;
    text-align: center;
  }
  .loginRemember{
    text-align: left;
    margin: 0px 0px 15px 0px ;
  }
  .el-form-item__content{
    display: flex;
    align-items: center;
  }
</style>