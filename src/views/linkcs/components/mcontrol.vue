<template>
  <div>
    <!-- <el-col :span="colSpan"> -->
    <el-form-item v-if="showControl" :label="ctl.title" :required="!filterMode && (ctl.require!==false)">
      <!-- 单号录入向导 -->
      <el-input v-if="filterMode && ctl.type==='orderinput'" v-model="value" />
      <OrderInput v-else-if="ctl.type==='orderinput'" v-model="value" :readonly="readonly" />

      <!-- 组合框 -->
      <el-select v-if="ctl.type=='combobox'" v-model="value" style="width:100%" :multiple="filterMode" :clearable="filterMode" :disabled="readonly">
        <el-option v-for="(v,k,i) in ctl.option" :key="i" :value="k" :label="v.label" :title="v.tip" />
      </el-select>
      <el-alert v-if="ctl.type=='combobox' && ctl.option[value]!==undefined && ctl.option[value].tip!==undefined" :title="ctl.option[value].tip" type="error" :closable="false" />

      <!-- 文本框 -->
      <el-input v-if="ctl.type=='textbox'" v-model="value" :placeholder="ctl.tip" :readonly="readonly" />

      <!-- 复选框 -->
      <!-- <el-checkbox v-if="ctl.type=='checkbox'" v-model="value" :disabled="readonly">{{ ctl.title }}</el-checkbox> -->
      <el-checkbox v-if="ctl.type=='checkbox'" v-model="chk_value">{{ ctl.title }}</el-checkbox>

      <!-- 文本区域 -->
      <el-input
        v-if="ctl.type=='areatext'"
        v-model="value"
        type="textarea"
        :autosize="{minRows: 2,maxRows: 5}"
        :readonly="readonly"
      />

      <!-- 日期选择 -->
      <el-date-picker v-if="ctl.type=='date' && !filterMode" v-model="value" type="date" style="width:100%" :readonly="readonly" />
      <el-row v-if="ctl.type=='date' && filterMode">
        <el-col span="12"><el-date-picker v-model="value.start" type="date" style="width:100%;" clearable /></el-col>
        <el-col span="12"><el-date-picker v-model="value.end" type="date" style="width:100%;" clearable /></el-col>
      </el-row>
      <!-- 附件 -->
      <el-upload v-if="ctl.type=='upload'" action drag multiple>
        <i class="el-icon-upload" />
        <div>将文件拖到此处，或<em>点击上传</em></div>
        <div slot="tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>

    </el-form-item>
    <!-- </el-col> -->
    <div v-if="hasChild">
      <el-row style="border:solid 1ps black">
        <MControl v-for="(v,k,i) in ele.children" :key="i" :ele="v" />
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MControl',
  components: {
    'OrderInput': () => import('./order-input.vue')
  },
  props: {
    ele: {
      default() {
        return {}
      },
      type: Object
    }

  },
  computed: {
    // 复选框值绑定
    chk_value: {
      get() {
        return !!this.value
      },
      set(v) {
        if (this.readonly) return
        this.value = v
      }
    },
    // colSpan:{
    //   get(){
    //     let show=this.showControl
    //     if(this.ctl.type==='areatext') return 24;
    //     if(this.ctl.type==='layout') return 0;
    //     return 12;
    //   }
    // },
    filterMode: {
      get() {
        // console.log(this.ele.filter)
        return (this.ele.filter === true)
      }
    },
    readonly: {
      get() {
        return (this.ele.readonly === true)
      }
    },
    // 判断控件是否为空
    showControl: {
      get() {
        // console.log('name')
        // // console.log(this.ele.id)
        // // console.log(this.ele.value)
        // console.log(this.ele)
        // if (this.ctl === undefined) {
        //   console.log('error')
        // }

        if (this.ctl.type === 'layout' && this.value !== 'layout') {
          // eslint-disable-next-line
          this.value = 'layout'
        }

        if (this.ctl.hideEmpty && (this.value === undefined || this.value === null) && !this.filterMode) {
          return false
        }

        return (this.ele.control && Object.keys(this.ele.control).length > 0)
      }
    },
    hasChild: {
      get() {
        return this.ele.children !== undefined && Object.keys(this.ele.children).length > 0
      }
    },
    // 控件指代
    ctl: {
      get() {
        return this.ele.control
      }
    },
    value: {
      get() {
        if (this.filterMode && this.ctl.type === 'date') {
          if (this.ele.value === undefined) {
            this.$set(this, 'value', {
              start: null,
              end: null
            })
          }
        }

        if (this.ele.value !== undefined && this.ctl.parse !== undefined) {
          return this.ctl.parse(this.ele.value)
        }

        return this.ele.value
      },
      set(v) {
        if (this.readonly === true) return

        if (!this.filterMode && this.ctl.valid !== undefined && !this.ctl.valid(v)) {
          this.$message({ type: 'error', message: '数据验证失败[' + v + ']' })
          return
        }

        // console.log('set value')
        // console.log(this.ele)
        if (this.ctl.toStore !== undefined) {
          // console.log(v)
          v = this.ctl.toStore(v)
          // console.log(v)
        }

        this.$set(this.ele, 'value', v)

        if (this.ctl.children && this.ctl.children.hasOwnProperty(v)) {
          const children_t = this.ctl.children[v]
          var children = []
          children_t.forEach(v => {
            children.push({
              id: v.id,
              readonly: this.ele.readonly,
              filter: this.ele.filter,
              control: v
            })
          })
          this.$set(this.ele, 'children', children)
        } else {
          this.$set(this.ele, 'children', undefined)
        }
      }
    }
  }
}
</script>
