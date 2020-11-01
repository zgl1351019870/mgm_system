<template>
  <div>
    <el-button type="info" @click="logout">退出登录</el-button>
  </div>
</template>
<script>
export default {
  name: '',
  props: {},
  components: {},
  data() {
    return {};
  },
  computed: {},
  watch: {},
  methods: {
    logout(){
      window.sessionStorage.clear();
      this.$router.push('/login');
    }
  },
  created() {},
  mounted() {},
}
</script>
<style scoped>
</style>