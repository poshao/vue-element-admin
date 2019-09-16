/**
 * 放单平台API
 */
import client from '@/utils/request-spoon'

import { Base64 } from 'js-base64'

/**
 * 提交订单
 */
export const newRequest = (detail) => {
  // console.log(detail)
  return client.post('linkcs/v1/orders', {
    'detail': detail
  })
}

/**
 * 更新订单
 */
export const updateRequest = ({ orderid, detail }) => {
  return client.put('linkcs/v1/orders', {
    'orderid': orderid,
    'detail': detail
  })
}

/**
 * 获取详细订单
 */
export const listRequest = (option) => {
  if (option !== undefined) {
    return client.get('linkcs/v1/orders', {
      params: {
        option: btoa(JSON.stringify(option))
      }
    })
  } else {
    return client.get('linkcs/v1/orders')
  }
}

/**
 * 更新订单状态
 */
export const updateStatus = ({
  orderid,
  status,
  reason
}) => {
  return client.patch('linkcs/v1/orders', {
    'orderid': orderid,
    'status': status,
    'reason': reason
  })
}

/**
 * 添加附件
 */
export const addFile = (file) => {
  var params = new FormData()
  params.append('file', file.file, file.name)
  return client.post('linkcs/v1/files', params, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress(e) {
      file.loaded = e.loaded
      file.total = e.total
    }
  })
}

/**
 * 提供文件上传路径(临时使用)
 */
export const uploadFileUrl = () => {
  return client.defaults.baseURL + '/linkcs/v1/files'
}

/**
 * 下载文件(用户临时文件)
 */
export const getUploadedFileByName = (filename) => {
  // console.log(filename)
  filename = Base64.encode(filename)
  return client.get('linkcs/v1/files', {
    responseType: 'blob',
    params: {
      'filename': filename
    }
  })
}

/**
 * 重置附件
 * @param {string} orderid
 */
export const resetAttchments = (orderid) => {
  return client.patch('linkcs/v1/orders', {
    'orderid': orderid
  })
}
/**
 * 下载文件
 */
export const getFile = (filename, hashname) => {
  return client.get('linkcs/v1/files', {
    responseType: 'blob',
    params: {
      'filename': Base64.encode(filename),
      'hashname': hashname
    }
  })
}

/**
 * 获取文件下载路径
 * @param {string} filename
 * @param {string} hashname
 */
export const getFileLink = (filename, hashname) => {
  return client.defaults.baseURL + '/linkcs/v1/files?filename=' + Base64.encode(filename) + '&hashname=' + hashname
}

/**
 * 获取已经上传的文件列表
 */
export const listUploadedFiles = () => {
  return client.get('linkcs/v1/files')
}

/**
 * 移除已上传文件
 * @param {string} filename
 */
export const removeFile = (filename) => {
  return client.delete('linkcs/v1/files', {
    params: {
      'filename': filename
    }
  })
}

/** ********************************************************
 * 使用状态
 *********************************************************/
export const getOrderCountStatus = () => {
  return client.get('linkcs/v1/status')
}

/** ********************************************************
 * 报表结构
 *********************************************************/
/**
 * 获取报表结构列表
 */
export const listReportStructs = () => {
  return client.get('linkcs/v1/reports')
}

/**
 * 获取报表结构
 * @param {string} reportname
 */
export const getReportStruct = (reportname) => {
  return client.get('linkcs/v1/reports', {
    params: {
      'reportname': reportname
    }
  })
}

/**
 * 创建或更新报表结构
 * @param {string} reportname 报表名称
 * @param {json} struct 报表结构
 */
export const updateReportStruct = (reportname, struct) => {
  return client.post('linkcs/v1/reports', {
    'reportname': reportname,
    'struct': struct
  })
}

/**
 * 删除报表结构
 * @param {string} reportname
 */
export const deleteReportStruct = (reportname) => {
  return client.delete('linkcs/v1/reports', {
    params: {
      'reportname': reportname
    }
  })
}

/** ********************************************************
 * 数据转化
 *********************************************************/

/**
 * 提取表结构中所有字段
 * @param {object} viewStruct 视图定义(in)
 * @param {object} fieldList 字段列表(out)
 */
export const getFieldsFromViewStruct = (viewStruct, fieldList) => {
  for (var i = 0; i < viewStruct.length; i++) {
    const v = viewStruct[i]
    fieldList[v.id] = v.title
    // fieldList.push({
    //   key: v.id,
    //   label: v.title
    // })
    // fieldList[v.id] = v.title

    if (v.options !== undefined) {
      for (var k in v.options) {
        getFieldsFromViewStruct(v.options[k], fieldList)
      }
    }
  }
}

/**
 * 将表单结构转为存储结构数据
 * @param {array} viewData 表单列表(in)
 * @param {object} store 输出数据(out)
 */
// export const convertViewData2StoreData = (viewData, store) => {
//   viewData.forEach((v, k) => {
//     // 检查必填项
//     console.log(v.title + ':' + v.value)
//     if ((v.required === undefined || v.required === true) && v.value === undefined) {
//       throw new Error(v.title + ' required')
//     }
//     // 检查转码
//     if (v.value === undefined) {
//       //
//     } else if (v.encoding === true) {
//       store[v.id] = encodeURIComponent(v.value)
//     } else {
//       // 对日期转码处理
//       // console.log(v.id)
//       // console.log(v.value)
//       // console.log(v.value instanceof Date)
//       if (v.value instanceof Date) {
//         store[v.id] = datetimeFormat(v.value, 'yyyy/MM/dd hh:mm:ss')
//       } else {
//         store[v.id] = v.value
//       }
//     }
//     if (v.more) {
//       convertViewData2StoreData(v.more, store)
//     }
//   })
// }
/**
 * 将存储数据转化为显示结构
 * @param {object} viewStruct 显示模板(in)
 * @param {object} store 存储数据
 */
// export const convertStoreData2ViewData = (viewStruct, store) => {
//   viewStruct.forEach((v, k) => {
//     if (store[v.id] !== undefined) {
//       if (v.encoding === true) {
//         v.value = decodeURIComponent(store[v.id])
//       } else {
//         v.value = store[v.id]
//       }
//       if (v.options !== undefined) {
//         v.more = v.options[store[v.id]]
//       }
//     }
//     if (v.more) {
//       convertStoreData2ViewData(v.more, store)
//     }
//   })
// }
/**
 * 将数据转为报表
 * @param {object} store 存储数据
 * @param {object} viewStruct 表单结构
 * @param {object} row 输出报表行
 */
export const convertStore2Report = (store, viewStruct, row) => {
  viewStruct.forEach((v, k) => {
    // if (reportStruct.columns[v.id] !== undefined) {
    if (store[v.id] !== undefined) {
      if (v.encoding === true) {
        v.value = decodeURIComponent(store[v.id])
      } else {
        v.value = store[v.id]
      }
      if (v.options !== undefined) {
        v.more = v.options[store[v.id]]
      }
    }
    row[v.id] = v.value
    if (v.more) {
      convertStore2Report(store, v.more, row)
    }
    // }
  })
}
