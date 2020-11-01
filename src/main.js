import Vue from 'vue'
import App from './App'
import router from "./router/index"

// 导入字体图标
import "assets/img/font/iconfont.css"


// element-ui的css文件需要引入的
import 'element-ui/lib/theme-chalk/index.css';
// 按需引入组件
import { Button, Form, FormItem, Input, Message} from "element-ui"

// 导入接口api
import * as api from "network/api.js"

Vue.config.productionTip = false
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
/* eslint-disable no-new */
Vue.prototype.$api = api;
Vue.prototype.$message = Message;
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
