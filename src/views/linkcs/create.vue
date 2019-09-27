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

          <MControl :ele="ele" />
          <!-- <Container :ele="ele" /> -->

          <el-upload
            :action="upload.url"
            drag
            multiple
            max-size="20000"
            :limit="10"
            :headers="{'xtoken':this.$store.state.user.token}"
            :file-list="upload.list"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-exceed="handleExceedCount"
            :before-upload="handleCheckFileSize"
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
// import Container from './components/container.vue'
// import { mapActions } from 'vuex'
import { createNamespacedHelpers } from 'vuex'
const { mapActions } = createNamespacedHelpers('linkcs')
import { downloadFile2 } from '@/utils/common'
import {
  getStoreData,
  fillStoreData
} from '@/utils/linkcs'
// import { deepClone } from '@/utils/index'
import {
  listUploadedFiles,
  removeFile,
  // convertViewData2StoreData,
  resetAttchments
} from '@/api/linkcs'

export default {
  components: {
    // 'Container': Container,
    'MControl': () => import('./components/mcontrol')
    // 'OrderInput': () => import('./components/order-input.vue')
  },
  data() {
    return {
      ele: {
        control: {
          type: 'layout',
          children: {
            'layout': this.$store.getters['linkcs/baseForm']
          }
        }
        // value:'layout'
      },
      upload: {
        url: this.$store.getters['linkcs/uploadUrl'],
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
    ...mapActions(['handleNewRequest', 'handleListRequest', 'handleGetFile', 'getStoreData']),
    handleOrderInputSubmit(order) {
      this.orders = order
    },
    handleExceedCount(file) {
      this.$message({ message: file.name + '上传失败，最多支持同时上传10个附件', type: 'warnning' })
    },
    handleCheckFileSize(file) {
      // console.log(file)
      if (file.size > 5 * 1024 * 1024) {
        this.$message({ message: file.name + '上传失败，附件单个最大支持5MB', type: 'warnning' })
        file.exceedsize = true
        return false
      }
    },
    handlePreview(file) {
      this.handleGetFile(file.name).then(res => {
        downloadFile2(res)
      })
    },
    handleRemove(file) {
      // console.log(file)
      if (file.raw.exceedsize === undefined) {
        removeFile(file.name).then(res => {
          this.$message({ message: '删除成功' })
        })
      }
    },
    handleSubmit() {
      try {
        const detail = getStoreData(this.ele.children)

        this.handleNewRequest(detail).then(res => {
          this.$message({ message: '提交成功', type: 'success' })
          this.$router.replace({ name: 'linkcs_list' })
        })
      } catch (e) {
        this.$message({ type: 'error', message: e.message, duration: 3000 })
        // console.log(e)
      }
    },
    /**
     * 初始化表单
     */
    resetData(item) {
      let ii = {
        control: {
          type: 'layout',
          children: {
            'layout': this.$store.getters['linkcs/baseForm']
          }
        }
        // value:'layout'
      }
      if (item !== undefined) {
        ii = fillStoreData(ii, item)
      }

      // console.log('item')
      // console.log(item)
      // console.log('view')
      // console.log(ii)

      this.$set(this, 'ele', ii)
      // 重置附件
      if (item === undefined) {
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
