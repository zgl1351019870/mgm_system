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

// 删除用户
export function deleteUserById(id){
  return request({
    url:"/users/" + id,
    method:'delete'
  })
}

// 为用户分配角色
export function alloUserRole(id,rid){
  return request({
    url:"/users/" + id + "/role",
    method:'put',
    params:{
      rid
    }
  })
}


// 获取所有权限列表（列表形式）
export function getRightsList(){
  return request({
    url:"/rights/list"
  })
}
export function getRightsListByTree(){
  return request({
    url:"/rights/tree"
  })
}

// 获取角色列表
export function getRolesList(){
  return request({
    url:"/roles"
  })
}

//新建角色
export function addRoles(arg){
  return request({
    url:"/roles",
    params:{
      roleName : arg.roleName,
      roleDesc : arg.roleDesc
    },
    method:'post'

  })
}

// 根据id查询角色
export function getRolesById(id){
  return request({
    url:"/roles/" + id
  })
}

// 根据id编辑角色
export function editRolesInfo(arg){
  return request({
    url:"/roles/" + arg.roleId,
    params:{
      roleName : arg.roleName,
      roleDesc : arg.roleDesc
    },
    methods:'put'
  })
}

// 根据id删除角色
export function deleteRole(id){
  return request({
    url:"/roles/" + id,
    method:'delete'
  })
}

// 删除角色指定权限
export function removeRightsById(roleId,rightId){
  return request({
    url:"/roles/" + roleId + "/rights/" + rightId,
    method:'delete'
  })
}

// 为角色分配权限
export function alloRoleRights(id,rids){
  return request({
    url:"/roles/" + id + "/rights",
    method:'post',
    params:{
      rids
    }
  })
}


