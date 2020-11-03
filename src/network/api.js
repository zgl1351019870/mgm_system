import { request } from "./request"

// 获取登录信息
export function login(arg) {
  return request({
    url: "/login",
    params: {
      username: arg.username,
      password: arg.password
    },
    method: 'post'
  })
  // return request.post('/login', arg);
}

// 获取菜单栏信息
export function getMenuList() {
  return request({
    url: "/menus"
  })
}

// 获取用户列表
export function getUserList(arg) {
  return request({
    url: "/users",
    params: {
      query : arg.query,
      pagenum : arg.pagenum,
      pagesize : arg.pagesize
    }
  })
}

// 修改用户状态
export function changeUserState(uid,type){
  return request({
    url:"/users/"+uid +"/state/"+ type,
    params:{
      uid,
      type
    },
    method:'put'
  })
}


