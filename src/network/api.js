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
    // params:{
    //   uid,
    //   type
    // },
    method:'put'
  })
}

// 新增用户
export function addNewUser(arg){
  return request({
    url:"/users",
    params:{
      username : arg.username,
      password : arg.password,
      email : arg.email,
      mobile : arg.mobile
    },
    method:'post'
  })
}

// 根据id查询用户id
export function queryUserInfo(id){
  return request({
    url:"/users/"+id,
    // params:{
    //   id
    // }
  })
}

// 编辑用户信息
export function editUserInfo(arg){
  return request({
    url:"/users/"+arg.id,
    params:{
      email : arg.email,
      mobile : arg.mobile
    },
    method: 'put'
  })
}

export function deleteUserById(id){
  return request({
    url:"/users/" + id,
    method:'delete'
  })
}


