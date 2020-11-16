import Vue from "vue"
import VueRouter from "vue-router"

const Login = () => import("views/login/Login")
const Home = () => import("views/home/Home")
const Welcome = () => import("views/home/homechild/Welcome")
const Users = () => import("views/home/homechild/users/Users")
const Rights = () => import("views/home/homechild/power/Rights")
const Roles = () => import("views/home/homechild/power/Roles")
Vue.use(VueRouter)

const routes = [
  {
    path:'',
    redirect:'/login'
  },
  {
    path:'/login',
    component:Login
  },
  {
    path:'/home',
    component:Home,
    redirect:'/welcome',
    children:[
      {
        path:'/welcome',
        component:Welcome
      },
      {
        path:'/users',
        component:Users
      },
      {
        path:'/rights',
        component:Rights
      },
      {
        path:'/roles',
        component:Roles
      }
    ]
  }
]
const router =  new VueRouter({
  routes,
  mode:'history'
})

// 判断页面是否存在token，不存在需要返回登录页
router.beforeEach((to,from,next) => {
  if(to.path == "/login"){
    return next();
  }
  // 获取token的值
  const tokenstr = window.sessionStorage.getItem("token");
  // 如果token不存在，则强制跳转到登录
  if(!tokenstr){
    return next("/login");
  }else{
    next();
  }
})

export default router