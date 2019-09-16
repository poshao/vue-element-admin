<template>
  <div class="linck_list">
    <!-- 筛选面板 -->
    <div style="float:left;">
      <TableFilter @change="handleFilterChange" />
      <!-- <el-input v-model="searchText" placeholder="单号快速搜索" clearable style="width:12rem;" @keyup.enter.native="handleQuickSearch" @clear="handleQuickSearch">
        <i slot="prefix" class="el-input__icon" style="display:inline-block;text-align:center;"><svg-icon icon-class="search" /></i>
      </el-input> -->
      <span>|</span>
      <el-input v-model="quickSearch.orderno" placeholder="单号快速搜索" clearable style="width:12rem;" @keyup.enter.native="handleQuickSearch" @clear="handleQuickSearch">
        <i slot="prefix" class="el-input__icon" style="display:inline-block;text-align:center;"><svg-icon icon-class="search" /></i>
      </el-input>
      <span>|</span>

      <!-- 子筛选条件 -->
      <el-select v-model="quickSearch.system" placeholder="系统" style="width:8rem" clearable>
        <el-option key="phx" value="phx" label="PHX" />
        <el-option key="trim" value="trim" label="TRIM" />
        <el-option key="mixed" value="mixed" label="Mixed" />
      </el-select>
      <el-select v-model="quickSearch.shiptype" placeholder="出货类型" style="width:10rem" clearable>
        <el-option key="llkk_local" value="llkk_local" label="LLKK Local" />
        <el-option key="llkk_oversea" value="llkk_oversea" label="LLKK Oversea" />
        <el-option key="vat_fty" value="vat_fty" label="VAT & FTY" />
      </el-select>
      <el-button type="primary" @click="handleQuickSearch">搜索</el-button>
    </div>

    <div class="tab-tools">
      <!-- 批量操作按钮 -->
      <el-dropdown
        v-if="multiAction.enable"
        trigger="click"
        split-button
        :type="multiAction.cur.type"
        @click="handleMultiActionClick"
        @command="handleMultiActionCommand"
      >
        {{ multiAction.cur.title }}
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(v,k,i) in multiAction.list" :key="i" :command="k" style="margin-bottom:4px;">
            <span>{{ v.title }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button-group>
        <el-button title="刷新" @click="handleRefresh()"><svg-icon icon-class="sync" /></el-button>
        <!-- <el-button title="字段" @click="handleColumnSelect"><svg-icon icon-class="table" /></el-button> -->
        <el-button title="下载当前页" @click="handleDownload"><svg-icon icon-class="download" /></el-button>
      </el-button-group>
    </div>
    <el-table
      ref="tbl"
      height="calc(100vh - 14rem)"
      :data="rows"
      border
      @on-row-dblclick="handleDetail"
      @selection-change="handleSelectChange"
    >
      <el-table-column type="selection" width="40" fixed />
      <el-table-column prop="id" label="ID" width="60" sortable align="center" />
      <el-table-column prop="dnei" label="DN/EI" min-width="300" sortable :formatter="(row)=>{return row.dnei_v}">
        <template slot-scope="{row}">
          <svg-icon v-if="row.has_attachment==='y'" icon-class="attachment" />
          {{ row.dnei_v }}
        </template>
      </el-table-column>
      <el-table-column prop="level" label="紧急程度" width="110" sortable :formatter="(row)=>{return row.level}" align="center">
        <template slot-scope="{row}">
          <b v-if="row.level==='normal'" style="color:gray;">Normal</b>
          <b v-else-if="row.level==='grade_a'" style="color:red;">Grade A</b>
          <b v-else-if="row.level==='grade_b'" style="color:orange;">Grade B</b>
          <b v-else-if="row.level==='grade_c'" style="color:lightblue;">Grade C</b>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="80" sortable align="center">
        <template slot-scope="{row}">
          <!-- {{ scope.row.status }} -->
          <el-tag v-if="row.status==='pre_send'" type="info">草稿</el-tag>
          <el-tag v-else-if="row.status==='sended'" type="warning">已发送</el-tag>
          <!-- <el-tag v-else-if="row.status==='lock'" type="info">锁定</el-tag> -->
          <el-tag v-else-if="row.status==='received'" type="info">已接收</el-tag>
          <!-- <el-tag v-else-if="row.status==='pass'" type="success">通过</el-tag> -->
          <el-tag v-else-if="row.status==='finish'" type="success" hit>完成</el-tag>
          <el-popover v-if="row.status==='reject'" trigger="hover" :content="row.reject_reason" placement="top-start">
            <el-tag slot="reference" type="danger">未完成</el-tag>
          </el-popover>
          <el-tag v-if="row.status==='resend'" type="warning" hit>已重发</el-tag>
          <el-tag v-else-if="row.status==='cancel'" type="danger" hit>取消</el-tag>
        </template>
      </el-table-column>

      <el-table-column
        prop="system"
        label="系统"
        width="90"
        :formatter="(row)=>{return row.system}"
        sortable
      />

      <el-table-column
        prop="shiptype"
        label="出货类型"
        width="100"
        :formatter="(row)=>{return JSON.parse(row.json_detail).ship_type}"
        sortable
        :sort-method="handleShipTypeSort"
      />

      <el-table-column prop="reject_reason" label="拒绝原因" width="100" :formatter="(row)=>{return row.reject_reason}" />

      <el-table-column prop="creator" label="创建人" width="90" sortable>
        <template slot-scope="{row}">
          <a href="javascript:void(0)" @click="handleUserDetail(row.creator)">{{ row.creator }}</a>
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="创建时间" width="150" sortable :sort-method="handleCreateTimeSort" />
      <el-table-column prop="assign" label="受理人" width="90" sortable>
        <template slot-scope="{row}">
          <a v-if="row.assign_time!==null" href="javascript:void(0)" @click="handleUserDetail(row.assign)">{{ row.assign }}</a>
        </template>
      </el-table-column>
      <el-table-column prop="assign_time" label="受理时间" width="150" sortable :sort-method="handleAssignTimeSort" />

      <!-- <el-table-column v-for="col in columns" :key="col.key" :prop="col.key" :label="col.title" :width="col.width" /> -->
      <el-table-column label="操作" width="230" fixed="right">
        <template slot-scope="{row}">
          <el-button-group>
            <el-button
              v-if="row.status==='pre_send'"
              type="primary"
              @click="handleEdit(row)"
            >编辑</el-button>

            <el-button
              v-if="row.status==='sended'"
              type="error"
              @click="handleRevoke(row.id)"
            >撤销</el-button>
            <el-button
              v-if="row.status==='sended'"
              type="success"
              @click="handleReceive(row.id)"
            >接收</el-button>
            <!--
            <el-button
              v-if="row.status==='received'"
              type="success"
              @click="handleFinish(row.id)"
            >通过</el-button> -->

            <el-button
              v-if="row.status==='received'"
              type="success"
              @click="handleFinish(row.id)"
            >完成</el-button>
            <el-button
              v-if="row.status==='received'"
              type="danger"
              @click="handleReject(row)"
            >拒绝</el-button>

            <el-button
              v-if="row.status==='reject' || row.status==='pre_send' "
              type="danger"
              @click="handleCancel(row.id)"
            >取消</el-button>
            <el-button
              v-if="row.status==='reject'"
              type="primary"
              @click="handleResend(row)"
            >重发</el-button>

            <el-button type="info" @click="handleDetail(row)">详情</el-button>

            <el-button
              v-if="row.status=='finish' || row.status=='cancel' || row.status=='resend'"
              type="warning"
              @click="handleCopy(row)"
            >复制</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页控件 -->
    <el-pagination
      :current-page.sync="pageSetting.currentPage"
      :page-sizes="[30, 50, 100, 500]"
      :page-size.sync="pageSetting.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageSetting.total"
      @size-change="handlePageChange"
      @current-change="handlePageChange"
    />

    <!-- 拒绝原因 -->
    <el-dialog :visible.sync="reject.showReason" title="原因">
      <el-input v-model="reject.reason" placeholder="拒绝原因" autofocus @keydown.enter.native="handleRejectReason" />
      <div slot="footer">
        <el-button @click="reject.showReason = false">取 消</el-button>
        <el-button type="primary" @click="handleRejectReason">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 用户信息 -->
    <el-dialog :visible.sync="userDetail.show" title="用户信息" :footer-hide="true">
      <img :src="userDetail.avatorurl" class="user-avator">
      <p>用户: {{ userDetail.username }}</p>
      <p>邮箱: {{ userDetail.email }}</p>
      <p>电话: {{ userDetail.phone }}</p>
    </el-dialog>

    <!-- 详情呈现 -->
    <el-dialog :visible.sync="showDetail" :title="'订单明细 - '+selectedDetail.id" width="60">
      <el-form
        ref="detail"
        :label-width="80"
        readonly
        style="max-height:600px;overflow-y:auto;"
      >
        <MControl
          :ele="ele"
          :readonly="true"
        />
        <!-- 附件列表 -->
        <ul>
          <a
            v-for="item in selectedDetail.files"
            :key="item"
            href="javascript:void(0)"
            @click="handleDownloadAttachment(item.name,item.hashname)"
          >
            <li>{{ item.name }}</li>
          </a>
        </ul>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone } from '@/utils/index'
import { getUserInfo, getUserAvator } from '@/api/auth'
import { createNamespacedHelpers } from 'vuex'
const { mapActions } = createNamespacedHelpers('linkcs')
import { fillStoreData } from '@/utils/linkcs'
import {
  listRequest,
  resetAttchments
} from '@/api/linkcs'
import { isArray } from 'util'

export default {
  name: 'LinkcsList',
  components: {
    'MControl': () => import('./components/mcontrol'),
    'TableFilter': () => import('./components/table-filter')
  },
  data() {
    return {
      // 批量操作
      multiAction: {
        cur: {
          cmd: 'recv',
          title: '批量接收',
          type: 'success'
        },
        selection_id: [],
        list: {
          'undo': { title: '批量撤销', type: 'default' },
          'recv': { title: '批量接收', type: 'success' },
          'cancel': { title: '批量取消', type: 'danger' },
          'finish': { title: '批量完成', type: 'success' }
        },
        title: '接收',
        type: 'primary',
        enable: false
      },

      // 当前筛选条件
      activeFilter: null,
      // 子筛选条件
      quickSearch: {
        system: '',
        shiptype: '',
        // 快速搜索
        orderno: ''
      },

      // 显示用户信息
      userDetail: {
        show: false,
        username: '',
        email: '',
        phone: '',
        avatorurl: ''
      },
      // 拒绝控制
      reject: {
        showReason: false,
        reason: '',
        rows: []
      },
      // 分页设置
      pageSetting: {
        total: 1000,
        pageSize: 10,
        currentPage: 1
      },

      // // 列表请求配置
      // list_option: {
      // },

      ele: {},
      selectedDetail: {},
      showDetail: false,

      // 列表加载标识
      loading: false,
      // 列表明细
      rows: []
    }
  },
  mounted() {
    // if(this.$route.query!==undefined){
    // console.log(this.$route.query)
    this.handleRefresh(this.$route.query.orderid)
    // }else{
    //   this.handleRefresh()
    // }
  },
  methods: {
    ...mapActions([
      'handleListRequest',
      // 'handleAcceptOrder',
      'handleRejectOrder',
      'handleCancelOrder',
      'handleFinishOrder',
      // 'handleLockOrder',
      'handleReceiveOrder',
      'handleRevokeOrder'
    ]),
    // 批量操作处理
    handleMultiActionClick() {
      var ids = this.multiAction.selection_id
      switch (this.multiAction.cur.cmd) {
        case 'undo':
          this.handleRevoke(ids)
          break
        case 'recv':
          this.handleReceive(ids)
          break
        case 'cancel':
          this.handleCancel(ids)
          break
        case 'finish':
          this.handleFinish(ids)
          break
      }
    },
    handleMultiActionCommand(v) {
      this.multiAction.cur.cmd = v
      this.multiAction.cur.title = this.multiAction.list[v].title
      this.multiAction.cur.type = this.multiAction.list[v].type
      // this.handleMultiActionClick()
    },
    handleSelectChange(v) {
      this.multiAction.enable = false
      if (v.length > 0) {
        this.multiAction.enable = true
      }

      this.multiAction.selection_id = []
      v.forEach(v2 => {
        this.multiAction.selection_id.push(v2.id)
      })
      // this.multiAction.selection=v
    },
    // 字段排序
    handleShipTypeSort(a, b) {
      const s1 = JSON.parse(a.json_detail).ship_type
      const s2 = JSON.parse(b.json_detail).ship_type
      if (s1 < s2) return -1
      if (s1 > s2) return 1
      return 0
    },
    handleCreateTimeSort(a, b) {
      if (a.create_time === null) {
        return -1
      }
      if (b.create_time === null) {
        return 1
      }
      return new Date(a.create_time) - new Date(b.create_time)
    },
    handleAssignTimeSort(a, b) {
      if (a.assign_time === null) {
        return -1
      }
      if (b.assign_time === null) {
        return 1
      }
      return new Date(a.assign_time) - new Date(b.assign_time)
    },
    /**
     * 筛选事件响应
     */
    handleFilterChange(filter) {
      // 解析筛选条件 并 刷新列表

      // console.log(filter)
      if (filter === null) {
        this.activeFilter = null
      } else {
        const filters = {
          and: []
        }
        for (const key in filter.condition) {
          filters.and.push(filter.condition[key])
        }
        this.activeFilter = filters
      }
      this.pageSetting.currentPage = 1
      this.handleRefresh()

      // console.log('filter change')
      // console.log(filter)
    },
    /**
     * 搜索事件响应
     */
    handleQuickSearch() {
      this.pageSetting.currentPage = 1
      this.handleRefresh()
    },
    /**
     * 刷新列表
     */
    handleRefresh(orderid) {
      this.loading = true
      // console.log('开始刷新')
      // console.log(new Date())

      const option = {}

      if (orderid !== undefined) {
        option.filter = {
          and: [
            { key: 'id', op: '=', val: orderid }
          ]
        }
      } else {
        if (this.$route.query.orderid !== undefined) {
          this.$router.replace({ name: 'linkcs_list' })
        }
        // 添加筛选条件
        if (this.activeFilter !== null) {
          option.filter = deepClone(this.activeFilter)
        }

        // 添加搜索条件
        if (option.filter === undefined) {
          option.filter = { and: [] }
        }
        if (this.quickSearch.orderno !== '') {
          option.filter.and.push({ key: 'dnei', op: 'like', val: this.quickSearch.orderno })
        }
        if (this.quickSearch.system !== '') {
          option.filter.and.push({ key: 'system', op: '=', val: this.quickSearch.system })
        }
        if (this.quickSearch.shiptype !== '') {
          option.filter.and.push({ key: 'ship_type', op: '=', val: this.quickSearch.shiptype })
        }

        // 添加分页设置
        option.pagebreak = {
          index: this.pageSetting.currentPage - 1,
          size: this.pageSetting.pageSize
        }

        // 添加排序设置
        option.sort = {
          id: 'desc'
        }
      }
      // 结果渲染
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
     * 处理下载当前页面
     */
    handleDownload() {
      this.$store.dispatch('linkcs/exportTable', this.rows)
    },
    /**
     * 处理分页变化
     */
    handlePageChange(v) {
      // this.$emit('pageChange', this.pageSetting.currentPage, this.pageSetting.pageSize)
      this.handleRefresh()
    },
    /**
     * 处理显示用户详情
     */
    handleUserDetail(workid) {
      this.userDetail.show = false
      this.userDetail.username = ''
      this.userDetail.email = ''
      this.userDetail.phone = ''
      this.userDetail.avatorurl = getUserAvator(workid)
      getUserInfo(workid).then(res => {
        const data = res.data.userinfo
        this.userDetail.username = data.username
        this.userDetail.email = data.email
        this.userDetail.phone = data.phone
        this.userDetail.show = true
      })
    },
    /**
     * 处理受理操作
     */
    // handleAccept(id) {
    //   this.handleAcceptOrder(id).then(res => {
    //     this.handleRefresh()
    //   })
    // },
    /**
     * 拒绝
     */
    handleReject(row) {
      this.reject.rows = []
      this.reject.rows.push(row)
      this.reject.reason = ''
      this.reject.showReason = true
    },
    handleRejectReason() {
      const reason = this.reject.reason
      this.reject.rows.forEach(row => {
      // 提示输入原因
        this.handleRejectOrder({ 'orderid': row.id, 'reason': reason }).then(res => {
          this.handleRefresh()
        })
        // this.$emit('on-reject', Object.assign({ 'reason': reason }, row))
        this.reject.showReason = false
      })
    },
    handleRevoke(id) {
      if (!isArray(id)) {
        id = [id]
      }
      var ps = []
      id.forEach(v => {
        ps.push(this.handleRevokeOrder(v))
      })
      Promise.all(ps).finally(res => {
        this.handleRefresh()
      })
    },
    // handleLock(id) {
    //   // this.$emit('on-lock', id)
    //   this.handleLockOrder(id).then(res => {
    //     this.handleRefresh()
    //   })
    // },
    handleReceive(id) {
      if (!isArray(id)) {
        id = [id]
      }
      var ps = []
      id.forEach(v => {
        ps.push(this.handleReceiveOrder(v))
      })
      Promise.all(ps).finally(res => {
        this.handleRefresh()
      })
    },
    handleCancel(id) {
      if (!isArray(id)) {
        id = [id]
      }
      var ps = []
      id.forEach(v => {
        ps.push(this.handleCancelOrder(v))
      })
      Promise.all(ps).finally(res => {
        this.handleRefresh()
      })
    },
    handleFinish(id) {
      if (!isArray(id)) {
        id = [id]
      }
      var ps = []
      id.forEach(v => {
        ps.push(this.handleFinishOrder(v))
      })
      Promise.all(ps).finally(res => {
        this.handleRefresh()
      })
    },
    handleResend(row) {
      // this.$emit('on-resend', row)
      resetAttchments(row.id).then(() => {
        var detail = JSON.parse(row.json_detail)
        detail.id = row.id
        detail.creator = row.creator
        detail.create_time = row.create_time
        detail.dnei = row.dnei
        detail.level = row.level
        detail.system = row.system
        this.$router.push({ name: 'cs_new_request', params: { items: detail }})
      })
    },
    handleCopy(row) {
      resetAttchments(row.id).then(() => {
        var detail = JSON.parse(row.json_detail)
        detail.id = row.id
        detail.creator = row.creator
        detail.create_time = row.create_time
        detail.dnei = row.dnei
        detail.level = row.level
        detail.system = row.system

        this.$router.push({ name: 'cs_new_request', params: { items: detail }})
      })
    },
    /**
     * 处理编辑(编辑完成后需要更新)
     */
    handleEdit(row) {
      // this.$emit('on-edit', row)
      resetAttchments(row.id).then(() => {
        var detail = JSON.parse(row.json_detail)
        detail.id = row.id
        detail.creator = row.creator
        detail.create_time = row.create_time
        detail.dnei = row.dnei
        detail.level = row.level
        detail.system = row.system

        this.$router.push({ name: 'cs_new_request', params: { items: detail, type: 'update' }})
      })
    },
    /**
     * 详情
     */
    handleDetail(selectedRow) {
      // this.$emit('on-showDetail', row)
      // 加载提交用户及时间信息
      // 加载附件列表
      // 加载受理状态等信息

      // 修正受理人显示为0000000的问题
      if (selectedRow.assign_time === null) {
        selectedRow.assign = ''
      }
      var detail = JSON.parse(selectedRow.json_detail)
      detail.id = selectedRow.id
      detail.creator = selectedRow.creator
      detail.create_time = selectedRow.create_time
      detail.dnei = selectedRow.dnei
      detail.level = selectedRow.level
      detail.system = selectedRow.system
      detail.reject_reason = selectedRow.reject_reason
      this.selectedDetail = detail
      let control = {
        readonly: true,
        control: {
          type: 'layout',
          children: {
            'layout': this.$store.getters['linkcs/baseForm']
          }
        }
      }

      control = fillStoreData(control, detail)

      // 刷新界面
      this.$set(this, 'ele', control)

      this.showDetail = true
      this.$nextTick(() => {
        this.$refs['detail'].$el.scrollTop = 0
      })
    },
    /**
     * 获取文件的URL路径
     */
    handleDownloadAttachment(filename, hashname) {
      this.$store.dispatch('linkcs/downloadAttachment', { filename: filename, hashname: hashname })
    }
  }
}
</script>

<style lang="scss" scoped>
  .tab-tools{
    float: right;
    padding-bottom: 0.5rem;
  }
  .dialog-filter{
    padding:0
  }
  .linck_list{
    margin: 20px;
  }
</style>
