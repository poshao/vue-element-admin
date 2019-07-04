<template>
  <div class="linkcs_create">
    <el-row>
      <el-col :span="24">
        <el-alert title="截关时间" show-icon :closable="false">
          <h3>LLKK:</h3>
          <p>11:00 AM 之前提供的，走晚关车</p>
          <p>15:00PM之前提供的，走第二天早关车</p>
          <h3>Vat:</h3>
          <p>16:30pm 当天发快递走货</p>
        </el-alert>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center">
      <el-col :span="20">
        <el-form :label-width="'90'" class="form">
          <h1 style="text-align:center">New Request</h1>

          <Container :ele="ele" />

          <el-upload
            :action="upload.url"
            drag
            multiple
            max-size="5000"
            :headers="{'xtoken':this.$store.state.user.token}"
            :file-list="upload.list"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-exceed="handleExceedSize"
          >
            <i class="el-icon-upload" />
            <div>将文件拖到此处，或<em>点击上传</em></div>
          </el-upload>

          <el-button long type="primary" style="margin-bottom:3px;" @click="handleSubmit()">提交</el-button>
          <el-button long type="default" @click="resetData()">重置</el-button>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Container from './components/container.vue'
import { mapActions } from 'vuex'
import { downloadFile2 } from '@/utils/common'
import { deepClone } from '@/utils/index'
import {
  listUploadedFiles,
  removeFile,
  convertViewData2StoreData,
  resetAttchments
} from '@/api/linkcs'
export default {
  components: {
    'Container': Container
    // 'OrderInput': () => import('./components/order-input.vue')
  },
  data() {
    return {
      ele: {},
      upload: {
        url: this.$store.getters.uploadUrl,
        list: []
      },
      // 订单列表
      orders: []
    }
  },
  // beforeRouteEnter (to, from, next) {
  //   // 在渲染该组件的对应路由被 confirm 前调用
  //   // 不！能！获取组件实例 `this`
  //   // 因为当守卫执行前，组件实例还没被创建
  //   console.log(to)
  //   this.resetData(to.params.items)
  //   next()
  // },
  mounted() {
    // console.log(this.$route.params.items)
    this.resetData(this.$route.params.items)
  },
  methods: {
    ...mapActions(['handleNewRequest', 'handleListRequest', 'handleGetFile']),
    handleOrderInputSubmit(order) {
      this.orders = order
    },
    handleExceedSize(file) {
      this.$message.error(file.name + '文件过大(文件上传限制5MB)')
    },
    // handleProgress (event, file, filelist) {
    //   // 修正文件名中的非法字符 & #
    //   // file.name = file.name.replace('#', '_').replace('&', '_')
    // },
    handlePreview(file) {
      this.handleGetFile(file.name).then(res => {
        downloadFile2(res)
      })
    },
    handleRemove(file) {
      // console.log(file)
      removeFile(file.name).then(res => {
        this.$message.info('删除成功')
      })
    },
    handleSubmit() {
      var detail = {}
      try {
        convertViewData2StoreData(this.ele.more, detail)
        // this.combineResult(this.ele.more, detail)

        this.handleNewRequest(detail).then(res => {
          // 发送消息通知
          // console.log(this.notify)
          // this.notify.info({
          //   title: '新订单(' + detail.level + ')',
          //   icon: this.avatorURL,
          //   body: detail.dnei
          // })
          this.$message.info('提交成功')
          this.$router.replace({ name: 'linkcs_list' })
        })
      } catch (e) {
        // console.log(e)
        this.$message.error({ content: e.message, duration: 3 })
      }
    },
    /**
     * 初始化表单
     */
    resetData(items) {
      // var ll = []
      // getFieldsFromViewStruct(clone(this.$store.getters.baseForm), ll)
      // console.log(ll)
      if (items === undefined) {
        this.$set(this, 'ele', {
          title: '',
          type: 'null',
          value: null,
          more: deepClone(this.$store.getters.baseForm) // base_json
        })
      } else {
        // console.log(items)
        this.$set(this, 'ele', items)
      }
      // 重置附件
      if (items === undefined) {
        resetAttchments(0).then(() => {
          // 获取已上传目录
          listUploadedFiles().then(res => {
            this.upload.list = []
            const list = res.data.list
            list.forEach(v => {
              this.upload.list.push({ 'name': v.name })
            })
          })
        })
      } else {
        listUploadedFiles().then(res => {
          this.upload.list = []
          const list = res.data.list
          list.forEach(v => {
            this.upload.list.push({ 'name': v.name })
          })
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .linkcs_create {
    margin: 26px;
    /* width: 500px; */
    /* margin: 0 auto; */
    /* background-color: lightblue; */
  }
</style>
