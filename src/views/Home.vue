<template>
  <div>
    <el-container class="homeHeader">
      <el-header>
        <div class="title">云E办</div>
         <div>
           <el-button type="text" icon="el-icon-bell" size="normal" @click="goChat" style="color:black;margin-right: 8px;"></el-button>
           <el-dropdown class="userInfo" @command="commandHandler">
          <span class="el-dropdown-link">
            {{user.name}}<i><img :src="user.userFace" alt="你好"></i>
          </span>
             <el-dropdown-menu slot="dropdown">
               <el-dropdown-item command="userinfo">个人中心</el-dropdown-item>
               <el-dropdown-item command="setting">设置</el-dropdown-item>
               <el-dropdown-item command="logout">注销登录</el-dropdown-item>
             </el-dropdown-menu>
           </el-dropdown>
         </div>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <!-- unique-opened 只打开当前这个 不会打开多个         -->
          <el-menu router unique-opened>
            <el-submenu index="1" v-for="(item,index) in routes"
                        :key="index"
                        v-if="!item.hidden">
                <template slot="title">
                  <i :class="item.icoCls"></i>
                  <span>{{item.name}}</span>
                </template>
                <el-menu-item  :index="children.path" v-for="(children,index) in item.children">
                  {{children.name}}
                </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <el-breadcrumb v-if="this.$router.currentRoute.path!=='/home'">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{this.$router.currentRoute.name}}</el-breadcrumb-item>
          </el-breadcrumb>
          <div class="homeWelcome" v-else>欢迎来到云E办系统</div>
          <router-view class="homeRouterView"/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "Home",
  data(){
    return {
      user:JSON.parse(window.sessionStorage.getItem('user'))
    }
  },
  computed:{
    routes(){
      return this.$store.state.routes
    }
  },
  methods:{
    /*
      这个select叫做菜单点击回调 就是点击菜单 就会去找你点击的index值
      menuClick(index){
        this.$router.push(index)
      },
    */
    goChat(){
      this.$router.push('/chat')
    },
    commandHandler(command){
      if(command ==='logout'){
        this.$confirm('此操作将退出登录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 发送退出登录请求
          this.postRequest('/logout')
          // 删除sessionStorage里面的东西  令牌
          window.sessionStorage.removeItem('tokenStr')
          window.sessionStorage.removeItem('user')
          // 情况vuex的菜单 要不然下次还是上次别人的菜单
          this.$store.commit('initRoutes',[])
          // 返回登录页面
          this.$router.replace('/')
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });
        });

      }else if(command ==='userinfo'){

      }else if(command ==='setting'){

      }
    }
  }
}
</script>

<style scoped>
  .homeHeader{
    background: #409eff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px;
    box-sizing: border-box;
  }
  .homeHeader .title{
    font-size: 30px;
    color: white;
    font-family: 楷体;
  }
  .homeHeader .userInfo{
    cursor: pointer;  /*改动光标的形状 小箭头的那个*/
  }
  .el-dropdown-link img{
    width: 48px;
    height: 48px;
    border-radius: 24px;
    margin-left: 8px;
  }
  .homeWelcome{
    text-align: center;
    font-size: 30px;
    font-family: 华文楷体;
    color: #409eff;
    padding-top: 50px;
  }
  .homeRouterView{
    margin-top: 10px;
  }
</style>