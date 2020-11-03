import Vue from 'vue'
import App from './App'
import router from "./router/index"

// 导入字体图标
import "assets/img/fonts/iconfont.css"


// element-ui的css文件需要引入的
import 'element-ui/lib/theme-chalk/index.css';
// 按需引入组件
import {
  Button, 
  Form, 
  FormItem, 
  Input, 
  Message, 
  Container, 
  Header, 
  Aside, 
  Main,
  Menu,
  Submenu,
  MenuItem,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Row,
  Col,
  Table,
  TableColumn,
  Switch,
  Tooltip,
  Pagination,
  Dialog

} from "element-ui"

// 导入接口api
import * as api from "network/api.js"

Vue.config.productionTip = false
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
/* eslint-disable no-new */
Vue.prototype.$api = api;
Vue.prototype.$message = Message;
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
