import * as axios from "axios";
import { BASE_URL, MOCK_URL } from '../config/index'
import { Toast } from "vant";
import { isMock, local } from ".";

const require = axios.create({
  baseURL: isMock ? MOCK_URL : BASE_URL,
  timeout: 5000
})

require.interceptors.request.use(
  config => {
    const token = local.get('user')?.token || ''
    if(token) {
      config.headers.token = token
    }
    return config
  }
)

require.interceptors.response.use(
  response => {
    const {success, result, msg} = response.data
    if(response.status === 401) {
      Toast('请先登录')
      return Promise.reject(msg)
    }
    if(response.status !== 200) return Promise.reject('请求错误')
    if(!success) return Promise.reject(msg)
    return Promise.resolve(result)
  },
  error => Toast('服务器连接不上，怀疑您的网络开了小差')
)

export default require
