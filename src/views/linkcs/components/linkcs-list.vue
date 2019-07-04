<template>
  <div>
    <el-table
      ref="tbl"
      height="30rem"
      :data="rows"
      border
      @on-row-dblclick="handleDetail"
    >
      <el-table-column type="selection" width="40" />
      <el-table-column prop="id" label="ID" width="80" sortable />
      <el-table-column label="DN/EI" min-width="120">
        <template slot-scope="{row}">
          <i v-if="row.has_attachment==='y'" class="fa fa-paperclip" />
          {{ row.dnei_v }}
        </template>
      </el-table-column>
      <el-table-column label="紧急程度" width="80">
        <template slot-scope="{row}">
          <b v-if="row.level==='normal'" style="color:gray;">Normal</b>
          <b v-else-if="row.level==='grade_a'" style="color:red;">Grade A</b>
          <b v-else-if="row.level==='grade_b'" style="color:orange;">Grade B</b>
          <b v-else-if="row.level==='grade_c'" style="color:lightblue;">Grade C</b>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="80">
        <template slot-scope="{row}">
          <!-- {{ scope.row.status }} -->
          <el-tag v-if="row.status==='pre_send'" type="info">草稿</el-tag>
          <el-tag v-else-if="row.status==='sended'" type="warning">已发送</el-tag>
          <el-tag v-else-if="row.status==='lock'" type="info">锁定</el-tag>
          <el-tag v-else-if="row.status==='pass'" type="success">通过</el-tag>
          <el-popover v-if="row.status==='reject'" trigger="hover" :content="row.reject_reason" placement="top-start">
            <el-tag slot="reference" type="danger">未完成</el-tag>
          </el-popover>
          <el-tag v-if="row.status==='resend'" type="warning" hit>已重发</el-tag>
          <el-tag v-else-if="row.status==='cancel'" type="danger" hit>取消</el-tag>
          <el-tag v-else-if="row.status==='finish'" type="success" hit>完成</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建人" width="80">
        <template slot-scope="{row}">
          <a href="javascript:void(0)" @click="handleUserDetail(row.creator)">{{ row.creator }}</a>
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="创建时间" width="98" />
      <el-table-column label="受理人" width="80">
        <template slot-scope="{row}">
          <a v-if="row.assign_time!==null" href="javascript:void(0)" @click="handleUserDetail(row.assign)">{{ row.assign }}</a>
        </template>
      </el-table-column>
      <el-table-column prop="assign_time" label="受理时间" width="98" />

      <!-- <el-table-column v-for="col in columns" :key="col.key" :prop="col.key" :label="col.title" :width="col.width" /> -->
      <el-table-column label="操作" width="230">
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
              @click="handleLock(row.id)"
            >锁定</el-button>

            <el-button
              v-if="row.status==='lock'"
              type="success"
              @click="handleAccept(row.id)"
            >通过</el-button>
            <el-button
              v-if="row.status==='lock'"
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

            <el-button
              v-if="row.status==='pass'"
              type="success"
              @click="handleFinish(row.id)"
            >完成</el-button>

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
      :page-sizes="[10, 30, 50, 100]"
      :page-size.sync="pageSetting.pageSize"
      layout="prev,next,jumper,sizes"
      :total="pageSetting.total"
      @size-change="handlePageSizeChange"
      @current-change="handleCurrentChange"
    />
    <el-dialog :visible.sync="reject.showReason" title="原因">
      <el-input v-model="reject.reason" placeholder="拒绝原因" autofocus @keydown.enter.native="handleRejectReason" />
      <div slot="footer">
        <el-button @click="reject.showReason = false">取 消</el-button>
        <el-button type="primary" @click="handleRejectReason">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="userDetail.show" title="用户信息" :footer-hide="true">
      <img :src="userDetail.avatorurl" class="user-avator">
      <p>用户: {{ userDetail.username }}</p>
      <p>邮箱: {{ userDetail.email }}</p>
      <p>电话: {{ userDetail.phone }}</p>
    </el-dialog>
  </div>
</template>

<script>
import { getUserInfo, getUserAvator } from '../../../api/auth'

export default {
  name: 'LinkcsList',
  props: {
    rows: {
      default() {
        return []
      },
      type: Array
    },
    // 分页控制
    pageSetting: {
      default() {
        return { currentPage: 1 }
      },
      type: Object
    }
  },
  data() {
    return {
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
      }
    }
  },
  methods: {
    /**
     * 处理分页变化
     */
    handlePageSizeChange(v) {
      this.$emit('pageChange', this.pageSetting.currentPage, this.pageSetting.pageSize)
    },
    handleCurrentChange(v) {
      this.$emit('pageChange', this.pageSetting.currentPage, this.pageSetting.pageSize)
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
    handleAccept(id_list) {
      if (Array.isArray(id_list)) {
        id_list.forEach(id => {
          this.$emit('on-accept', id)
        })
      } else {
        this.$emit('on-accept', id_list)
      }
    },
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
        this.$emit('on-reject', Object.assign({ 'reason': reason }, row))
        this.reject.showReason = false
      })
    },
    handleCopy(row) {
      this.$emit('on-copy', row)
    },
    handleRevoke(id) {
      this.$emit('on-revoke', id)
    },
    handleLock(id) {
      this.$emit('on-lock', id)
    },
    handleCancel(id) {
      this.$emit('on-cancel', id)
    },
    handleResend(row) {
      this.$emit('on-resend', row)
    },
    handleFinish(id) {
      this.$emit('on-finish', id)
    },
    handleEdit(row) {
      this.$emit('on-edit', row)
    },
    /**
     * 详情
     */
    handleDetail(row) {
      // console.log(row)
      // console.log(row.assign)
      this.$emit('on-showDetail', row)
    }
  }
}
</script>
