<template>
  <div>
    <div style="display: flex;justify-content: center;margin-top: 10px;">
      <el-input v-model="keywords" placeholder="通过用户名搜索用户..." prefix-icon="el-icon-search" style="width: 400px;margin-right: 10px;"></el-input>
      <el-button icon="el-icon-search" @click="doSearch" type="primary">搜索</el-button>
    </div>
    <div class="admin-container">
      <el-card class="admin-card" v-for="(admin,index) in admins">
        <div slot="header" class="clearfix">
          <span>{{admin.name}}</span>
          <el-button style="float: right; padding: 3px 0;color: red" icon="el-icon-delete" @click="deleteAdmin(admin)" type="text"></el-button>
        </div>
        <div>
          <div class="img-container">
            <img :src="admin.userFace" class="userFace-img" :alt="admin.name" :title="admin.name">
          </div>
        </div>
        <div class="userinfo-content">
          <div>用户名:{{admin.name}}</div>
          <div>手机号码:{{admin.phone}}</div>
          <div>电话号码:{{admin.telephone}}</div>
          <div>地址:{{admin.address}}</div>
          <div>用户状态:
            <el-switch style="display: block" v-model="admin.enabled" active-color="#13ce66" inactive-color="#ff4949" @change="enabledChange(admin)" active-text="启用" inactive-text="禁用">
            </el-switch>
          </div>
          <div>
            用户角色:
            <el-tag style="margin-right: 10px;" type="success" v-for="(role,index) in admin.roles" :key="index">{{role.nameZh}}</el-tag>
            <el-popover placement="right" title="角色列表" width="200" @show="showPop(admin)"  @hide="hidePop(admin)" trigger="click">
              <el-select v-model="selectRoles" multiple placeholder="请选择">
                <el-option v-for="(r,index) in allRoles" :key="index" :label="r.nameZh" :value="r.id"></el-option>
              </el-select>
              <el-button slot="reference" type="text" icon="el-icon-more"></el-button>
            </el-popover>
          </div>
          <div>
            备注:{{admin.remark}}
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "SysAdmin",
  data(){
    return {
      admins:[],
      keywords:'',
      allRoles:[],
      selectRoles:[]
    }
  },
  mounted() {
    this.initAdmins()
  },
  methods:{

    hidePop(admin){
      let roles = []
      Object.assign(roles,admin.roles);
      let flag = false
      if(roles.length === this.selectRoles.length){
        flag=true
      }else {
        for(let i=0;i<roles.length;i++){
          let role =roles[i];
          for(let j=0;j<this.selectRoles.length;j++){
            let sr = this.selectRoles[j];
            if(role.id===sr){
              roles.splice(i,1)
              i--;
              break;
            }
          }
        }
        if(roles.length!==0){
          flag = true
        }
      }


      if(flag){
        let url = '/system/admin/role?adminId='+admin.id
        this.selectRoles.forEach(sr=>{
          url+='&rids='+sr;
        })
        this.putRequest(url).then(resp=>{
          if (resp){
            this.initAdmins()
          }
        })
      }
    },
    showPop(admin){
      this.getRequest('/system/admin/roles').then(resp=>{
        if(resp){
          this.allRoles = resq
        }
      })
      let roles = admin.roles
      this.selectRoles = []
      roles.forEach(r=>{
        this.selectRoles.push(r.id)
      })
    },
    enabledChange(admin){
      // 这个地方是把原来的东西都加上了 然后作为更新 switch的值也更新了
      this.putRequest('/system/admin/',admin).then(resp=>{
        if(resp){
          this.initAdmins()
        }
      })
    },
    deleteAdmin(admin){
      this.$confirm('此操作将永久删除['+admin.name+']操作员, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('/system/admin/'+admin.id).then(resp=>{
          if(resp){
            this.initAdmins()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    doSearch(){
      this.initAdmins()
    },
    initAdmins(){
      this.getRequest('/system/admin/?keywords='+this.keywords).then(resp=>{
        if(resp){
          this.admins = resp
        }
      })
    }
  }
}
</script>

<style scoped>
  .admin-card{
    width: 350px;
    margin-bottom: 20px;
  }
  .admin-container{
    display: flex;
    margin-top: 10px;
    flex-wrap: wrap;
    justify-content: space-around;
  }
  .userFace-img{
    width: 72px;
    height: 72px;
    border-radius: 20px;
  }
  .img-container{
    width: 100%;
    display: flex;
    justify-self: center;
  }
  .userinfo-content{
    font-size: 12px;
    color: #409eff;
  }
</style>