<template>
  <div>
    <el-table :data="emps" border stripe>
      <el-table-column type="selection" align="left" width="55">
      </el-table-column>
      <el-table-column prop="name" label="姓名" align="left" fixed width="120">
      </el-table-column>
      <el-table-column prop="workID" label="工号" align="left" width="120">
      </el-table-column>

    </el-table>
  </div>
</template>

<script>
export default {
  name: "SalSobCfg"
}
</script>

<style scoped>

</style>