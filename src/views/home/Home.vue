<template>
  <div id="home">
    <el-container>
      <!-- 头部区域 -->
      <el-header>
        <div>
          <img src="~assets/img/logo.png" alt="" />
          <span>后台管理系统</span>
        </div>
        <el-button type="info" @click="logout">退出登录</el-button>
      </el-header>
      <!-- 内容区域 -->
      <el-container>
        <!-- 侧边栏区域 -->
        <el-aside :width="isCollapse ? '64px' : '200px'">
          <div class="toggle-button" @click="toggleClick">|||</div>
          <!-- unique-opened保持一个子菜单展开 -->
          <!-- collapse是否水平折叠菜单， collapse-transition是否开启折叠动画-->
          <el-menu
            background-color="#333744"
            text-color="#fff"
            active-text-color="#409eff"
            unique-opened
            :collapse="isCollapse"
            :collapse-transition="false"
            router
            :default-active="$route.path"
          >
            <!-- 一级菜单 -->
            <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
              <template slot="title">
                <i :class="iconObj[item.id]"></i>
                <span>{{item.authName}}</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item :index="'/' + subItem.path + ''" v-for="subItem in item.children" :key="subItem.id">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>{{subItem.authName}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
export default {
  name: "",
  props: {},
  components: {},
  data() {
    return {
      // 左侧菜单数据
      menuList: [],
      iconObj:{
        '125':'iconfont icon-users',
        '103':'iconfont icon-tijikongjian',
        '101':'iconfont icon-shangpin',
        '102':'iconfont icon-danju',
        '145':'iconfont icon-baobiao'
      },
      isCollapse:false
    };
  },
  computed: {},
  watch: {},
  methods: {
    // 退出登录
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    // 点击折叠左侧菜单
    toggleClick(){
      this.isCollapse = ! this.isCollapse;
    },
    // 获取左侧菜单数据
    getMenuList() {
      this.$api.getMenuList().then((res) => {
        // console.log(res);
        if (res.status !== 200) {
          return this.$message.error("获取列表失败");
        }
        this.menuList = res.data.data;
      });
    },
  },
  created() {
    this.getMenuList();
  },
  mounted() {},
};
</script>
<style scoped lang="scss">
.el-container {
  height: 100vh;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    img {
      width: 50px;
      height: 50px;
    }
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu{
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.iconfont{
  margin-right: 10px;
}
.toggle-button{
  background-color: #4a5064;
  letter-spacing: 0.2em;
  text-align: center;
  color: #fff;
  cursor: pointer;
  font-size: 10px;
  line-height: 24px;
}
</style>