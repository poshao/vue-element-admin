import { objectMerge } from '@/utils/index'
import { datetimeFormat } from '@/utils/common'
import { saveAs } from 'file-saver'
/**
 * 获取存档资料/筛选条件
 * @param {object} children 数据集合
 */
export const getStoreData = (children) => {
  const result = {}

  children.forEach(v => {
    if (v.id && v.value) {
      if (v.filter === true) {
        // 提取筛选条件
        switch (v.control.type) {
          case 'combobox':
            if (v.value instanceof Array && v.value.length > 0) {
              result[v.id] = {
                key: v.id,
                op: 'in',
                val: v.value
              }
            }
            break
          case 'date':
            if (v.value.start === undefined || v.value.start === null) {
              if (v.value.end === undefined || v.value.end === null) {
                // null
              } else {
                result[v.id] = {
                  key: v.id,
                  op: '<=',
                  val: datetimeFormat(v.value.end, 'yyyy/MM/dd hh:mm:ss')
                }
              }
            } else {
              if (v.value.end === undefined || v.value.end === null) {
                result[v.id] = {
                  key: v.id,
                  op: '>=',
                  val: datetimeFormat(v.value.start, 'yyyy/MM/dd hh:mm:ss')
                }
              } else {
                result[v.id] = {
                  key: v.id,
                  op: 'between',
                  val: [
                    datetimeFormat(v.value.start, 'yyyy/MM/dd hh:mm:ss'),
                    datetimeFormat(v.value.end, 'yyyy/MM/dd hh:mm:ss')
                    // v.value.start, v.value.end
                  ]
                }
              }
            }
            break
          case 'textbox':
          case 'orderinput':
          case 'areatext':
          case 'checkbox':
            result[v.id] = {
              key: v.id,
              op: 'like',
              val: v.value
            }
            break
        }
      } else {
        switch (v.control.type) {
          case 'date':
            result[v.id] = datetimeFormat(v.value, 'yyyy/MM/dd hh:mm:ss')
            break
          default:
            result[v.id] = v.value
            break
        }
      }
    }

    if (v.children !== undefined) {
      objectMerge(result, getStoreData(v.children))
    }
  })
  return result
}

/**
 * 填充筛选条件
 * @param {Object} node 数据节点
 */
export const fillFilterData = (control, filter) => {
  if (control.control.type === 'layout') {
    control.value = 'layout'
  } else if (control.id !== undefined && filter.hasOwnProperty(control.id)) {
    switch (control.control.type) {
      case 'textbox':
      case 'areatext':
      case 'orderinput':
      case 'combobox':
        control.value = filter[control.id]['val']
        break
      case 'date':
        // console.log('date')
        control.value = {
          start: null,
          end: null
        }
        if (filter[control.id] !== undefined) {
          let start = null
          let end = null
          switch (filter[control.id]['op']) {
            case '<=':
              end = filter[control.id]['val']
              break
            case '>=':
              start = filter[control.id]['val']
              break
            case 'between':
              start = filter[control.id]['val'][0]
              end = filter[control.id]['val'][1]
              break
          }
          if (typeof start === 'string') {
            control.value.start = new Date(start)
          }
          if (typeof end === 'string') {
            control.value.end = new Date(end)
          }
        }
        break
    }
    // control.value = filter[control.id]
  }
  if (control.control === undefined || control.control.children === undefined || control.control.children[control.value] === undefined) {
    return control
  }
  const children = []
  control.control.children[control.value].forEach(v => {
    const node = {
      id: v.id,
      readonly: control.readonly,
      filter: control.filter,
      control: v
    }
    children.push(fillFilterData(node, filter))
  })
  control.children = children
  return control
}

/**
 * 填充存储数据(转化为显示结构)
 * @param {Object} control 数据节点
 * @param {Object} store 数据值集合
 */
export const fillStoreData = (control, store) => {
  if (control.control.type === 'layout') {
    control.value = 'layout'
  } else if (control.id !== undefined && store.hasOwnProperty(control.id)) {
    // if (control.control.parse !== undefined) {
    //   control.value = control.control.parse(store[control.id])
    // } else {
    control.value = store[control.id]
    // }
  }
  if (control.control === undefined || control.control.children === undefined || control.control.children[control.value] === undefined) {
    return control
  }
  const children = []
  control.control.children[control.value].forEach(v => {
    const node = {
      id: v.id,
      readonly: control.readonly,
      control: v
    }
    children.push(fillStoreData(node, store))
  })
  control.children = children
  return control
}

/**
 * 获取所有字段名称
 * @param {Object} children 描述结构
 */
export const getAllFields = (children) => {
  let fields = {}
  children.forEach(v => {
    if (v.id !== undefined && typeof v.id === 'string' && v.id !== '') {
      const node = {
        id: v.id
      }
      if (v.hasOwnProperty('toStore')) {
        node.toStore = v.toStore
      }
      if (v.hasOwnProperty('parse')) {
        node.parse = v.parse
      }
      fields[v.id] = node
      // fields.push(node)
      // fields.push(v.id)
    }

    if (v.children !== undefined) {
      for (const key in v.children) {
        const ss = getAllFields(v.children[key])
        fields = objectMerge(fields, ss)
        // fields.push(...ss)
      }
    }
  })
  return fields
  // return Array.from(new Set(fields))
}

/**
 * 将数据转化成报表
 * @param {Object} children 描述结构
 * @param {Array} dataset 数组数据
 */
export const downloadReport = (children, dataset) => {
  const fields = getAllFields(children)
  fields['has_attachment'] = { id: 'has_attachment' }
  const rows = []
  dataset.forEach(v => {
    const row = JSON.parse(v.json_detail)
    // if (row.si_text !== undefined) {
    //   row.si_text = decodeURIComponent(row.si_text)
    // }
    row['dnei'] = v.dnei
    row['system'] = v.system
    row['level'] = v.level
    row['create_time'] = v.create_time
    row['assign_time'] = v.assign_time
    row['creator'] = v.creator
    row['assign'] = v.assign
    row['status'] = v.status
    row['reject_reason'] = v.reject_reason
    row['has_attachment'] = v.has_attachment
    rows.push(row)
  })
  // console.log(rows)
  const blob = convertToCsv(rows, fields)
  var filename = 'linkcs_report_' + new Date().getTime() + '.csv'
  saveAs(blob, filename)
}

/**
 * 将json数据转化为CSV格式
 * @param {object} jsonData
 * @param {object} jsonTitle
 */
export const convertToCsv = (jsonData, jsonTitle) => {
  let csvData = ''
  // jsonTitle.forEach(col => {
  //   csvData += quoteValue(col.id) + ','
  // })
  for (const key in jsonTitle) {
    csvData += quoteValue(key) + ','
  }

  csvData += '\n'
  jsonData.forEach(row => {
    for (const key in jsonTitle) {
      let val = row[key] === undefined ? '' : row[key]
      const col = jsonTitle[key]
      if (col.hasOwnProperty('parse')) {
        val = col.parse(val)
      }
      csvData += quoteValue(val) + ','
    }
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
const quoteValue = (v) => {
  // eslint-disable-next-line no-useless-escape
  if (v === undefined || v === null) return '\"\"'
  if (typeof v === 'boolean') v = String(v)
  v = v.toString()
  // eslint-disable-next-line no-useless-escape
  return '\"' + v.replace(/\"/g, '\"\"') + '\"'
}
