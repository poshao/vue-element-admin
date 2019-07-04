<template>
  <div class="linkcs_list">
    <el-tabs
      v-model="activePanel"
      @tab-click="handleTabClick"
    >
      <el-tab-pane
        label="全部订单"
        name="all"
      >
        <!-- 通用筛选条件 -->
        <div>
          紧急程度:
          <el-checkbox v-model="level_all">All</el-checkbox>
          <el-checkbox v-model="userFilter.level.normal">Normal</el-checkbox>
          <el-checkbox v-model="userFilter.level.grade_a">Grade A</el-checkbox>
          <el-checkbox v-model="userFilter.level.grade_b">Grade B</el-checkbox>
          <el-checkbox v-model="userFilter.level.grade_c">Grade C</el-checkbox>
        </div>
        <div>
          状态:
          <el-checkbox v-model="status_all">All</el-checkbox>
          <el-checkbox v-model="userFilter.status.pre_send">草稿</el-checkbox>
          <el-checkbox v-model="userFilter.status.sended">已发送</el-checkbox>
          <el-checkbox v-model="userFilter.status.lock">锁定</el-checkbox>
          <el-checkbox v-model="userFilter.status.pass">通过</el-checkbox>
          <el-checkbox v-model="userFilter.status.reject">未完成</el-checkbox>
          <el-checkbox v-model="userFilter.status.cancel">取消</el-checkbox>
          <el-checkbox v-model="userFilter.status.resend">已重发</el-checkbox>
          <el-checkbox v-model="userFilter.status.finish">完成</el-checkbox>
        </div>
        <div>
          创建时间:
          <el-date-picker
            v-model="userFilter.create_time.start"
            type="datetime"
            format="yyyy/MM/dd HH:mm"
            placeholder="选择开始时间"
          />-
          <el-date-picker
            v-model="userFilter.create_time.end"
            type="datetime"
            format="yyyy/MM/dd HH:mm"
            placeholder="选择结束时间"
          />
        </div>
        <div>
          单号:
          <el-input
            v-model="userFilter.orderno"
            type="text"
            style="width:300px"
          />
          <el-button
            type="primary"
            @click="handleSearch()"
          >搜索</el-button>
          <el-button
            type="default"
            @click="handleSearch(1)"
          >重置</el-button>
        </div>
        <br>
        <!-- 表格工具栏 -->
        <el-button-group style="margin-bottom:2px;">
          <el-button
            type="default"
            @click="handleSearch(1)"
          >刷新</el-button>
          <el-button
            type="info"
            @click="handleExport()"
          >导出</el-button>
        </el-button-group>
        <LinkcsList
          :rows="rows"
          :page-setting="pageSetting"
          @pageChange="handlePageChange"
          @on-showDetail="handleShow"
          @on-edit="handleEdit"
          @on-revoke="handleRevoke"
          @on-lock="handleLock"
          @on-accept="handleAccept"
          @on-reject="handleReject"
          @on-cancel="handleCancel"
          @on-resend="handleResend"
          @on-finish="handleFinish"
          @on-copy="handleCopy"
        />
      </el-tab-pane>
      <el-tab-pane
        label="我创建的订单"
        name="myRequest"
      >
        <LinkcsList
          :rows="rows"
          :page-setting="pageSetting"
          @pageChange="handlePageChange"
          @on-showDetail="handleShow"
          @on-lock="handleLock"
          @on-accept="handleAccept"
          @on-reject="handleReject"
          @on-cancel="handleCancel"
          @on-resend="handleResend"
          @on-finish="handleFinish"
        />
      </el-tab-pane>
      <el-tab-pane
        label="我受理的订单"
        name="myProcess"
      >
        <LinkcsList
          :rows="rows"
          :page-setting="pageSetting"
          @pageChange="handlePageChange"
          @on-showDetail="handleShow"
          @on-lock="handleLock"
          @on-accept="handleAccept"
          @on-reject="handleReject"
          @on-cancel="handleCancel"
          @on-resend="handleResend"
          @on-finish="handleFinish"
        />
      </el-tab-pane>
      <el-tab-pane
        label="高级筛选"
        name="advanceFilter"
      >
        <AdvanceFilter @on-filter="handleAdvanceFilter" />
        <LinkcsList
          :rows="rows"
          :page-setting="pageSetting"
          @pageChange="handlePageChange"
          @on-showDetail="handleShow"
          @on-lock="handleLock"
          @on-accept="handleAccept"
          @on-reject="handleReject"
          @on-cancel="handleCancel"
          @on-resend="handleResend"
          @on-finish="handleFinish"
        />
      </el-tab-pane>
      <!-- <el-tab-pane label="报表设置" name="reportSetting">
        <ReportSetting></ReportSetting>
      </el-tab-pane>-->
    </el-tabs>

    <!-- 详情呈现 -->
    <el-dialog
      :visible.sync="showDetail"
      :title="'订单明细 - '+selectedDetail.id"
      width="60"
    >
      <el-form
        ref="detail"
        :label-width="80"
        readonly
        style="max-height:600px;overflow-y:auto;"
      >
        <Container
          :ele="ele"
          :readonly="true"
        />
        <!-- 附件列表 -->
        <ul>
          <a
            v-for="item in selectedDetail.files"
            :key="item"
            href="javascript:void(0)"
            @click="handleDownload(item.name,item.hashname)"
          >
            <li>{{ item.name }}</li>
          </a>
        </ul>
      </el-form>
      <!-- <el-button
        type="info"
        style="width:100%;"
        @click="handleResend(ele)"
      >新建</el-button> -->
    </el-dialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import {
  clone,
  convertJson2Csv,
  downloadFile,
  downloadFile2,
  datetimeFormat
} from '@/utils/common'
import {
  listRequest,
  getFile,
  convertStoreData2ViewData,
  convertStore2Report,
  getFieldsFromViewStruct,
  resetAttchments
} from '@/api/linkcs'

import {
  getUserAvator
  // getSocketId
} from '../../api/auth'

export default {
  components: {
    'Container': () => import('./components/container.vue'),
    'LinkcsList': () => import('./components/linkcs-list'),
    // 'ReportSetting': () => import('./components/report-setting.vue'),
    'AdvanceFilter': () => import('./components/advance-filter.vue')
  },
  data() {
    return {

      // 分页设置
      pageSetting: {
        total: 1000,
        pageSize: 10,
        currentPage: 1
      },
      // 筛选条件
      userFilter: {
        level: {
          normal: true,
          grade_a: true,
          grade_b: true,
          grade_c: true
        },
        status: {
          pre_send: true,
          sended: true,
          lock: true,
          pass: true,
          reject: true,
          cancel: true,
          resend: true,
          finish: true
        },
        create_time: {
          start: '',
          end: ''
        },
        orderno: ''
      },

      // 列表请求配置
      list_option: {
      },

      ele: {},
      selectedDetail: {},
      showDetail: false,

      // 列表加载标识
      loading: false,
      // 列表明细
      rows: [],
      activePanel: 'all'
    }
  },
  computed: {
    // ...mapGetters(['notify']),
    'level_all': {
      get() {
        return this.userFilter.level.normal &&
          this.userFilter.level.grade_a &&
          this.userFilter.level.grade_b &&
          this.userFilter.level.grade_c
      },
      set(v) {
        this.userFilter.level.normal = v
        this.userFilter.level.grade_a = v
        this.userFilter.level.grade_b = v
        this.userFilter.level.grade_c = v
      }
    },
    'status_all': {
      get() {
        return this.userFilter.status.pre_send &&
          this.userFilter.status.sended &&
          this.userFilter.status.lock &&
          this.userFilter.status.pass &&
          this.userFilter.status.reject &&
          this.userFilter.status.cancel &&
          this.userFilter.status.resend &&
          this.userFilter.status.finish
      },
      set(v) {
        this.userFilter.status.pre_send = v
        this.userFilter.status.sended = v
        this.userFilter.status.lock = v
        this.userFilter.status.pass = v
        this.userFilter.status.reject = v
        this.userFilter.status.cancel = v
        this.userFilter.status.resend = v
        this.userFilter.status.finish = v
      }
    }
    // ...mapGetters(['notify'])
    // ...mapState({ notify: state => state.linkcs.notify })
  },
  mounted() {
    // 初始化通知组件
    // console.log(this.notify)

    // 消息处理
    // this.notify.addEventListener('message', this.handleNotify)

    this.handleRefresh()
  },
  beforeDestroy() {
    // 卸载通知组件
    // this.notify.removeEventListener('message', this.handleNotify)
  },
  methods: {
    ...mapActions([
      'handleListRequest',
      'handleAcceptOrder',
      'handleRejectOrder',
      'handleCancelOrder',
      'handleFinishOrder',
      'handleLockOrder',
      'handleRevokeOrder'
    ]),
    /**
     * 处理通知
     */
    handleNotify(event) {
      var data = JSON.parse(event.data)
      switch (data.action) {
        case 'request':
          this.handleRefresh()
          break
        case 'accept':
          this.handleRefresh()
          break
        case 'lock':
          // 消息通知
          console.log('lock')
          if (Notification.permission === 'granted') {
            // eslint-disable-next-line no-new
            new Notification('通知', {
              body: data.params.content,
              // tag: '2ue',
              icon: getUserAvator(data.params.workid),
              timestamp: 3000
            })
          } else if (Notification.permission !== 'denied') {
            Notification.requestPermission(function(permission) {
              // 如果用户同意，就可以向他们发送通知
              if (permission === 'granted') {
                // eslint-disable-next-line no-new
                new Notification('通知', {
                  body: data.params.content,
                  // tag: '2ue',
                  icon: getUserAvator(data.params.workid),
                  timestamp: 3000
                })
              }
            })
          }
          break
      }
    },
    /**
     * 处理分页变化
     */
    handlePageChange(curpage, pagesize) {
      this.handleRefresh()
    },
    /**
     * 获取文件的URL路径
     */
    handleDownload(filename, hashname) {
      getFile(filename, hashname).then(res => {
        downloadFile2(res)
      })
      // return getFileLink(filename, hashname)
    },
    // 处理高级筛选
    handleAdvanceFilter(filters) {
      // console.log('advance')
      // console.log(filters)
      var option = {}
      option.filters = []
      for (var key in filters) {
        var item = filters[key]
        option.filters.push({
          key: item.field,
          operator: item.operator,
          value: item.value
        })
      }
      this.handleRefresh(option)
    },
    // 处理重发
    handleResend(row) {
      resetAttchments(row.id).then(() => {
        var detail = JSON.parse(row.json_detail)
        detail.id = row.id
        detail.creator = row.creator
        detail.create_time = row.create_time
        detail.dnei = row.dnei
        detail.level = row.level
        detail.system = row.system

        var items = {
          title: '',
          type: 'null',
          value: null,
          more: clone(this.$store.getters.baseForm) // base_json
        }
        convertStoreData2ViewData(items.more, detail)

        // 添加订单号(标记重发)
        items.more.push({ 'id': 'parentid', 'value': detail.id })
        this.$router.push({ name: 'cs_new_request', params: { items: items }})
      })
    },
    // 处理复制
    handleCopy(row) {
      resetAttchments(row.id).then(() => {
        var detail = JSON.parse(row.json_detail)
        detail.id = row.id
        detail.creator = row.creator
        detail.create_time = row.create_time
        detail.dnei = row.dnei
        detail.level = row.level
        detail.system = row.system

        var items = {
          title: '',
          type: 'null',
          value: null,
          more: clone(this.$store.getters.baseForm) // base_json
        }
        convertStoreData2ViewData(items.more, detail)

        // 添加订单号(标记重发)
        // items.more.push({ 'id': 'parentid', 'value': detail.id })
        this.$router.push({ name: 'cs_new_request', params: { items: items }})
      })
    },
    // 处理选项卡切换
    handleTabClick(instance) {
      var option = {}
      switch (this.activePanel) {
        case 'all':
          this.handleRefresh()
          break
        case 'myRequest':// 我请求的订单
          option.filters = [{
            operator: 'in',
            key: 'creator',
            value: this.$store.state.user.workid
          }]
          break
        case 'myProcess':// 我受理的订单
          option.filters = [{
            operator: 'in',
            key: 'assign',
            value: this.$store.state.user.workid
          }]
          break
      }
      this.handleRefresh(option)
    },
    // 处理筛选任务
    handleSearch(reset) {
      // 重置查询
      if (reset !== undefined) {
        this.status_all = true
        this.level_all = true
        this.userFilter.create_time.start = ''
        this.userFilter.create_time.end = ''
        this.userFilter.orderno = ''
      }

      var levelValues = []
      for (var level_key in this.userFilter.level) {
        if (this.userFilter.level[level_key]) {
          levelValues.push(level_key)
        }
      }
      var statusValues = []
      for (var status_key in this.userFilter.status) {
        if (this.userFilter.status[status_key]) {
          statusValues.push(status_key)
        }
      }
      var option = {}
      option.filters = [{
        operator: 'in',
        key: 'level',
        value: levelValues
      }, {
        operator: 'in',
        key: 'status',
        value: statusValues
      }]
      if (this.userFilter.create_time.start !== '') {
        option.filters.push({
          operator: '>=',
          key: 'create_time',
          value: datetimeFormat(this.userFilter.create_time.start, 'yyyy/MM/dd hh:mm:ss')
        })
      }
      if (this.userFilter.create_time.end !== '') {
        option.filters.push({
          operator: '<=',
          key: 'create_time',
          value: datetimeFormat(this.userFilter.create_time.end, 'yyyy/MM/dd hh:mm:ss')
        })
      }
      if (this.userFilter.orderno !== '') {
        option.filters.push({
          operator: 'like',
          key: 'dnei',
          value: this.userFilter.orderno
        })
      }
      this.loading = true
      this.handleRefresh(option)
    },
    /**
     * 文件导出
     */
    handleExport() {
      // 抽离表格数据
      var mRows = []
      this.rows.forEach(v => {
        var row = {}
        convertStore2Report(JSON.parse(v.json_detail), clone(this.$store.getters.baseForm), row)
        // 增加时间等项
        row['dnei'] = v.dnei
        row['system'] = v.system
        row['level'] = v.level
        row['create_time'] = v.create_time
        row['assign_time'] = v.assign_time
        row['creator'] = v.creator
        row['assign'] = v.assign
        row['status'] = v.status
        row['reject_reason'] = v.reject_reason
        // 处理附件链接
        // var tmp_files = JSON.parse(v.json_detail).files
        // var tmp_fs = []
        // if (tmp_files) {
        //   tmp_files.forEach((v, k) => {
        //     tmp_fs.push(getFileLink(v.name, v.hashname))
        //   })
        // }
        // row['files'] = tmp_fs.join('\n')
        mRows.push(row)
      })

      // console.log(mRows)
      // 导出结构声明
      // var reportStruct = ['create_time', 'level', 'system', 'dnei', 'si_text', 'paytype', 'files']
      // 导出所有字段
      var reportStruct = ['create_time', 'assign_time', 'creator', 'assign']
      var dd = {}
      getFieldsFromViewStruct(this.$store.getters.baseForm, dd)
      for (var key in dd) {
        reportStruct.push(key)
      }
      // 转化成CSV
      var blob = convertJson2Csv(mRows, reportStruct)
      // 下载文件
      var filename = 'linkcs_report_' + new Date().getTime() + '.csv'
      downloadFile(blob, filename)
    },
    // handleTest (hid) {
    //   let option = {}
    //   switch (hid) {
    //     case 1:// 我的订单
    //       option.filters = [{
    //         operator: '=',
    //         key: 'creator',
    //         value: '8123456'
    //       }]
    //       break
    //     case 2:// 未处理订单
    //       option.filters = [{
    //         operator: '=',
    //         key: 'status',
    //         value: 'unknow'
    //       }]
    //       break
    //     case 3:// 分页测试
    //       option.page = {
    //         index: 1,
    //         count: 5
    //       }
    //       break
    //     case 4:// 虚拟列
    //       option.filters = [{
    //         operator: '=',
    //         key: 'type',
    //         value: 'self_collect'
    //       }]
    //       break
    //     case 5:// 排序
    //       option.sorts = [{
    //         key: 'system',
    //         order: 'desc'
    //       }, {
    //         key: 'id',
    //         order: 'asc'
    //       }]
    //       break
    //     case 6:
    //       option.filters = [{
    //         operator: '=',
    //         key: 'status',
    //         value: 'unknow'
    //       }, {
    //         operator: 'in',
    //         key: 'id',
    //         value: [10, 11, 12, 13, 14, 15]
    //       }]
    //       option.sorts = [{
    //         key: 'system',
    //         order: 'desc'
    //       }, {
    //         key: 'id',
    //         order: 'asc'
    //       }]
    //       break
    //   }
    //   this.loading = true
    //   this.handleRefresh(option)
    // },
    /**
     * 刷新列表
     */
    handleRefresh(option) {
      this.loading = true
      // console.log('开始刷新')
      // console.log(new Date())

      // 分页设置
      if (option === undefined) {
        option = {}
      }
      // 默认id倒序
      option.sorts = [
        { key: 'id', order: 'desc' }
      ]
      option.page = {
        index: this.pageSetting.currentPage - 1,
        count: this.pageSetting.pageSize
      }

      listRequest(option).then(res => {
        // this.handleListRequest(option).then(res => {
        // console.log(res)
        // console.log('接受数据')
        // console.log(new Date())
        // res = res.data
        var ll = res.data.list

        for (var i in ll) {
          // 转化单号显示
          var dnei_display = ll[i].dnei.slice(0, 3).join(',')
          var dnei_count = ll[i].dnei.length
          if (dnei_count > 3) {
            dnei_display += '等' + dnei_count + '个单号'
          }
          ll[i].dnei_v = dnei_display
          // d2.push(res.list[i])
        }
        ll.sort((a, b) => {
          return b.id - a.id
        })
        this.rows = ll
        this.pageSetting.total = res.data.total
        this.loading = false
        // console.log('转化完毕')
        // console.log(new Date())
      })
    },
    /**
     * 处理编辑(编辑完成后需要更新)
     */
    handleEdit(row) {
      resetAttchments(row.id).then(() => {
        var detail = JSON.parse(row.json_detail)
        detail.id = row.id
        detail.creator = row.creator
        detail.create_time = row.create_time
        detail.dnei = row.dnei
        detail.level = row.level
        detail.system = row.system

        var items = {
          title: '',
          type: 'null',
          value: null,
          more: clone(this.$store.getters.baseForm) // base_json
        }
        convertStoreData2ViewData(items.more, detail)

        // 添加订单号(标记编辑)
        items.more.push({ 'id': 'parentid', 'value': detail.id })
        this.$router.push({ name: 'cs_new_request', params: { items: items, type: 'update' }})
      })
    },
    /**
     * 撤销订单
     */
    handleRevoke(id) {
      this.handleRevokeOrder(id).then(() => {
        this.handleRefresh()
      })
    },
    handleLock(id) {
      this.handleLockOrder(id).then(res => {
        // this.notify.sendMessage('linkcs', 'lock', {
        //   workid: this.$store.state.user.workid, content: 'shipment id ' + id
        // })
        this.handleRefresh()
      })
    },
    handleAccept(id) {
      this.handleAcceptOrder(id).then(res => {
        // this.notify.sendMessage('linkcs', 'accept', id)
        this.handleRefresh()
      })
    },
    handleReject(row) {
      // console.log(row)
      // var reason = 'test'
      // 提示输入原因
      // var notify = this.notify
      // console.log(notify)
      // var username = this.$store.state.user.username
      this.handleRejectOrder({ 'orderid': row.id, 'reason': row.reason }).then(res => {
        // getSocketId(row.creator).then(res => {
        //   var sendlist = res.data.list

        //   // 发送通知
        //   notify.sendex('linkcs', 'post', sendlist,
        //     {
        //       icon: getUserAvator(this.$store.state.user.workid),
        //       title: row.dnei + '(' + row.id + ')',
        //       body: username + ' => ' + row.reason,
        //       orderid: row.id,
        //       reason: row.reason,
        //       username: username
        //     }
        //   )
        // })
        this.handleRefresh()
      })
    },
    handleCancel(id) {
      this.handleCancelOrder(id)
      this.handleRefresh()
    },
    handleFinish(id) {
      this.handleFinishOrder(id)
      this.handleRefresh()
    },
    handleShow(selectedRow) {
      // 加载提交用户及时间信息
      // 加载附件列表
      // 加载受理状态等信息

      // 修正受理人显示为0000000的问题
      if (selectedRow.assign_time === null) {
        selectedRow.assign = ''
      }

      this.selectedDetail = JSON.parse(selectedRow.json_detail)

      this.selectedDetail.id = selectedRow.id
      this.selectedDetail.creator = selectedRow.creator
      this.selectedDetail.create_time = selectedRow.create_time
      this.selectedDetail.dnei = selectedRow.dnei
      this.selectedDetail.level = selectedRow.level
      this.selectedDetail.system = selectedRow.system

      this.ele = {
        title: '',
        type: 'null',
        value: null,
        more: clone(this.$store.getters.baseForm) // base_json
      }
      convertStoreData2ViewData(this.ele.more, this.selectedDetail)
      // 添加状态信息
      var detail = [{
        id: 'undefined', required: false, type: 'textbox', title: '创建人', value: selectedRow.creator
      }, {
        id: 'undefined', required: false, type: 'textbox', title: '受理人', value: selectedRow.assign
      }, {
        id: 'undefined', required: false, type: 'textbox', title: '创建时间', value: selectedRow.create_time
      }, {
        id: 'undefined', required: false, type: 'textbox', title: '状态', value: selectedRow.status
      }, {
        id: 'undefined', required: false, type: 'areatext', title: '原因', value: selectedRow.reject_reason
      }
      ]
      this.ele.more = detail.concat(this.ele.more)
      // 刷新界面
      this.$set(this, 'ele', this.ele)

      this.showDetail = true
      this.$nextTick(() => {
        this.$refs['detail'].$el.scrollTop = 0
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .linkcs_list {
    margin: 26px;
  }
</style>
