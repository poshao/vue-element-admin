/**
 * 控件结构(最终版)
 */

/**
 * 付款方式
 */
// var payterm = {
//   id: 'paytype',
//   title: '付款方式',
//   type: 'combobox',
//   require: true, // 必填项
//   option: {
//     'prepaid': {
//       label: 'Prepaid'
//     },
//     'collect': {
//       label: 'Collect'
//     },
//     '3rd': {
//       label: '3rd'
//     },
//     'c&f': {
//       label: 'C&F'
//     },
//     'foc': {
//       label: 'Foc'
//     }
//   },
//   children: {
//     'collect': [{
//       id: 'account',
//       title: 'A/C#',
//       type: 'textbox'
//     }],
//     '3rd': [{
//       id: 'account',
//       title: 'A/C#',
//       type: 'textbox'
//     },
//     {
//       id: 'account_more',
//       title: 'A/C# Info',
//       type: 'textbox'
//     }]
//   }
// }

// 快递公司特殊选项
// var fex_ups_dhl = [{
//   id: 'postcode',
//   title: '邮编',
//   type: 'textbox',
//   require: false
// }, payterm, {
//   id: 'dutytax',
//   title: 'Duty&TAX',
//   type: 'checkbox',
//   require: false,
//   children: {
//     'true': [{
//       id: 'dt_paytype',
//       title: 'Duty&TAX付款',
//       type: 'combobox',
//       require: false,
//       option: {
//         'prepaid': {
//           label: 'Prepaid'
//         },
//         '3rd': {
//           label: '3rd'
//         }
//       },
//       children: {
//         '3rd': [{
//           id: 'dt_account',
//           title: 'Duty&TAX A/C#',
//           type: 'textbox'
//         }, {
//           id: 'dt_accountmore',
//           title: 'Duty&TAX A/C# More',
//           type: 'textbox'
//         }]
//       }
//     }]
//   }
// }]

// 初始化配置
var base_json = [{
  id: 'creator',
  title: '创建人',
  type: 'textbox',
  hideEmpty: true,
  require: false
},
{
  id: 'create_time',
  title: '创建时间',
  type: 'date',
  hideEmpty: true,
  require: false
},
{
  id: 'assign',
  title: '受理人',
  type: 'textbox',
  hideEmpty: true,
  require: false
},
{
  id: 'assign_time',
  title: '受理时间',
  type: 'date',
  hideEmpty: true,
  require: false
},
{
  id: 'status',
  title: '状态',
  type: 'combobox',
  hideEmpty: true,
  require: false,
  option: {
    'sended': {
      label: '已发送'
    },
    'pre_send': {
      label: '草稿'
    },
    'cancel': {
      label: '取消'
    },
    'received': {
      label: '已接收'
    },
    'reject': {
      label: '拒绝'
    },
    'resend': {
      label: '已重发'
    },
    // 'pass': {
    //   label: '通过'
    // },
    'finish': {
      label: '完成'
    }
  }
},
{
  id: 'reject_reason',
  title: '拒绝原因',
  type: 'textbox',
  require: false,
  hideEmpty: true
},
{
  id: 'level',
  title: '紧急程度',
  type: 'combobox',
  option: {
    'normal': {
      label: 'Normal'
    },
    'grade_a': {
      label: 'Grade A'
    },
    'grade_b': {
      label: 'Grade B'
    },
    'grade_c': {
      label: 'Grade C'
    }
  }
},
{
  id: 'system',
  title: '系统',
  type: 'combobox',
  option: {
    'phx': {
      label: 'PHX'
    },
    'trim': {
      label: 'TRIM'
    },
    'mixed': {
      label: 'Mixed'
    }
  }
},
{
  id: 'billname',
  title: 'Bill To Name',
  type: 'textbox',
  require: false
},
{
  id: 'dnei',
  title: '单号',
  type: 'orderinput',
  tip: 'E#, D#, Consolidation#, 最多填5个,用英文逗号分隔, Consolidation只需要数字， 示例：E175203,D175203,2393084)'
},
{
  id: 'ship_type',
  title: '出货类型',
  type: 'combobox',
  option: {
    'llkk_local': {
      label: 'LLKK Local'
    },
    'llkk_oversea': {
      label: 'LLKK Oversea'
    },
    'vat_fty': {
      label: 'VAT & FTY'
    }
  },
  children: {
    'llkk_oversea': [
      {
        id: 'courier',
        title: '快递公司',
        type: 'combobox',
        option: {
          'sf': {
            label: 'SFE'
          },
          'fex': {
            label: 'FEX'
          },
          'ups': {
            label: 'UPS'
          },
          'dhl': {
            label: 'DHL'
          },
          'forwarder': {
            label: 'Forwarder',
            tip: 'By Sea,By Air货代公司'
          },
          'forwader_regular': {
            label: 'Forwarder Regular',
            tip: 'ITI,UAL,PIL,Kirin,Star Fashion(Pacific star),Starlight(SKY MASTER),Date,Truck(Magi),TIN YAT(Ghim Li)'
          },
          'other': {
            label: 'Other',
            tip: '不常用的快递公司'
          }
        },
        children: {
          'sf': [
            {
              id: 'paytype',
              title: '付款方式',
              type: 'combobox',
              option: {
                'collect': {
                  label: 'Collect'
                },
                '3rd': {
                  label: '3rd'
                },
                'prepaid': {
                  label: 'prepaid'
                },
                'c&f': {
                  label: 'C&F'
                },
                'foc': {
                  label: 'Foc'
                }
              },
              children: {
                'collect': [
                  {
                    id: 'account',
                    title: 'A/C#',
                    type: 'textbox',
                    require: false
                  }
                ],
                '3rd': [
                  {
                    id: 'account',
                    title: 'A/C#',
                    type: 'textbox'
                    // require: false
                  }, {
                    id: 'account_more',
                    title: 'A/C# Info',
                    type: 'textbox'
                  }
                ]
              }
            }, {
              id: 'sf_postcode',
              title: '邮编',
              type: 'textbox',
              require: false
            }, {
              id: 'customer',
              title: '正式报关',
              type: 'checkbox',
              require: false,
              children: {
                'true': [{
                  id: 'customerlocation',
                  title: '清关口岸',
                  type: 'textbox'
                }]
              }
            }, {
              id: 'dutytax',
              title: 'Duty & Tax',
              type: 'checkbox',
              require: false
            }
          ],
          'fex': [
            {
              id: 'dutytax',
              title: 'Duty & Tax',
              type: 'checkbox',
              require: false,
              children: {
                'true': [
                  {
                    id: 'dt_paytype',
                    title: 'Duty&Tax付款',
                    type: 'combobox',
                    option: {
                      'prepaid': {
                        label: 'Prepaid'
                      },
                      '3rd': {
                        label: '3rd'
                      }
                    },
                    children: {
                      '3rd': [
                        {
                          id: 'dt_account',
                          title: 'Duty&Tax A/C#',
                          type: 'textbox'
                          // require: false
                        }
                        // {
                        //   id: 'dt_accountmore',
                        //   title: 'Duty&Tax A/C# More',
                        //   type: 'textbox',
                        //   require: false
                        // }
                      ]
                    }
                  }
                ]
              }
            }, {
              id: 'paytype',
              title: '付款方式',
              type: 'combobox',
              option: {
                'collect': {
                  label: 'Collect'
                },
                '3rd': {
                  label: '3rd'
                },
                'prepaid': {
                  label: 'Prepaid'
                },
                'c&f': {
                  label: 'C&F'
                },
                'foc': {
                  label: 'Foc'
                }
              },
              children: {
                'collect': [{
                  id: 'account',
                  title: 'A/C#',
                  type: 'textbox'
                }],
                '3rd': [
                  {
                    id: 'account',
                    title: 'A/C#',
                    type: 'textbox',
                    require: false
                  }, {
                    id: 'dt_accountmore',
                    title: 'Duty&Tax A/C# More',
                    type: 'textbox',
                    require: false
                  }
                ]
              }
            }, {
              id: 'postcode',
              title: '邮编',
              type: 'textbox',
              require: false
            }
          ],
          'ups': [
            {
              id: 'dutytax',
              title: 'Duty & Tax',
              type: 'checkbox',
              require: false,
              children: {
                'true': [
                  {
                    id: 'dt_paytype',
                    title: 'Duty&Tax付款',
                    type: 'combobox',
                    option: {
                      'prepaid': {
                        label: 'Prepaid'
                      },
                      '3rd': {
                        label: '3rd'
                      }
                    },
                    children: {
                      '3rd': [
                        {
                          id: 'dt_account',
                          title: 'Duty&Tax A/C#',
                          type: 'textbox',
                          require: false
                        },
                        {
                          id: 'dt_accountmore',
                          title: 'Duty&Tax A/C# More',
                          type: 'textbox',
                          require: false
                        }
                      ]
                    }
                  }
                ]
              }
            }, {
              id: 'paytype',
              title: '付款方式',
              type: 'combobox',
              option: {
                'collect': {
                  label: 'Collect'
                },
                '3rd': {
                  label: '3rd'
                },
                'prepaid': {
                  label: 'Prepaid'
                },
                'c&f': {
                  label: 'C&F'
                },
                'foc': {
                  label: 'Foc'
                }
              },
              children: {
                'collect': [{
                  id: 'account',
                  title: 'A/C#',
                  type: 'textbox'
                }],
                '3rd': [
                  {
                    id: 'account',
                    title: 'A/C#',
                    type: 'textbox',
                    require: false
                  }, {
                    id: 'dt_accountmore',
                    title: 'Duty&Tax A/C# More',
                    type: 'textbox'
                  }
                ]
              }
            }, {
              id: 'postcode',
              title: '邮编',
              type: 'textbox',
              require: false
            }
          ],
          'dhl': [
            {
              id: 'dutytax',
              title: 'Duty & Tax',
              type: 'checkbox',
              require: false,
              children: {
                'true': [
                  {
                    id: 'dt_paytype',
                    title: 'Duty&Tax付款',
                    type: 'combobox',
                    option: {
                      'prepaid': {
                        label: 'Prepaid'
                      },
                      '3rd': {
                        label: '3rd'
                      }
                    },
                    children: {
                      '3rd': [
                        {
                          id: 'dt_account',
                          title: 'Duty&Tax A/C#',
                          type: 'textbox',
                          require: false
                        },
                        {
                          id: 'dt_accountmore',
                          title: 'Duty&Tax A/C# More',
                          type: 'textbox',
                          require: false
                        }
                      ]
                    }
                  }
                ]
              }
            }, {
              id: 'paytype',
              title: '付款方式',
              type: 'combobox',
              option: {
                'collect': {
                  label: 'Collect'
                },
                '3rd': {
                  label: '3rd'
                },
                'prepaid': {
                  label: 'Prepaid'
                },
                'c&f': {
                  label: 'C&F'
                },
                'foc': {
                  label: 'Foc'
                }
              },
              children: {
                'collect': [{
                  id: 'account',
                  title: 'A/C#',
                  type: 'textbox'
                }],
                '3rd': [
                  {
                    id: 'account',
                    title: 'A/C#',
                    type: 'textbox',
                    require: false
                  }, {
                    id: 'dt_accountmore',
                    title: 'Duty&Tax A/C# More',
                    type: 'textbox'
                  }
                ]
              }
            }, {
              id: 'postcode',
              title: '邮编',
              type: 'textbox',
              require: false
            }
          ],
          'other': [{
            id: 'couriername',
            title: '快递名称',
            type: 'textbox'
          }, {
            id: 'paytype',
            title: '付款方式',
            option: {
              'collect': {
                label: 'Collect'
              },
              '3rd': {
                label: '3rd'
              },
              'prepaid': {
                label: 'Prepaid'
              },
              'c&f': {
                label: 'C&F'
              },
              'foc': {
                label: 'Foc'
              }
            },
            children: {
              'collect': [{
                id: 'account',
                title: 'A/C#',
                type: 'textbox'
              }],
              '3rd': [
                {
                  id: 'account',
                  title: 'A/C#',
                  type: 'textbox',
                  require: false
                }, {
                  id: 'dt_accountmore',
                  title: 'Duty&Tax A/C# More',
                  type: 'textbox'
                }
              ]
            }
          }]
        }
      }
    ],
    'llkk_local': [
      {
        id: 'type',
        title: '出货方式',
        type: 'combobox',
        option: {
          'self_collect': {
            label: 'Self Collect'
          },
          'local_delivery': {
            label: 'Local Delivery'
          }
        },
        children: {
          'local_delivery': [{
            id: 'delivery_time',
            title: '送货时间',
            type: 'date',
            require: false
          }, {
            id: 'waive_ldc',
            title: 'Waive local delivery charge',
            type: 'checkbox',
            require: false
          }, {
            id: 'waive_fob',
            title: 'Waive FOB',
            type: 'checkbox',
            require: false
          }]
        }
      }
    ],
    'vat_fty': [
      {
        id: 'courier',
        title: '快递公司',
        type: 'combobox',
        option: {
          'sfe': {
            label: '顺丰'
          },
          'kye': {
            label: '跨越'
          },
          'uc': {
            label: '优速'
          },
          'truck': {
            label: '街车'
          },
          'self_collect': {
            label: '自提'
          },
          'other': {
            label: '其他'
          }
        },
        children: {
          'sfe': [
            {
              id: 'delivery_service',
              title: '服务方式',
              type: 'combobox',
              option: {
                'sf_ciri': {
                  label: '次日达'
                },
                'sf_geri': {
                  label: '隔日达'
                },
                'sf_luyun': {
                  label: '陆运件'
                },
                'sf_other': {
                  label: '其他'
                }
              },
              children: {
                'sf_other': [{
                  id: 'other_service',
                  title: '服务方式',
                  type: 'textbox'
                }]
              }
            }, {
              id: 'paytype',
              title: '付款方式',
              type: 'combobox',
              option: {
                '3rd': {
                  label: '第三方'
                },
                'collect': {
                  label: 'Collect'
                },
                'foc': {
                  label: 'Foc'
                },
                'prepaid_add': {
                  label: 'Prepaid & Add'
                }
              }
            }
          ],
          'kye': [
            {
              id: 'delivery_service',
              title: '服务方式',
              type: 'combobox',
              option: {
                'kye_ciri': {
                  label: '次日达'
                },
                'kye_geri': {
                  label: '隔日达'
                },
                'kye_luyun': {
                  label: '陆运件'
                },
                'kye_other': {
                  label: '其他'
                }
              },
              children: {
                'kye_other': [{
                  id: 'other_service',
                  title: '服务方式',
                  type: 'textbox'
                }]
              }
            }, {
              id: 'paytype',
              title: '付款方式',
              type: 'combobox',
              option: {
                '3rd': {
                  label: '第三方'
                },
                'collect': {
                  label: 'Collect'
                },
                'foc': {
                  label: 'Foc'
                },
                'prepaid_add': {
                  label: 'Prepaid & Add'
                }
              }
            }
          ],
          'uc': [
            {
              id: 'delivery_service',
              title: '服务方式',
              type: 'combobox',
              option: {
                'uc_ciri': {
                  label: '次日达'
                },
                'uc_geri': {
                  label: '隔日达'
                },
                'uc_other': {
                  label: '其他'
                }
              },
              children: {
                'uc_other': [{
                  id: 'other_service',
                  title: '服务方式',
                  type: 'textbox'
                }]
              }
            }, {
              id: 'paytype',
              title: '付款方式',
              type: 'combobox',
              option: {
                '3rd': {
                  label: '第三方'
                },
                'collect': {
                  label: 'Collect'
                },
                'foc': {
                  label: 'Foc'
                },
                'prepaid_add': {
                  label: 'Prepaid & Add'
                }
              }
            }
          ],
          'truck': [
            {
              id: 'delivery_service',
              title: '服务方式',
              type: 'combobox',
              option: {
                'truck_ciri': {
                  label: '次日达'
                }
              }
            }
          ],
          'self_collect': [
            {
              id: 'paytype',
              title: '付款方式',
              type: 'combobox',
              option: {
                '3rd': {
                  label: '第三方'
                },
                'collect': {
                  label: '到付'
                }
              }
            }
          ],
          'other': [
            {
              id: 'paytype',
              title: '付款方式',
              type: 'combobox',
              option: {
                '3rd': {
                  label: '第三方'
                },
                'collect': {
                  label: '到付'
                }
              }
            }
          ]
        }
      }
    ]
  }
},
{
  id: 'si_text',
  type: 'areatext',
  title: 'Special Instruction',
  require: false,
  parse(v) {
    return decodeURIComponent(v)
  },
  toStore(v) {
    return encodeURIComponent(v)
  }
},
{
  id: 'pi_enable',
  title: 'PI Status',
  type: 'checkbox',
  require: false,
  children: {
    'true': [{
      id: 'pi_number',
      title: 'PI Number',
      type: 'textbox',
      parse(v) {
        return decodeURIComponent(v)
      },
      toStore(v) {
        return encodeURIComponent(v)
      }
    }]
  }
}
]
export default base_json
