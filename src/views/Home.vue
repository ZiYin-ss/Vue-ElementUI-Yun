<template>
  <div>
    <el-container>
      <el-header>Header</el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu router>
            <el-submenu index="1" v-for="(item,index) in this.$router.options.routes"
                        :key="index"
                        v-if="!item.hidden">
                <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>{{item.name}}</span>
                </template>
                <el-menu-item  :index="children.path" v-for="(children,index) in item.children">
                  {{children.name}}
                </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "Home",
  methods:{
    // 这个select叫做菜单点击回调 就是点击菜单 就会去找你点击的index值
    // menuClick(index){
    //   this.$router.push(index)
    // },
  }
}
</script>

<style scoped>

</style>