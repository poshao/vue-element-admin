<template>
  <div>
    <el-form-item v-if="ele.type!=='null'" :label="ele.title" :required="(ele.required!==false)">
      <!-- 单号录入向导 -->
      <OrderInput v-if="ele.type==='orderinput'" v-model="value" />
      <!-- 组合框 -->
      <el-select v-if="ele.type=='combobox'" v-model="value" style="width:100%">
        <el-option v-for="(v,k,i) in ele.list" :key="i" :value="k" :label="v" />
      </el-select>
      <!-- 文本框 -->
      <el-input v-if="ele.type=='textbox'" v-model="value" :placeholder="ele.tip" />
      <!-- 复选框 -->
      <el-checkbox v-if="ele.type=='checkbox'" v-model="value">{{ ele.title }}</el-checkbox>
      <!-- 文本区域 -->
      <el-input
        v-if="ele.type=='areatext'"
        v-model="value"
        type="textarea"
        :autosize="{minRows: 2,maxRows: 5}"
      />
      <!-- 日期选择 -->
      <el-date-picker v-if="ele.type=='date'" v-model="value" type="date" placeholder="Select date" />
      <!-- 附件 -->

      <el-upload v-if="ele.type=='upload'" action drag multiple>
        <i class="el-icon-upload" />
        <div>将文件拖到此处，或<em>点击上传</em></div>
        <div slot="tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
    </el-form-item>
    <div v-if="ele.more">
      <Container v-for="(v,k,i) in ele.more" :key="i" :ele="v" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Container',
  components: {
    'OrderInput': () => import('./order-input.vue')
  },
  props: {
    ele: {
      default() {
        return {}
      },
      type: Object
    },
    readonly: {
      default() {
        return false
      },
      type: Boolean
    }
  },
  data() {
    return {}
  },
  computed: {
    value: {
      get() {
        return this.ele.value
      },
      set(v) {
        if (this.readonly) return
        this.$set(this.ele, 'value', v)

        if (this.ele.options !== undefined) {
          this.$set(this.ele, 'more', this.ele.options[v])
        }
      }
    }
  }
  // methods: {
  //   /**
  //    * 加载子元素
  //    */
  //   loadChildren (value) {
  //     // this.options.Children['default']
  //     parent.Children.push(parent.list[value])
  //   }
  // }
}
</script>
