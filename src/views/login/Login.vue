<template>
  <div id="login">
    <div class="login-box">
      <!-- 头像区域 -->
      <div class="login-logo">
        <img src="~assets/img/logo.png" alt="" />
      </div>

      <!-- 表单区域 -->
      <el-form ref="loginForm" class="login-form" :model="loginForm" :rules="loginFormRules">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input type="password" prefix-icon="iconfont icon-3702mima" v-model="loginForm.password"></el-input>
        </el-form-item>

        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetFields">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  name: "",
  props: {},
  components: {},
  data() {
    return {
      loginForm:{
        username:'admin',
        password:'123456'
      },
      loginFormRules:{
        // 定义用户名校验
        username:[
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        // 定义密码校验
        password:[
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    };
  },
  computed: {},
  watch: {},
  methods: {
    // 重置表单
    resetFields(){
      this.$refs.loginForm.resetFields();
    },
    // 登录按钮验证是否验证通过
    login(){
      this.$refs.loginForm.validate((state) => {
        // console.log(state);
        if(state == false){
          return ;
        }
        this.$api.login(this.loginForm).then(res => {
          console.log(res);
          if(res.data.meta.status !== 200){
            this.$message.error("登录失败");
          }else{
            this.$message.success("登录成功");
            // 将登录成功的token保存到客户端的sessionstorage中，因为token只应当在当前网页打开期间生效，所以讲token保存在sessionstorage合适。要注意的是，其他接口都是必须登录成功后才可以访问的
            window.sessionStorage.setItem("token",res.data.data.token);
            this.$router.push("/home");
          }
        })
      })
    }
  },
  created() {},
  mounted() {},
};
</script>
<style scoped lang="scss">
#login {
  position: relative;
  background-color: #2b4b6b;
  height: 100%;
}
.login-box {
  position: absolute;
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  .login-logo {
    position: absolute;
    width: 130px;
    height: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;

    img {
      width: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
  .login-form{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
  .btns{
    display: flex;
    justify-content: flex-end;
  }
}
</style>