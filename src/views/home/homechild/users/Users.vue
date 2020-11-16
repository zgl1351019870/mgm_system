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
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 表格 -->
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
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteUserById(scope.row.id)"
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
                @click="setRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
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
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClose"
    >
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
          <el-input v-model="addUser.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUser.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addUser.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addNewUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑用户对话框 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClose"
    >
      <el-form
        :model="editUser"
        :rules="addUserRules"
        ref="editUser"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editUser.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUser.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editUser.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色的对话框 -->
    <el-dialog title="分配角色" :visible.sync="alloRoleVisible" width="50%" @close="setDialogClose">
      <p>当前的用户: {{ userinfo.username }}</p>
      <p>当前的角色: {{ userinfo.role_name }}</p>
      <p>
        分配新角色:
        <el-select v-model="checkedId" placeholder="请选择">
          <el-option
            v-for="item in rolesList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </p>

      <span slot="footer" class="dialog-footer">
        <el-button @click="alloRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="alloUserRole"
          >确 定</el-button
        >
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
    // 验证手机号的正则表达式
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[8-9])[0-9]{8}$/;
      if (regMobile.test(value)) {
        return callback();
      } else {
        callback("请输入正确的手机号");
      }
    };
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
      addDialogVisible: false,
      editDialogVisible: false,
      alloRoleVisible: false,
      editUser: {},
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
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      // 分配角色需要展示的用户信息
      userinfo: {},
      // 角色列表
      rolesList: [],
      // 选中的角色的id
      checkedId: '',
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
    // 关闭对话框，重置表单
    addDialogClose() {
      this.$refs.addUser.resetFields();
    },
    editDialogClose() {
      this.$refs.editUser.resetFields();
    },
    setDialogClose(){
      this.checkedId = '';
      this.userinfo = {};
    },

    // 网络请求相关

    // 修改用户状态
    userStateChange(userinfo) {
      // console.log(userinfo);
      this.$api.changeUserState(userinfo.id, userinfo.mg_state).then((res) => {
        if (res.data.meta.status !== 200) {
          userinfo.mg_state = !userinfo.mg_state;
          return this.$message.error("修改用户状态失败");
        }
        this.$message.success("修改用户状态成功");
      });
    },
    // 获取用户列表
    getUserList() {
      this.$api.getUserList(this.queryInfo).then((res) => {
        if (res.data.meta.status !== 200) {
          return this.$message.error("获取用户列表失败");
        }
        this.userList = res.data.data.users;
        this.total = res.data.data.total;
        console.log(res);
      });
    },
    // 添加新用户
    addNewUser() {
      this.$refs.addUser.validate((val) => {
        // val检验成功为true，反之为false
        // 如果校验失败，则返回
        if (val === false) return;

        // 检验成功，发起网络请求添加用户
        this.$api.addNewUser(this.addUser).then((res) => {
          console.log(res);
          if (res.data.meta.status !== 201) {
            return this.$message.error(
              "创建用户失败" + " 错误码为：" + res.data.meta.status
            );
          } else {
            this.$message.success("创建用户成功");
            // 隐藏对话框
            this.addDialogVisible = false;
            // 重新请求数据
            this.getUserList();
          }
        });
      });
    },
    // 展示编辑用户信息
    showEditDialog(id) {
      this.editDialogVisible = true;
      // console.log(id);
      this.$api.queryUserInfo(id).then((res) => {
        console.log(res);
        this.editUser = res.data.data;
      });
    },
    // 编辑用户信息
    editUserInfo() {
      this.$refs.editUser.validate((val) => {
        if (val == false) return;
        this.$api.editUserInfo(this.editUser).then((res) => {
          console.log(res);
          if (res.data.meta.status !== 200) {
            return this.$message.error("编辑用户信息失败");
          } else {
            this.$message.success("修改用户信息成功");
            this.editDialogVisible = false;
            this.getUserList();
          }
        });
      });
    },
    // 删除用户
    deleteUserById(id) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "删除用户", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(
        (res) => {
          // console.log(res);
          this.$api.deleteUserById(id).then((res) => {
            console.log(res);
            if (res.data.meta.status !== 200) {
              return this.$message.error(res.data.meta.msg);
            } else {
              this.$message.success("删除用户成功");
              this.getUserList();
            }
          });
        },
        (err) => {
          // console.log(err);
          this.$message.info("已取消删除");
        }
      );
    },
    // 分配角色
    setRole(userinfo) {
      this.userinfo = userinfo;
      // console.log(this.userinfo);
      // 在对话框弹出来前，先获取角色列表
      this.$api.getRolesList().then((res) => {
        if (res.data.meta.status !== 200) {
          return this.$message.error("获取角色列表失败");
        }
        this.rolesList = res.data.data;
        // console.log(res);
      });
      this.alloRoleVisible = true;
    },
    // 点击确认为用户添加角色
    alloUserRole(){
      this.$api.alloUserRole(this.userinfo.id,this.checkedId).then(res => {
        console.log(res);
        if(res.data.meta.status !== 200){
          return this.$message.error(res.data.meta.msg);
        }
        this.$message.success("用户添加角色成功");
        this.getUserList();
        this.alloRoleVisible = false;
      })
    }
  },
  created() {
    this.getUserList();
  },
  mounted() {},
};
</script>
<style scoped>
</style>