import {
  newRequest,
  listRequest,
  updateStatus,
  addFile,
  uploadFileUrl,
  getUploadedFileByName
} from '@/api/linkcs.js'
// import {
//   updateSocketId
// } from '../../api/auth.js'

// import config from '../../config/index.js'

import requestStruct from './linkcs_request_struct.js'

export default {
  state: {
    requestDetail: {},
    requestList: [],
    chat: null,
    chat_list: '',
    /**
     * 通知组件
     */
    socket: null,
    socketid: ''
  },
  mutations: {
    setRequestDetail(state, requestDetail) {
      state.requestDetail = requestDetail
    },
    setRequestList(state, requestList) {
      state.requestList = requestList
    }
  },
  actions: {
    handleNewRequest({
      commit
    }, requestDetail) {
      return new Promise((resolve, reject) => {
        newRequest(requestDetail).then(() => {
          commit('setRequestDetail', requestDetail)
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },
    handleListRequest({
      commit
    }) {
      return new Promise((resolve, reject) => {
        listRequest().then(res => {
          const data = res.data
          commit('setRequestList', data.list)
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    /**
     * 处理撤销订单
     */
    handleRevokeOrder({ commit }, orderid) {
      return new Promise((resolve, reject) => {
        updateStatus({
          'orderid': orderid,
          'status': 'pre_send'
        }).then(res => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    /**
     * 处理受理订单
     */
    handleAcceptOrder({
      commit
    }, orderid) {
      return new Promise((resolve, reject) => {
        updateStatus({
          'orderid': orderid,
          'status': 'pass'
        }).then(res => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    /**
     * 处理拒绝订单
     */
    handleRejectOrder({
      commit
    }, {
      orderid,
      reason
    }) {
      return new Promise((resolve, reject) => {
        updateStatus({
          'orderid': orderid,
          'status': 'reject',
          'reason': reason
        }).then(res => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    /**
     * 处理取消订单
     */
    handleCancelOrder({ commit }, orderid) {
      return new Promise((resolve, reject) => {
        updateStatus({
          'orderid': orderid,
          'status': 'cancel'
        }).then(res => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    /**
     * 处理锁定订单
     */
    handleLockOrder({ commit }, orderid) {
      return new Promise((resolve, reject) => {
        updateStatus({
          'orderid': orderid,
          'status': 'lock'
        }).then(res => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    /**
     * 处理完成订单
     */
    handleFinishOrder({ commit }, orderid) {
      return new Promise((resolve, reject) => {
        updateStatus({
          'orderid': orderid,
          'status': 'finish'
        }).then(res => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    /**
     * 处理添加附件
     */
    handleAddFile({
      commit
    }, file) {
      return new Promise((resolve, reject) => {
        addFile(file).then(res => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    handleGetFile({
      commit
    }, filename) {
      return new Promise((resolve, reject) => {
        getUploadedFileByName(filename).then(res => {
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    }
  },
  getters: {
    /**
     * 通知组件
     */
    // notify: (state) => {
    //   if (state.socket === null) {
    //     var notify = new WebSocket(config.socketUrl)
    //     notify.sendex = (category, action, targets, params) => {
    //       notify.send(JSON.stringify({
    //         'category': category,
    //         'action': action,
    //         'source': state.socketid,
    //         'targets': targets,
    //         'params': params
    //       }))
    //     }

    //     notify.sends = (category, action, data) => {
    //       notify.send(JSON.stringify({
    //         'category': category,
    //         'action': action,
    //         'data': data
    //       }))
    //     }
    //     notify.info = (data) => {
    //       notify.sendex('linkcs', 'broadcast', [], data)
    //       // notify.sends('linkcs', 'post', data)
    //     }
    //     notify.onopen = (event) => {
    //       console.log('websocket open')
    //       console.log(event)
    //     }
    //     notify.onclose = (event) => {
    //       console.log('websocket close')
    //       console.log(event)
    //     }

    //     // 绑定提示信息
    //     notify.onmessage = (event) => {
    //       // 处理连接后返回的id数据包
    //       var recv = JSON.parse(event.data)
    //       // console.log(event.data)
    //       if (recv.category === undefined && recv.action === 'connected') {
    //         state.socketid = recv.source
    //         // 更新socketid
    //         updateSocketId(recv.source).catch(err => {
    //           console.log(err)
    //         })
    //         // console.log(recv.source)
    //         return
    //       }

    //       // 显示提示框
    //       var show = (d) => {
    //         // eslint-disable-next-line no-unused-vars
    //         var no = new Notification(d.params.title, {
    //           icon: d.params.icon,
    //           body: d.params.body,
    //           renotify: false,
    //           requireInteraction: true// 直到用户关闭
    //         })
    //         // no.onclick = (e) => {

    //         //   window.open('https://baidu.com', '_blank');
    //         //   no.close();
    //         // }
    //       }
    //       // Let's check if the browser supports notifications
    //       if (!('Notification' in window)) {
    //         alert('浏览器不支持通知')
    //       } else if (Notification.permission === 'default') {
    //         Notification.requestPermission().then(function (permission) {
    //           // If the user accepts, let's create a notification
    //           if (permission === 'granted') {
    //             show(recv)
    //           }
    //         });
    //       } else {
    //         show(recv)
    //       }
    //     }
    //     state.socket = notify
    //   }
    //   return state.socket
    // },
    uploadUrl() {
      return uploadFileUrl()
    },
    baseForm() {
      return requestStruct
    }
  }
}
