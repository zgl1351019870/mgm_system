<template>
  <div>
    <breadcrumb :title="title"></breadcrumb>
    <el-card>
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
import Breadcrumb from "components/breadcrumb/Breadcrumb"
export default {
  name: '',
  props: {},
  components: {
    Breadcrumb
  },
  data() {
    return {
      title:['权限管理','权限列表'],
      rightsList:[]
    };
  },
  computed: {},
  watch: {},
  methods: {
    // 网络请求相关
    getRightsList(){
      this.$api.getRightsList().then(res => {
        console.log(res);
        if(res.data.meta.status !== 200){
          return this.$message.error("获取用户列表失败");
        }

        this.rightsList = res.data.data;
      })
    }
  },
  created() {
    this.getRightsList();
  },
  mounted() {},
}
</script>
<style scoped>
</style>