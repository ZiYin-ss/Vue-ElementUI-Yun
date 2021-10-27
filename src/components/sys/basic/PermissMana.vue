<template>
  <div>
    <div class="permissManaTool">
      <el-input size="small" placeholder="请输入角色英文名" v-model="role.name">
        <template slot="prepend">ROLE_</template>
      </el-input>
      <el-input v-model="role.nameZh" size="small" placeholder="请输入角色中文名" @keyup.enter.native="doAddRole" ></el-input>
      <el-input type="primary" icon="el-icon-plus" size="small" @click="doAddRole">添加角色</el-input>
    </div>
    <div class="permissManaMain">
      <el-collapse v-model="activeName"  accordion @click="change">
        <el-collapse-item :title="r.nameZh" name="r.id" v-for="(r,index) in roles" :key="index">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>可访问资源</span>
              <el-button style="float: right; padding: 3px 0;color: #ff0000" type="text" @click="doDeleteRole(r)" icon="el-icon-delete"></el-button>
            </div>
            <div>
              <el-tree show-checkbox ref="tree" :default-checked-keys="selectedMenus" node-key="id" :data="allMenus" :props="defaultProps" :key="index"></el-tree>
              <div style="display: flex;justify-content: flex-end">
                <el-button size="mini" @click="cancelUpdate" >取消修改</el-button>
                <el-button type="primary" @click="doUpdate(r.id,index)" size="mini">确认修改</el-button>
              </div>
            </div>
          </el-card>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
export default {
  name: "PermissMana",
  data(){
    return {
      role:{
        name:'',
        nameZh:''
      },
      allMenus:[],
      roles:[],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      selectedMenus:[],
      activeName:-1 //显示那个 -1全关掉
    }
  },
  mounted() {
    this.initRoles()
  },
  methods:{
    doDeleteRole(role){
      this.$confirm('此操作将永久删除['+role.name+']角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('/system/basic/permiss/role/'+role.id).then(resp=>{
          if(resp){
            this.initRoles()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    doAddRole(){
      if(this.role.nameZh&&this.role.name){
        this.postRequest('/system/basic/permiss/role',this.role).then(resp=>{
          if(resp){
            this.initRoles();
            this.role.name = ''
            this.role.nameZh = ''
          }
        })
      }else{
        this.$message.error('所有字段不能为空')
      }
    },
    cancelUpdate(){
      this.activeName = -1
    },
    initRoles(){
      this.getRequest('/system/basic/permiss/').then(resp=>{
        if(resp){
          if(resp){
            this.roles = resp
          }
        }
      })
    },
    // 父元素的change函数 参数是每个el-collapse-item里面的 name="r.id"
    change(rid){
      if(rid){
        this.initAllMenus()
        this.initSelectedMenus(rid)
      }
    },
    initAllMenus(){
      this.getRequest('/system/basic/permiss/menus').then(resp=>{
        if(resp){
          this.allMenus=resp
        }
      })
    },
    initSelectedMenus(rid){
      this.getRequest('/system/basic/permiss/mid/'+rid).then(resq=>{
        if(resq){
          this.selectedMenus=resq
        }
      })
    },
    doUpdate(rid,index){
      // 这个地方 先拿到当前自己点击的这个tree 就是当前循环里面的那个 tree
      let tree = this.$refs.tree[index]
      // 这个是拿到所有你选中的id 是数组形式  参数true就是二级节点 然后发送给后端根据id去修改
      let selectedKey = tree.getCheckedKeys(true);
      let url = '/system/basic/permiss/?rid='+rid
      selectedKey.forEach(key=>{
        url+='&mids'+key;
      })
      this.putRequest(url).then(resp=>{
        if(resp){
          this.initRoles();
          this.activeName=-1;
        }
      })
    }
  }
}
</script>

<style scoped>
  .permissManaTool{
    display: flex;
    justify-content: flex-start;
  }
  .permissManaTool el-input{
    width: 300px;
    margin-right: 6px;
  }
  .permissManaMain{
    margin-top: 10px;
    width: 700px;
  }
</style>