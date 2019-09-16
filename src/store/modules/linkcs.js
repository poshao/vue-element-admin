import {
  newRequest,
  listRequest,
  updateStatus,
  addFile,
  uploadFileUrl,
  getUploadedFileByName

} from '@/api/linkcs.js'

// import { deepClone, objectMerge } from '@/utils/index'

// import { convertJson2Csv } from '@/utils/common'
import { downloadReport } from '@/utils/linkcs'
import { saveAs } from 'file-saver'
// require('script-loader!file-saver')

// import {
//   updateSocketId
// } from '../../api/auth.js'

// import config from '../../config/index.js'

import requestStruct from './linkcs_request_struct.js'
import { getFile } from '../../api/linkcs.js'

const state = {
  requestDetail: {},
  requestList: [],
  chat: null,
  chat_list: '',
  /**
   * 通知组件
   */
  socket: null,
  socketid: ''
}

const mutations = {
  setRequestDetail(state, requestDetail) {
    state.requestDetail = requestDetail
  },
  setRequestList(state, requestList) {
    state.requestList = requestList
  }
}

const actions = {

  /**
   * 下载表格
   */
  exportTable({ commit }, rows) {
    downloadReport(requestStruct, rows)
  },
  /**
   * 下载附件
   */
  downloadAttachment({ commit }, { hashname, filename }) {
    getFile(filename, hashname).then(res => {
      saveAs(res.data, filename)
    })
  },
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
  // handleAcceptOrder({
  //   commit
  // }, orderid) {
  //   return new Promise((resolve, reject) => {
  //     updateStatus({
  //       'orderid': orderid,
  //       'status': 'pass'
  //     }).then(res => {
  //       resolve()
  //     }).catch(error => {
  //       reject(error)
  //     })
  //   })
  // },
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
  // handleLockOrder({ commit }, orderid) {
  //   return new Promise((resolve, reject) => {
  //     updateStatus({
  //       'orderid': orderid,
  //       'status': 'lock'
  //     }).then(res => {
  //       resolve()
  //     }).catch(error => {
  //       reject(error)
  //     })
  //   })
  // },
  /**
   * 接收订单
   */
  handleReceiveOrder({ commit }, orderid) {
    return new Promise((resolve, reject) => {
      updateStatus({
        'orderid': orderid,
        'status': 'received'
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
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters: {
    uploadUrl() {
      return uploadFileUrl()
    },
    baseForm() {
      return requestStruct
    }
  }
}
