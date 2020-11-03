<template>
  <div>
    <!-- 面包屑 -->
    <breadcrumb :title="title"></breadcrumb>

    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 栅格布局 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>

      <el-table :data="userList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <!-- 这里要是用作用域插槽的概念去获取 状态值，table-column这个组件提供了一些作用域插槽比如row,column,$index供我们访问，这里我们需要获取row的mg_state来获取状态值，
            如果我们直接在这里开关这个组件使用userList.mg_state来绑定这样是会有问题的
            {{scope.row}} -->
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="190px">
          <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
          ></el-button>
          <el-tooltip
            effect="dark"
            content="分配角色"
            placement="top"
            :enterable="false"
          >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
            ></el-button>
          </el-tooltip>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%">
      <el-form
        :model="addUser"
        :rules="addUserRules"
        ref="addUser"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUser.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUser.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUser.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addUser.mobile"></el-input>
        </el-form-item>
      </el-form>


      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Breadcrumb from "components/breadcrumb/Breadcrumb";
export default {
  name: "",
  props: {},
  components: {
    Breadcrumb,
  },
  data() {
    return {
      title: ["用户管理", "用户列表"],
      queryInfo: {
        // 查询
        query: "",
        // 当前页
        pagenum: 1,
        // 每页显示的数据
        pagesize: 2,
      },
      userList: [],
      total: 0,
      dialogVisible: false,
      addUser: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      addUserRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
        ],
      },
    };
  },
  computed: {},
  watch: {},
  methods: {
    // 事件处理相关
    // 处理页码大小
    handleSizeChange(newSize) {
      // console.log(newSize);
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    // 当前页变动时触发
    handleCurrentChange(newPage) {
      // console.log(newPage);
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    // 修改用户状态
    userStateChange(userinfo) {
      // console.log(userinfo);
      this.$api.changeUserState(userinfo.id, userinfo.mg_state).then((res) => {
        if (res.status !== 200) {
          userinfo.mg_state = !userinfo.mg_state;
          return this.$message.error("修改用户状态失败");
        }
        this.$message.success("修改用户状态成功");
      });
    },
    // 网络请求相关
    getUserList() {
      this.$api.getUserList(this.queryInfo).then((res) => {
        if (res.status !== 200) {
          return this.$message.error("获取用户列表失败");
        }
        this.userList = res.data.data.users;
        this.total = res.data.data.total;
        // console.log(res);
      });
    },
  },
  created() {
    this.getUserList();
  },
  mounted() {},
};
</script>
<style scoped>
</style>