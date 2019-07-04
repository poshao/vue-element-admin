/**
 * 控件结构(原先)
 */

/**
 * 付款方式
 */
var payterm = {
  type: 'combobox',
  id: 'paytype',
  title: '付款方式',
  required: true, // 必填项
  encoding: false, // 转码特殊字符
  list: {
    'prepaid': 'Prepaid',
    'collect': 'Collect',
    '3rd': '3rd',
    'c&f': 'C&F',
    'foc': 'Foc'
  },
  options: {
    'foc': [{
      type: 'checkbox',
      id: 'foc_allin',
      title: 'All in'
    }],
    'collect': [{
      type: 'textbox',
      id: 'account',
      title: 'A/C#',
      required: false
    }],
    '3rd': [{
      type: 'textbox',
      id: 'account',
      title: 'A/C#'
    },
    {
      type: 'textbox',
      id: 'account_more',
      title: 'A/C# Info'
    }
    ]
  }
}

// 快递公司特殊选项
var fex_ups_dhl = [{
  type: 'textbox',
  id: 'postcode',
  title: '邮编',
  required: false
}, payterm, {
  type: 'checkbox',
  id: 'dutytax',
  title: 'Duty&TAX',
  options: {
    'true': [{
      type: 'combobox',
      id: 'dt_paytype',
      title: 'Duty&TAX付款',
      required: false,
      list: {
        'prepaid': 'Prepaid',
        '3rd': '3rd'
      },
      options: {
        '3rd': [{
          type: 'textbox',
          id: 'dt_account',
          title: 'Duty&TAX A/C#'
        }, {
          type: 'textbox',
          id: 'dt_accountmore',
          title: 'Duty&TAX A/C# More'
        }]
      }
    }]
  }
}]

// 初始化配置
var base_json = [{
  /**
   * 控件类型
   *
   * 可选参数:
   *
   * combobox: 组合框,list为下拉选项列表
   * checkbox: 复选框
   * textbox: 文本框
   * areatext: 文本区域
   * date: 日期选择器
   * upload: 文件上传
   */
  type: 'combobox',
  /**
   * 提交数据的字段名称
   */
  id: 'level',
  /**
   * 表单提示字符
   */
  title: '紧急程度',
  /**
   * 组合框下拉选项
   *
   * value : title
   */
  list: {
    'normal': 'Normal',
    'grade_a': 'Grade A',
    'grade_b': 'Grade B',
    'grade_c': 'Grade C'
  }
},
{
  type: 'combobox',
  id: 'system',
  title: '系统',
  list: {
    'phx': 'PHX',
    'trim': 'TRIM',
    'mixed': 'Mixed'
  }
},
{
  type: 'textbox',
  id: 'billname',
  title: 'Bill To Name',
  required: false
},
{
  // type: 'textbox',
  type: 'orderinput',
  id: 'dnei',
  title: '单号',
  tip: 'E#, D#, Consolidation#, 最多填5个,用英文逗号分隔, Consolidation只需要数字， 示例：E175203,D175203,2393084)'
  // encoding: true
},
{
  type: 'combobox',
  id: 'ship_type',
  title: '出货类型',
  list: {
    'llkk_local': 'LLKK Local',
    'llkk_oversea': 'LLKK Oversea'
  },
  options: {
    'llkk_local': [{
      type: 'combobox',
      id: 'type',
      title: '出货方式',
      list: {
        'self_collect': 'Self Collect',
        'local_delivery': 'Local Delivery'
      },
      options: {
        'local_delivery': [{
          type: 'date',
          id: 'delivery_time',
          title: '送货时间',
          required: false
        }]
      }
    }],
    'llkk_oversea': [{
      type: 'checkbox',
      id: 'needshipdoc',
      title: 'Need Shipdoc',
      required: false
    },
    {
      type: 'combobox',
      id: 'courier',
      title: '快递公司',
      list: {
        'sf': 'SF',
        'fex': 'FEX',
        'ups': 'UPS',
        'dhl': 'DHL',
        'other': 'Other'
      },
      options: {
        'sf': [{
          type: 'textbox',
          id: 'sf_postcode',
          title: '邮编',
          required: false
        }, {
          type: 'checkbox',
          id: 'customer',
          title: '正式报关',
          required: false,
          options: {
            'true': [{
              type: 'textbox',
              id: 'customerlocation',
              title: '清关口岸'
            }]
          }
        }, payterm],
        'other': [{
          type: 'textbox',
          id: 'couriername',
          title: '名称'
        }, payterm],
        'fex': fex_ups_dhl,
        'ups': fex_ups_dhl,
        'dhl': fex_ups_dhl
      }
    }
    ]
  }
},
{
  type: 'areatext',
  id: 'si_text',
  encoding: true,
  title: 'Special Instruction',
  required: false
},
{
  type: 'checkbox',
  id: 'pi_enable',
  title: 'PI Status',
  required: false,
  options: {
    'true': [{
      type: 'textbox',
      id: 'pi_number',
      title: 'PI Number',
      encoding: true
    }]
  }
}
]
export default base_json
