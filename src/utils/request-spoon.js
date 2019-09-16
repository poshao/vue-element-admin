import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

import relogin from '@/views/login/relogin'

import router from '@/router'

// import Vue from 'vue'

const instance = axios.create({
  baseURL: process.env.VUE_APP_IS_API
})

// 设置拦截器
instance.interceptors.request.use(config => {
  // 添加头部验证
  if (store.getters.token) {
    config.headers['xtoken'] = getToken()
  }
  config.headers['XDEBUG_SESSION'] = 'xdebug'
  return config
}, (error) => {
  console.log(error) // for debug
  return Promise.reject(error)
})

instance.interceptors.response.use((data) => {
  return Promise.resolve(data)
}, error => {
  console.log('err' + error) // for debug
  if (error.response.status === 401 && router.currentRoute.path !== '/login') {
    var h = router.app.$createElement
    var login = {
      username: '',
      password: ''
    }
    MessageBox.confirm('', {
      title: '重新登陆',
      closeOnClickModal: false,
      message: h(relogin, {
        props: {
          username: login.username,
          password: login.password
        },
        on: {
          input(v) {
            login = v
          }
        }
      }),
      confirmButtonText: '登陆',
      cancelButtonText: '取消',
      callback: (action, instance) => {
        if (action === 'confirm') {
          store.dispatch('user/login', login)
        }
      }
    })
  } else {
    Message({
      // message: error.message,
      message: error.response.data.error.message,
      type: 'error',
      duration: 5 * 1000
    })
  }
  return Promise.reject(error)
})
export default instance
