<template>
  <!-- 单号输入框 -->
  <div>
    <el-row>
      <el-input v-model="ordersText" placeholder="请输入单号" readonly @focus="handleShowDialog">
        <el-button slot="append" type="default" @click="handleShowDialog">...</el-button>
      </el-input>
    </el-row>
    <el-dialog
      title="单号录入向导"
      :visible.sync="showDialog"
      :close-on-click-modal="false"
      append-to-body
    >

      <el-input
        v-model="panel.inputText"
        type="textarea"
        rows="5"
        min-rows="3"
        placeholder="请在此处输入单号，用英文逗号分开"
        autofocus
      />
      <p>共识别 {{ panel.convertList.length }} 条记录</p>
      <el-input
        v-model="panel.converteredText"
        type="textarea"
        rows="5"
        min-rows="3"
        placeholder="转化后的结果在此处显示"
        readonly
      />
      <span slot="footer" class="dialog-footer">
        <el-button type="default" @click="handleConverter">转化</el-button>
        <el-button type="default" @click="handleReset">重置</el-button>
        <el-button type="primary" @click="handleSubmit">提交</el-button>
      </span>
      <!-- <div>
         <p v-for="(v,k) in panel.convertList" :key="k">{{v}}</p>
      </div> -->
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'OrderInput',
  props: {
    value: {
      default() {
        return []
      },
      type: Array
    }
  },
  data() {
    return {
      // 单号显示
      // ordersText: '',
      // 显示向导框
      showDialog: false,
      panel: {
        // 原始文本
        inputText: '',
        // 转化后的文本
        converteredText: '',
        // 转化后列表
        convertList: []
      }
    }
  },
  // mounted () {
  //   if (this.value !== undefined) {
  //     this.panel.inputText = this.value.join(',')
  //   } else {
  //     this.panel.inputText = ''
  //   }
  //   this.panel.converteredText = this.panel.inputText
  // },
  computed: {
    'ordersText': {
      get() {
        if (this.value === undefined) {
          return ''
        }

        var text = this.value.slice(0, 3).join(',')

        if (this.value.length > 3) {
          text += '等' + this.value.length + '个单号'
        }

        return text
      },
      set(v) {
        if (v === '') {
          this.value.clear()
        }
      }
    }
  },
  methods: {
    handleConverter() {
      // 正则匹配
      var dnei_pattern = /(([DE]\d{6})|\d{10}|\d{8}|\d{7})/ig
      var srcText = this.panel.inputText.toUpperCase()
      var result = srcText.match(dnei_pattern)
      var list = [...new Set(result)]

      list.sort()
      this.panel.convertList = list
      this.panel.converteredText = list.join(',')
    },
    handleSubmit() {
      // // 转化数据并检查
      // var list = []
      // if (this.panel.inputText !== '') {
      //   list = this.panel.inputText.toUpperCase().split(',')
      // }
      // // 去重
      // list = [...new Set(list)]

      // var pattern = /^(([DE]\d{6})|\d{8})$/i
      // for (let item of list) {
      //   if (!pattern.test(item)) {
      //     alert('无法识别的内容 【' + item + '】')
      //     return
      //   }
      // }

      // list.sort()
      // this.panel.convertList = list
      // this.value = list
      // this.panel.inputText = list.join(',')
      this.handleConverter()
      this.value = this.panel.convertList
      this.showDialog = false
      this.$emit('input', this.value)
    },
    handleReset() {
      this.panel.inputText = ''
      this.panel.converteredText = ''
      this.panel.convertList = []
    },
    handleShowDialog() {
      this.showDialog = true
      if (this.value !== undefined) {
        this.panel.inputText = this.value.join(',')
      } else {
        this.panel.inputText = ''
      }
      this.panel.converteredText = this.panel.inputText
    }
  }
}
</script>
