import axios from 'axios'
import { useUserStore } from '@/stores/userStore'
import { ElMessage } from 'element-plus'

const baseURL = 'http://192.168.230.4:8080'

const request = axios.create({
  baseURL,
  timeout: 100000
})

request.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = userStore.token
    }
    return config
  },
  (err) => Promise.reject(err)
)

request.interceptors.response.use(
  (res) => {
    if (res.data.code === 1) {
      return res
    }
    ElMessage({ message: res.data.msg || '服务异常', type: 'error' })
    return Promise.reject(res.data)
  },
  (err) => {
    ElMessage({
      message: err.response.data.msg || '服务异常',
      type: 'error'
    })
    return Promise.reject(err)
  }
)

export default request
