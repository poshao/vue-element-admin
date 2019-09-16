import { login, logout, getInfo } from '@/api/user'
import {
  register,
  getUserAvator,
  getUserInfo,
  updateUserInfo,
  uploadAvator,
  changePassword
} from '@/api/auth'
import { getToken, setToken, removeToken, getWorkid, setWorkid, removeWorkid } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  workid: '',
  name: '',
  email: '',
  phone: '',
  depart: '',
  avatar: '',
  introduction: '',
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_WORKID: (state, workid) => {
    state.workid = workid
  },
  SET_EMAIL: (state, email) => {
    state.email = email
  },
  SET_DEPART: (state, depart) => {
    state.depart = depart
  },
  SET_PHONE: (state, phone) => {
    state.phone = phone
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_WORKID', username)
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        setWorkid(username)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(getWorkid()).then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { username, introduction, workid, email, phone, depart } = data.userinfo
        const roles = ['admin']
        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }

        commit('SET_ROLES', roles)
        commit('SET_NAME', username)
        commit('SET_AVATAR', getUserAvator(workid)) // avatar)
        commit('SET_INTRODUCTION', introduction)

        commit('SET_WORKID', workid)
        commit('SET_EMAIL', email)
        commit('SET_PHONE', phone)
        commit('SET_DEPART', depart)
        data.roles = roles
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        removeWorkid()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      removeWorkid()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  },

  // 注册
  handleRegister({
    commit
  }, {
    workid,
    password
  }) {
    return new Promise((resolve, reject) => {
      register({
        workid,
        password
      }).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },

  // 登录
  handleLogin({
    commit
  }, {
    workid,
    password
  }) {
    // console.log(workid + '123')
    return new Promise((resolve, reject) => {
      login({
        workid,
        password
      }).then(res => {
        commit('setWorkid', workid)
        commit('setToken', res.data.token)
        localStorage.setItem('workid', workid)
        localStorage.setItem('token', res.data.token)
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 退出登录
  handleLogout({
    state,
    commit
  }) {
    return new Promise((resolve, reject) => {
      logout(localStorage.getItem('token')).then(() => {
        commit('setToken', '')
        localStorage.removeItem('workid')
        localStorage.removeItem('token')
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  },
  changePassword({
    commit
  }, {
    oldPassword,
    newPassword
  }) {
    return new Promise((resolve, reject) => {
      changePassword(oldPassword, newPassword).then(res => {
        commit('setToken', '')
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 获取用户信息
  getUserInfo({
    state,
    commit
  }) {
    return new Promise((resolve, reject) => {
      getUserInfo(state.workid).then(res => {
        const data = res.data.userinfo
        commit('SET_NAME', data.username)
        commit('SET_DEPART', data.depart)
        commit('SET_AVATAR', getUserAvator(state.workid))
        commit('SET_EMAIL', data.email)
        commit('SET_PHONE', data.phone)
        resolve(data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  /**
   * 更新用户资料
   */
  handleUpdateUserInfo({
    commit
  }, {
    userinfo
  }) {
    return new Promise((resolve, reject) => {
      updateUserInfo({
        'username': userinfo.username,
        'depart': userinfo.depart,
        'email': userinfo.email,
        'phone': userinfo.phone
      }).then(res => {
        // const data = res.data
        console.log('update user: ' + userinfo.username)
        commit('SET_NAME', userinfo.username)
        commit('SET_DEPART', userinfo.depart)
        commit('SET_EMAIL', userinfo.email)
        commit('SET_PHONE', userinfo.phone)
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  },
  handleUploadAvator({
    state,
    commit
  }, avator) {
    return new Promise((resolve, reject) => {
      uploadAvator(avator).then(res => {
        const data = res.data
        commit('setAvator', getUserAvator(state.workid))
        resolve(data)
      }).catch(err => {
        reject(err)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
