<template>
  <div>
    <div>
      <el-input size="small" class="addPosInput" placeholder="添加职位..." @keyup.enter.native="addPosition" suffix-icon="el-icon-plus" v-model="pos.name">
      </el-input>
      <el-button size="small" icon="el-icon-plus" type="primary" @click="addPosition">添加</el-button>
    </div>
    <div class="posManaMain">
      <el-table size="small" :data="positions" style="width: 70%" stripe border>
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="编号" width="55"></el-table-column>
        <el-table-column prop="name" label="职位" width="120"></el-table-column>
        <el-table-column prop="createDate" label="创建时间" width="200"></el-table-column>
        <el-table-column prop="enabled" label="是否启用" width="120"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: "PosMana",
  data(){
    return {
      pos:{
        name:''
      },
      positions:[]
    }
  },
  mounted() {
    this.initPositions()
  },
  methods:{
    initPositions(){
      this.getRequest('/system/basic/pos/').then(resp=>{
        if (resp){
          this.positions=resp
        }
      })
    },
    handleEdit(index,data){},
    handleDelete(index,data){
      this.$confirm('此操作将永久删除['+data.name+']职位, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('/system/basic/pos/'+data.id).then(resp=>{
          if(resp){
            this.initPositions()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    addPosition(){
      if(this.pos.name){
        this.postRequest('/system/basic/pos/',this.pos).then(resp=>{
          if(resp){
            this.initPositions()
            this.pos.name=''
          }
        })
      }else {
        this.$message.error('职位名称不为空')
      }
    }
  }
}
</script>

<style scoped>
  .addPosInput{
    width: 300px;
    margin-right: 10px;
  }
  .posManaMain{
    margin-top: 10px;
  }
</style>