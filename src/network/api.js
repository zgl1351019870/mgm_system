import {request} from "./request"

export function login(arg){
  return request({
    url:"/login",
    params:{
      username:arg.username,
      password:arg.password
    },
    method:'post'
  })
  // return request.post('/login', arg);
}
