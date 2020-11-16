<template>
  <div>
    <breadcrumb :title="title"></breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRolesDialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <el-table :data="rolesList" border stripe>
        <!-- 展开项 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="(item, index) in scope.row.children"
              :key="item.id"
              :class="{ bdbottom: true, bdtop: index === 0, fcenter: true }"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightsById(scope.row, item.id)"
                  >{{ item.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级权限和三级权限 -->
              <el-col :span="19">
                <!-- 通过for循环渲染二级权限 -->
                <el-row
                  v-for="(item2, index2) in item.children"
                  :key="item2.id"
                  :class="{ bdtop: index2 !== 0, fcenter: true }"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightsById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <!-- 由于三级权限只在一行里，所以这里不需要再row了 -->
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightsById(scope.row, item3.id)"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引项 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="showEditRolesDialog(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-search"
              size="mini"
              @click="deleteRole(scope.row.id)"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-search"
              size="mini"
              @click="showSetRightsDialog(scope.row)"
              @close="clearCheckedRights"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRolesDialogVisible"
      width="50%"
      @close="addRolesClose"
    >
      <el-form
        :model="addRoles"
        :rules="addRolesRules"
        ref="addRoles"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoles.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoles.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addNewRoles">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑用户对话框 -->
    <el-dialog
      title="编辑提交角色"
      :visible.sync="editRolesDialogVisible"
      width="50%"
      @close="editRolesClose"
    >
      <el-form
        :model="editRoles"
        :rules="addRolesRules"
        ref="editRoles"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoles.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoles.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRolesInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightsDialogVisible"
      width="50%"
    >
      <!-- 树节点 -->
      <el-tree
        :data="setRightsList"
        :props="treeprops"
        show-checkbox
        default-expand-all
        node-key="id"
        :default-checked-keys="checkedRights"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="alloRoleRights"
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
    return {
      title: ["权限管理", "角色列表"],
      rolesList: [],
      // 对话框是否显示-----------------
      addRolesDialogVisible: false,
      editRolesDialogVisible: false,
      setRightsDialogVisible: false,
      // -----------------------------
      // 添加角色
      addRoles: {
        roleName: "",
        roleDesc: "",
      },
      // 编辑角色
      editRoles: {},
      // 获取分配权限列表
      setRightsList: [],
      // 获取要分配权限的角色id
      roleid: '',

      // 定义树形结构属性绑定对象
      treeprops: {
        label: "authName",
        children: "children",
      },
      // 默认选中的节点
      checkedRights:[],


      // 添加角色校验规则
      addRolesRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur",
          },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
          {
            min: 4,
            max: 15,
            message: "长度在 4 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {},
  watch: {},
  methods: {
    getRolesList() {
      this.$api.getRolesList().then((res) => {
        // console.log(res);
        if (res.data.meta.status !== 200) {
          return this.$message.error("获取角色列表失败");
        }
        this.rolesList = res.data.data;
        // console.log(this.rolesList);
      });
    },
    // 对话框关闭事件，重置表单
    addRolesClose() {
      this.$refs.addRoles.resetFields();
    },
    editRolesClose() {
      this.$refs.editRoles.resetFields();
    },
    // 新建角色
    addNewRoles() {
      this.$refs.addRoles.validate((val) => {
        // 判断是否检验正确
        if (val == false) return;
        // 校验成功后在进行网络请求
        this.$api.addRoles(this.addRoles).then((res) => {
          console.log(res);
          if (res.data.meta.status !== 201) {
            return this.$message.error("创建角色失败");
          }
          this.$message.success("创建角色成功");
          this.addRolesDialogVisible = false;
          this.getRolesList();
        });
      });
    },
    // 点击显示编辑对话框
    showEditRolesDialog(id) {
      this.editRolesDialogVisible = true;
      this.$api.getRolesById(id).then((res) => {
        // console.log(res);
        this.editRoles = res.data.data;
      });
    },
    // 修改角色信息
    editRolesInfo() {
      this.$refs.editRoles.validate((val) => {
        if (val == false) return;
        this.$api.editRolesInfo(this.editRoles).then((res) => {
          console.log(res);
          if (res.data.meta.status !== 200) {
            return this.$message.error("编辑角色信息失败");
          } else {
            this.$message.success("修改角色信息成功");
            this.editRolesDialogVisible = false;
            this.getRolesList();
          }
        });
      });
    },
    // 删除角色
    deleteRole(id) {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "删除角色", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(
        (res) => {
          // console.log(res);
          this.$api.deleteRole(id).then((res) => {
            console.log(res);
            if (res.data.meta.status !== 200) {
              return this.$message.error("删除角色失败");
            } else {
              this.$message.success("删除角色成功");
              this.getRolesList();
            }
          });
        },
        (err) => {
          // console.log(err);
          this.$message.info("已取消删除");
        }
      );
    },
    // 移除权限
    removeRightsById(role, rightId) {
      this.$confirm("此操作将永久删除该权限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(
        (res) => {
          console.log("确认删除");
          this.$api.removeRightsById(role.id, rightId).then((res) => {
            console.log(res);
            if (res.data.meta.status !== 200) {
              return this.$message.error("移除权限失败");
            }
            this.$message.success("移除角色成功");
            // this.getRolesList();
            // 这里如果重新请求角色数据的话，展开会关闭，我们可以直接改变值，由于数据绑定是双向的
            role.children = res.data.data;
          });
        },
        (error) => {
          this.$message.info("取消移除");
        }
      );
    },
    // 分配权限
    showSetRightsDialog(role) {
      this.roleid = role.id;
      this.$api.getRightsListByTree().then((res) => {
        if (res.data.meta.status !== 200) {
          return this.$message.error("获取权限列表失败");
        }
        // this.$message.success("获取权限列表成功");
        console.log(res);
        this.setRightsList = res.data.data;
        this.getThreeRights(role,this.checkedRights);
        this.setRightsDialogVisible = true;
      });
    },

    // 用一个方法将角色三级权限的id放到checkedRights数组里面
    getThreeRights(node,arr){
      if(!node.children){
        return arr.push(node.id);
      }
      node.children.forEach(item => {
        this.getThreeRights(item,arr);
      });
    },
    // 关闭分配权限对话框需要清空选中的数组，不然点其他的会叠加
    clearCheckedRights(){
      this.checkedRights = [];
    },
    // 给角色分配权限
    alloRoleRights(){
      // 将所有被选中的半选中和选中状态的节点放入数组里面
      const checkedRights = [...this.$refs.treeRef.getCheckedKeys(),...this.$refs.treeRef.getHalfCheckedKeys()];
      this.$api.alloRoleRights(this.roleid,checkedRights).then(res => {
        console.log(res);
        if(res.data.meta.status !== 200){
          return this.$message.error("分配权限失败");
        }
        this.$message.success("分配权限成功");
        this.getRolesList();
        this.setRightsDialogVisible = false;
      })
      // console.log(checkedRights);
    },
  },
  created() {
    this.getRolesList();
  },
  mounted() {},
};
</script>
<style scoped>
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.el-tag {
  margin: 7px;
}
.fcenter {
  display: flex;
  align-items: center;
}
</style>