import axios from "axios"

export function request(config){
  const instance = axios.create({
    baseURL:"https://www.liulongbin.top:8888/api/private/v1/",
    timeout:10000
  })
  // 因为这个接口需要授权的 API ，必须在请求头中使用 `Authorization` 字段提供 `token` 令牌
  // 为每次网络请求都进行一次拦截，看看有没有token
  instance.interceptors.request.use(config => {
    // console.log(config);
    config.headers.Authorization = window.sessionStorage.getItem('token');
    return config;
  })
  return instance(config);
}