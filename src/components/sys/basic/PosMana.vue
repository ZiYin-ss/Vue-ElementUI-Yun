<template>
  <div>
    <div>
      <el-input size="small" class="addPosInput" placeholder="添加职位..." @keyup.enter.native="addPosition" suffix-icon="el-icon-plus" v-model="pos.name">
      </el-input>
      <el-button size="small" icon="el-icon-plus" type="primary" @click="addPosition">添加</el-button>
    </div>
    <div class="posManaMain">
      <el-table size="small" :data="positions" style="width: 70%" stripe border @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="编号" width="55"></el-table-column>
        <el-table-column prop="name" label="职位" width="120"></el-table-column>
        <el-table-column prop="createDate" label="创建时间" width="200"></el-table-column>
        <el-table-column prop="enabled" label="是否启用" width="120"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="showEditView(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-button size="small" style="margin-top: 8px;" @click="deleteMany" :disabled="this.multipleSelection.length===0" type="danger">批量删除</el-button>
    <el-dialog title="编辑职位" :visible.sync="dialogVisible" width="30%">
      <div>
        <el-tag>职位名称</el-tag>
        <el-input v-model="updatePos.name" class="updatePosInput"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="doUpdate">确 定</el-button>
  </span>
    </el-dialog>
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
      positions:[],
      dialogVisible:false,
      updatePos:{
        name:''
      },
      multipleSelection:[]
    }
  },
  mounted() {
    this.initPositions()
  },
  methods:{
    deleteMany(){
      this.$confirm('此操作将永久删除['+this.multipleSelection.length+']条职位, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids ='?'
        this.multipleSelection.forEach(item=>{
          ids+='ids='+item.id+"&"
        })
        this.deleteRequest('/system/basic/pos/'+ids).then(resp=>{
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
    handleSelectionChange(val){
      // 多选框选中了是不是就有值了啊 数组形式 里面是一行行的数据
      this.multipleSelection=val

    },
    doUpdate(){
      this.putRequest('/system/basic/pos/',this.updatePos).then(resp=>{
        if (resp){
          this.initPositions()
          this.dialogVisible=false
        }
      })
    },
    initPositions(){
      this.getRequest('/system/basic/pos/').then(resp=>{
        if (resp){
          this.positions=resp
        }
      })
    },
    showEditView(index,data){
      Object.assign(this.updatePos,data)
      this.updatePos.createDate=''
      this.dialogVisible=true

    },
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
  .updatePosInput{
    width: 200px;
    margin-left: 10px;
  }
</style>