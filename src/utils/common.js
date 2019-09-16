/* eslint-disable no-redeclare */
import { Base64 } from 'js-base64'
/**
 * 深度复制
 * @param {*} obj
 */
export const clone = obj => {
  // Handle the 3 simple types, and null or undefined
  if (obj == null || typeof obj !== 'object') return obj

  // Handle Date
  if (obj instanceof Date) {
    var copy = new Date()
    copy.setTime(obj.getTime())
    return copy
  }

  // Handle Array
  if (obj instanceof Array) {
    var copy = []
    var len = obj.length
    for (var i = 0; i < len; ++i) {
      copy[i] = clone(obj[i])
    }
    return copy
  }

  // Handle Object
  if (obj instanceof Object) {
    var copy = {}
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr])
    }
    return copy
  }

  throw new Error("Unable to copy obj! Its type isn't supported.")
}

/**
 * 格式化日期
 * @param {Date} date
 * @param {string} format
 */
export const datetimeFormat = (date, format) => {
  var o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds() // 毫秒
  }

  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return format
}

/**
 * 文件下载
 * @param {object} file 二进制数据
 * @param {string} name 文件名
 */
export const downloadFile = (file, name) => {
  const url = URL.createObjectURL(file)
  var link = document.createElement('a')
  document.body.appendChild(link)
  link.href = url
  link.download = name === undefined ? new Date().getTime() : name
  link.click()
  window.URL.revokeObjectURL(url)
  document.body.removeChild(link)
}

/**
 * 文件下载
 * @param {object} res
 */
export const downloadFile2 = (res) => {
  const reg = /=(.*?)$/
  const name = Base64.decode(reg.exec(res.headers['content-disposition'])[1])
  const url = URL.createObjectURL(res.data)
  var link = document.createElement('a')
  document.body.appendChild(link)
  link.href = url
  link.download = name === undefined ? new Date().getTime() : name
  link.click()
  window.URL.revokeObjectURL(url)
  document.body.removeChild(link)
}

/**
 * 将json数据转化为CSV格式
 * @param {object} jsonData
 * @param {object} jsonTitle
 */
export const convertJson2Csv = (jsonData, jsonTitle) => {
  let csvData = ''
  jsonTitle.forEach(col => {
    csvData += quoteValue(col) + ','
  })
  csvData += '\n'
  jsonData.forEach(row => {
    jsonTitle.forEach(col => {
      csvData += quoteValue(row[col]) + ','
    })
    csvData += '\n'
  })
  return new Blob(['\uFEFF' + csvData], {
    type: 'text/csv;charset=utf8;'
  })
}

/**
 * 用引号包裹值
 * @param {string} v
 */
export const quoteValue = (v) => {
  // eslint-disable-next-line no-useless-escape
  if (v === undefined || v === null) return '\"\"'
  if (typeof v === 'boolean') v = String(v)
  v = v.toString()
  // eslint-disable-next-line no-useless-escape
  return '\"' + v.replace(/\"/g, '\"\"') + '\"'
}

/**
 * 将对象转化为数组(针对用index作为key的对象,主要用户接口返回的列表数据)
 * @param {object} object
 */
// export const convertObject2Array = (object) => {
//   var arr = []
//   for (var i in object) {
//     arr.push(object[i])
//   }
//   return arr
// }

/**
 * 生成一个随机密码
 * @param {*} min
 * @param {*} max
 */
export const generatePassword = (min, max) => {
  if (min === undefined) {
    min = 6
  }
  if (max === undefined) {
    max = min
  }
  // 可以生成随机密码的相关数组
  var num = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  var english = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
  var ENGLISH = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
  var special = ['-', '_', '#']
  var config = num.concat(english).concat(ENGLISH).concat(special)

  // 先放入一个必须存在的
  var arr = []
  arr.push(getOne(num))
  arr.push(getOne(english))
  arr.push(getOne(ENGLISH))
  arr.push(getOne(special))

  // 获取需要生成的长度
  var len = min + Math.floor(Math.random() * (max - min + 1))

  for (var i = 4; i < len; i++) {
    // 从数组里面抽出一个
    arr.push(config[Math.floor(Math.random() * config.length)])
  }

  // 乱序
  var newArr = []
  for (var j = 0; j < len; j++) {
    newArr.push(arr.splice(Math.random() * arr.length, 1)[0])
  }

  // 随机从数组中抽出一个数值
  function getOne(arr) {
    return arr[Math.floor(Math.random() * arr.length)]
  }

  return newArr.join('')
}
