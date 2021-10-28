<template>
  <div>
    <div style="display: flex;justify-content:space-between ">
      <div>
        <el-input
            prefix-icon="el-icon-search"
            style="width: 300px;margin-right: 10px;"
            placeholder="请输入员工名进行搜索..."
            v-model="empName"
            clearable
            @clear="initEmps"
            @keydown.enter.native="initEmps">
        </el-input>
        <el-button type="primary" icon="el-icon-search" @click="initEmps">搜索</el-button>
        <el-button type="primary">
          <i class="" aria-hidden="true"></i>
          高级搜索
        </el-button>
      </div>
      <div>
        <el-upload
            :before-upload="beforeUpdate"
            :headers="headers"
            style="display: inline-flex;margin-right: 8px;"
            :show-file-list="false"
            :on-success="onSuccess"
            :on-error="onError"
            :disabled="importDataDisabled"
            action="/employee/basic/import">
          <el-button :icon="importDataBtnIcon" type="success"  :disabled="importDataDisabled">
            {{ importDataBtnText }}
          </el-button>
        </el-upload>
        <el-button @click="exportDate" icon="el-icon-download" type="success">
          导出数据
        </el-button>
        <el-button type="primary" icon="el-icon-plus" @click="showAddEmpView">添加员工</el-button>
      </div>
    </div>
    <div style="margin-top: 10px;">
      <el-table
          v-loading="loading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          :data="emps"
          stripe
          border
          style="width: 100%">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
            prop="name"
            label="姓名"
            fixed
            align="left"
            width="90">
        </el-table-column>
        <el-table-column
            prop="workID"
            label="工号"
            align="left"
            width="85">
        </el-table-column>
        <el-table-column
            prop="gender"
            label="性别"
            align="left"
            width="50">
        </el-table-column>
        <el-table-column
            prop="birthday"
            label="出生日期"
            align="left"
            width="95">
        </el-table-column>
        <el-table-column
            prop="idCard"
            label="身份证号码"
            align="left"
            width="150">
        </el-table-column>
        <el-table-column
            prop="wedlock"
            label="婚姻状况"
            align="left"
            width="70">
        </el-table-column>
        <el-table-column
            prop="nation.name"
            label="民族"
            align="left"
            width="50">
        </el-table-column>
        <el-table-column
            prop="nativePlace"
            label="籍贯"
            align="left"
            width="80">
        </el-table-column>
        <el-table-column
            prop="politicsStatus.name"
            label="政治面貌"
            align="left"
            width="75">
        </el-table-column>
        <el-table-column
            prop="email"
            label="电子邮件"
            align="left"
            width="180">
        </el-table-column>
        <el-table-column
            prop="phone"
            label="电话号码"
            align="left"
            width="100">
        </el-table-column>
        <el-table-column
            prop="address"
            label="联系地址"
            align="left"
            width="270">
        </el-table-column>
        <el-table-column
            prop="department.name"
            label="所属部门"
            align="left"
            width="100">
        </el-table-column>
        <el-table-column
            prop="joblevel.name"
            label="职称"
            align="left"
            width="100">
        </el-table-column>
        <el-table-column
            prop="position.name"
            label="职位"
            align="left"
            width="100">
        </el-table-column>
        <el-table-column
            prop="position.name"
            label="职位"
            align="left"
            width="100">
        </el-table-column>
        <el-table-column
            prop="engageForm"
            label="聘用形式"
            align="left"
            width="100">
        </el-table-column>
        <el-table-column
            prop="tiptopDegree"
            label="最高学历"
            align="left"
            width="80">
        </el-table-column>
        <el-table-column
            prop="school"
            label="毕业院校"
            align="left"
            width="150">
        </el-table-column>
        <el-table-column
            prop="specialty"
            label="专业"
            align="left"
            width="150">
        </el-table-column>
        <el-table-column
            prop="workState"
            label="在职状态"
            align="left"
            width="70">
        </el-table-column>
        <el-table-column
            prop="beginDate"
            label="入职日期"
            align="left"
            width="95">
        </el-table-column>
        <el-table-column
            prop="conversionTime"
            label="转正日期"
            align="left"
            width="95">
        </el-table-column>
        <el-table-column
            prop="beginContract"
            label="合同起始日期"
            align="left"
            width="95">
        </el-table-column>
        <el-table-column
            prop="endContract"
            label="合同结束日期"
            align="left"
            width="95">
        </el-table-column>
        <el-table-column
            label="合同期限"
            align="left"
            width="100">
          <template slot-scope="scope">
            <el-tag>{{scope.row.contractTerm}}</el-tag>年
          </template>
        </el-table-column>
        <el-table-column
            label="操作"
            fixed
            width="200">
          <template slot-scope="scope">
            <el-button style="padding:3px" @click="showEditEmpView(scope.row)" size="mini">编辑</el-button>
            <el-button style="padding:3px" size="mini" type="primary">查看高级资料</el-button>
            <el-button @click="deleteEmp(scope.row)" style="padding:3px" size="mini" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="display: flex;justify-content: flex-end">
        <el-pagination
            background
            @current-change = "currentChange"
            @size-change="sizeChange"
            layout="sizes, prev, pager, next,jumper, -> total"
            :total="total">
        </el-pagination>
      </div>
    </div>
    <el-dialog
        title="title"
        :visible.sync="dialogVisible"
        width="80%">
      <div>
        <el-form ref="empForm" :model="emp" :rules="rules">
          <el-row>
            <el-col :span="6">
              <el-form-item label="姓名:" prop="name">
                <el-input style="width: 150px;" prefix-icon="el-icon-editor" v-model="emp.name" placeholder="请输入员工姓名..."></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="性别:" prop="gender">
                <el-radio-group v-model="emp.gender">
                  <el-radio label="男">男</el-radio>
                  <el-radio label="女">女</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="民族" prop="nationId">
                <el-select v-model="emp.nationId" size="mini" style="width: 150px;" placeholder="民族">
                  <el-option v-for="item in nations" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="政治面貌" prop="politicId">
                <el-select v-model="emp.politicId" size="mini" style="width: 200px;" placeholder="政治面貌">
                  <el-option v-for="item in politicsstatus" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="5">
              <el-form-item label="工号" prop="workID">
                <el-input v-model="emp.workID" placeholder="请输入工号" prefix-icon="el-icon-edit" disabled size="mini" style="width: 150px;">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="职位" prop="posId">
                <el-select v-model="emp.posId" size="mini" style="width: 150px;" placeholder="职位">
                  <el-option v-for="item in positions" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="职称" prop="jobLevelId">
                <el-select v-model="emp.jobLevelId" size="mini" style="width: 150px;" placeholder="职称">
                  <el-option v-for="item in joblevels" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="学历" prop="tiptopDegree">
                <el-select v-model="emp.tiptopDegree" size="mini" style="width: 150px;" placeholder="学历">
                  <el-option v-for="item in tiptopDegrees" :key="item" :label="item" :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="5">
              <el-form-item label="所属部门" prop="departmentId">
                <el-popover
                    placement="bottom"
                    title="请选择部门"
                    width="200"
                    trigger="manual"
                    v-model="visible">
                  <el-tree :data="allDeps"
                           default-expand-all
                           :props="defaultProps"
                           @node-click="handleNodeClick"></el-tree>
                  <div slot="reference"
                       @click="showDepView"
                       style="width: 150px; align-items:center; display: inline-flex;cursor:pointer; border-radius: 5px; border: 1px solid #dedede;height: 24px;">
                    {{inputDepName}}
                  </div>
                </el-popover>
              </el-form-item>
            </el-col>
            <el-col :span="6">
            </el-col>
            <el-col :span="6">
            </el-col>
            <el-col :span="7">
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doAddEmp">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "EmpBasic",
    data(){
      return {
        importDataDisabled:false,
        importDataBtnText:'导入数据',
        importDataBtnIcon:'el-icon-upload2',
        title:'',
        inputDepName:'',
        emps:[],
        loading:false,
        total:0,
        currentPage:1,
        size:10,
        empName:'',
        dialogVisible:false,
        headers:{
          Authorization : window.sessionStorage.getItem('tokenStr')
        },
        emp:{
          id:null,
          name:'',
          birthday:'',
          gender:'',
          idCard:'',
          wedlock:'',
          nationId:null,
          nativePlace:'',
          politicId:null,
          email:'',
          phone:'',
          address:'',
          departmentId:null,
          jobLevelId:null,
          posId:null,
          engageForm:'',
          tiptopDegree:'',
          specialty:'',
          school:'',
          beginDate:'',
          workState:'在职',
          workId:null,
          contractTerm:null,
          conversionTime:'',
          notWorkDate:null,
          beginContract:'',
          endContract:'',
          workAge:null,
          salaryId:null
        },
        nations:[],
        joblevels:[],
        politicsstatus:[],
        positions:[],
        tiptopDegrees:['博士','硕士','本科','大专','高中','初中','小学','其他'],
        visible:false,
        defaultProps:{
          children: 'children',
          label: 'name'
        },
        allDeps:[],
        rules:{
          name:[{required:true,message:'请输入员工姓名',trigger:'blur'}],
          gender:[{required:true,message:'请输入员工性别',trigger:'blur'}],
          departmentId:[{required:true,message:'请输入部门ID',trigger:'blur'}],
        },
      }
    },
    mounted() {
      this.initEmps()
      this.initData()
    },
    methods:{
      onSuccess(){
        this.importDataBtnText='导入数据'
        this.importDataBtnIcon='el-icon-upload2'
        this.initEmps()
        this.importDataDisabled = false
      },
      onError(){
        this.importDataBtnText='导入数据'
        this.importDataBtnIcon='el-icon-upload2'
        this.importDataDisabled = false
      },
      beforeUpdate(){
        this.importDataBtnIcon = 'el-icon-loading'
        this.importDataBtnText = '正在导入'
        this.importDataDisabled = true
      },
      showDepView(){
        this.visible = !this.visible
      },
      getMaxWorkID(){  //这个是会直接获取到最大的id 显示在框框那
        this.getRequest('/employee/basic/maxWorkID').then(resp=>{
          if(resp){
            this.emp.workId = resp.obj
          }
        })
      },
      showAddEmpView(){
        this.title = '添加数据'
        this.getMaxWorkID()
        this.emp={
            id:null,
            name:'',
            birthday:'',
            gender:'',
            idCard:'',
            wedlock:'',
            nationId:null,
            nativePlace:'',
            politicId:null,
            email:'',
            phone:'',
            address:'',
            departmentId:null,
            jobLevelId:null,
            posId:null,
            engageForm:'',
            tiptopDegree:'',
            specialty:'',
            school:'',
            beginDate:'',
            workState:'在职',
            workId:null,
            contractTerm:null,
            conversionTime:'',
            notWorkDate:null,
            beginContract:'',
            endContract:'',
            workAge:null,
            salaryId:null
        }
        this.inputDepName = ''
        this.initPositions()
        this.dialogVisible=true
      },
      initEmps(){
        this.loading = true
        this.getRequest('/employee/basic/?currentPage+'+this.currentPage+'&size='+this.size+'&name='+this.empName).then(resp=>{
          if(resp){
            this.emps = resp.data
            this.loading = false
            this.total = resp.total
          }
        })
      },
      currentChange(currentPage){
        this.page = currentPage
        this.initEmps()
      },
      sizeChange(size){
        this.size = size
        this.initEmps()
      },
      initData(){
        if(!window.sessionStorage.getItem('nations')){
          this.getRequest('/employee/basic/nations').then(resp=>{
            if(resp){
              this.nations = resp
              window.sessionStorage.setItem('nations',JSON.stringify(resp));
            }
          })
        }else {
          this.nations = JSON.parse(window.sessionStorage.getItem('nations'))
        }
        if(!window.sessionStorage.getItem('joblevels')){
          this.getRequest('/employee/basic/joblevels').then(resp=>{
            if(resp){
              this.joblevels = resp
              window.sessionStorage.setItem('joblevels',JSON.stringify(resp));
            }
          })
        }else {
          this.nations = JSON.parse(window.sessionStorage.getItem('joblevels'))
        }
        if(!window.sessionStorage.getItem('politicsstatus')){
          this.getRequest('/employee/basic/politicsstatus').then(resp=>{
            if(resp){
              this.politicsstatus = resp
              window.sessionStorage.setItem('politicsstatus',JSON.stringify(resp));
            }
          })
        }else {
          this.nations = JSON.parse(window.sessionStorage.getItem('politicsstatus'))
        }
        if(!window.sessionStorage.getItem('allDeps')){
          this.getRequest('/employee/basic/deps').then(resp=>{
            if(resp){
              this.allDeps = resp
              window.sessionStorage.setItem('allDeps',JSON.stringify(resp));
            }
          })
        }else {
          this.nations = JSON.parse(window.sessionStorage.getItem('allDeps'))
        }
      },
      initPositions() {
        this.getRequest('/employee/basic/positions').then(resp=>{
          if(resp){
            this.positions = resp
          }
        })
      },
      handleNodeClick(data){
        this.inputDepName = data.name
        this.emp.departmentId = data.id
        this.visible = !this.visible
      },
      doAddEmp(){
        // 添加是没有id的 修改是有id的
        if(this.emp.id){
          this.$refs['empForm'].validate(valid=>{
            if(valid){
              this.putRequest('/employee/basic/',this.emp).then(resp=>{
                if(resp){
                  this.dialogVisible = false;
                  this.initEmps()
                }
              })
            }
          })
        }else {
          this.$refs['empForm'].validate(valid=>{
            if(valid){
              this.postRequest('/employee/basic/',this.emp).then(resp=>{
                if(resp){
                  this.dialogVisible = false;
                  this.initEmps()
                }
              })
            }
          })
        }

      },
      deleteEmp(data){
        this.$confirm('此操作将永久删除'+data.name+'该员工, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteRequest('/employee/basic/'+data.id).then(resp=>{
            if(resp){
              this.initEmps()
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      showEditEmpView(data){
        this.title = '编辑员工信息'
        this.dialogVisible = true
        this.inputDepName = data.departmentId.name
        this.emp =data
        this.initPositions()
      },
      exportDate(){
        this.downloadRequest('/employee/basic/export')  //在这个函数里面其实是做了下载操作的 依靠js-file-download 下载 就这
      }
    }
  }
</script>

<style scoped>

</style>