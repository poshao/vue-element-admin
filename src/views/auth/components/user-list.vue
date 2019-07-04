<template>
  <div>
    <el-button-group style="margin-bottom:2px;">
      <el-button type="default" icon="fa fa-refresh" @click="handleRefresh">刷新</el-button>
      <el-button type="primary" icon="fa fa-user-plus" @click="handleCreate">新建</el-button>
    </el-button-group>
    <el-table :data="data">
      <el-table-column v-for="col in column" :key="col.key" :prop="col.key" :label="col.title" :width="col.width" />
      <el-table-column label="操作" width="300">
        <template slot="header" slot-scope="scope">
          <el-input
            v-model="search"
            placeholder="输入工号搜索"
            clearable
            @keyup.enter.native="handleSearch"
            @clear="handleSearch"
          />
          <input type="hidden" :value="scope">
        </template>
        <template slot-scope="{row}">
          <el-button-group>
            <el-button icon="fa fa-pencil" @click="handleEditAction(row)">修改</el-button>
            <el-button icon="fa fa-users" @click="handleGroupAction(row)">分组</el-button>
            <el-button icon="fa fa-user-md" @click="handleRoleAction(row)">角色</el-button>
            <el-button type="danger" icon="fa fa-unlock-alt" @click="handleResetPassword(row)">重置</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page.sync="pageSetting.currentPage"
      :page-sizes="[10, 30, 50, 100]"
      :page-size.sync="pageSetting.pageSize"
      layout="prev,next,jumper,sizes"
      :total="pageSetting.total"
      @size-change="handlePageChange"
      @current-change="handlePageChange"
    />
    <el-dialog
      :visible.sync="groupPanel.show"
      title="分组分配"
      :mask-closable="false"
      :footer-hide="true"
      :width="'860px'"
    >
      <p>
        选中用户名:
        <b>{{ selectUser.username }}</b>
        ({{ selectUser.id }})
      </p>
      <p>{{ selectUser.depart }}</p>
      <el-transfer
        v-model="groupPanel.selectGroups"
        :titles="['可选分组','有效分组']"
        :data="groupPanel.list"
        filterable
        @change="handleGroupChange"
      />
    </el-dialog>
    <el-dialog
      :visible.sync="rolePanel.show"
      title="角色分配"
      :mask-closable="false"
      :width="'860px'"
    >
      <p>
        选中用户名:
        <b>{{ selectUser.username }}</b>
        ({{ selectUser.id }})
      </p>
      <p>{{ selectUser.depart }}</p>
      <el-transfer
        v-model="rolePanel.selectRoles"
        :titles="['可选角色','有效角色']"
        :data="rolePanel.list"
        filterable
        @change="handleRoleChange"
      />
    </el-dialog>
    <el-dialog :visible.sync="createUserPanel.show" title="用户注册" :close-on-click-modal="false">
      <el-form ref="registerForm" :model="createUserPanel">
        <el-form-item label="工号">
          <el-input v-model="createUserPanel.workid" type="text" placeholder="请输入工号" autofocus />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="createUserPanel.password" type="password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="确认">
          <el-input v-model="createUserPanel.confirm" type="password" placeholder="请再次输入密码" />
        </el-form-item>
        <el-button type="primary" style="width:100%;" @click="handleRegister">注册</el-button>
      </el-form>
    </el-dialog>
    <el-dialog :visible.sync="editPanel.show" title="资料编辑" :width="'280px'">
      <div slot="title">
        {{ selectUser.workid }}({{ selectUser.username }})
      </div>
      <el-form :model="editPanel">
        <el-form-item label="部门">
          <el-select v-model="editPanel.depart" style="width:100%">
            <el-option v-for="(v) in editPanel.departs" :key="v" :value="v" :label="v" />
          </el-select>
        </el-form-item>
        <el-button type="primary" style="width:100%;" @click="handleUpdateUserInfo">更新</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  listUsers,
  listGroups,
  listRoles,
  listGroupsByUser,
  listRolesByUser,
  linkUserRole,
  linkUserGroup,
  register,
  resetPassword,
  updateUserLimitInfo
} from '@/api/auth'
import { generatePassword } from '@/utils/common'
export default {
  name: 'UserList',
  data() {
    return {
      // 关键字搜索
      search: '',
      pageSetting: {
        currentPage: 0,
        pageSize: 100,
        total: 1000
      },
      selectUser: {},
      createUserPanel: {
        show: false,
        workid: '',
        password: '',
        confirm: ''
      },
      groupPanel: {
        show: false,
        list: [],
        selectGroups: []
      },
      rolePanel: {
        show: false,
        list: [],
        selectRoles: []
      },
      editPanel: {
        show: false,
        depart: '',
        departs: ['Logistics', 'CS']
      },
      column: [{
        title: 'ID',
        key: 'id',
        width: 80,
        align: 'center'
      }, {
        title: '工号',
        key: 'workid',
        width: 120,
        align: 'center'
      }, {
        title: '用户名',
        key: 'username',
        width: 160,
        align: 'center'
      }, {
        title: '部门',
        key: 'depart',
        width: 120,
        align: 'center'
      },
      {
        title: '创建时间',
        key: 'create_time',
        width: 100
      }, {
        title: '更新时间',
        key: 'update_time',
        width: 100
      }],
      data: []
    }
  },
  mounted() {
    this.handleRefresh()
  },
  methods: {
    handleChange(event) {
      console.log(event)
    },
    /**
     * 搜索处理
     */
    handleSearch() {
      console.log(this.search)
      var option = {
        filters: [{
          operator: 'like',
          key: 'workid',
          value: this.search
        }]
      }
      this.handleRefresh(option)
    },
    /**
     * 分页处理
     */
    handlePageChange(v) {
      this.handleRefresh()
    },
    handlePageSizeChange(v) {
      this.$emit('pageChange', this.pageSetting.currentPage, this.pageSetting.pageSize)
    },
    handleCurrentChange(v) {
      this.$emit('pageChange', this.pageSetting.currentPage, this.pageSetting.pageSize)
    },
    // 更新用户信息
    handleUpdateUserInfo() {
      updateUserLimitInfo(this.selectUser.workid, { 'depart': this.editPanel.depart }).then(res => {
        this.editPanel.show = false
        this.handleRefresh()
      })
    },
    // 刷新列表
    handleRefresh(option) {
      if (option === undefined) {
        option = {}
      }

      option.page = {
        index: this.pageSetting.currentPage - 1,
        count: this.pageSetting.pageSize
      }

      listUsers(option).then(res => {
        this.data = res.data.users.list
        this.pageSetting.total = res.data.users.total
      })
    },
    // 重置密码
    handleResetPassword(user) {
      this.$confirm('确定重置' + user.username + '(' + user.workid + ')的密码?', '密码重置', {
        showClose: false,
        closable: false
      }).then(action => {
        if (action === 'confirm') {
          var newPassword = generatePassword()
          resetPassword(user.workid, newPassword).then(res => {
            alert('新密码: ' + newPassword)
          })
        }
      })
    },
    // 用户创建
    handleRegister() {
      if (this.createUserPanel.password === this.createUserPanel.confirm) {
        register({
          workid: this.createUserPanel.workid,
          password: this.createUserPanel.password
        }).then(res => {
          this.$message.info('注册成功')
          this.handleRefresh()
          this.createUserPanel.show = false
          // eslint-disable-next-line handle-callback-err
        }).catch(err => {
          // this.$message.error(err)
          this.createUserPanel.show = true
        })
      } else {
        this.$message.error('密码输入不一致', { duration: 2 })
        this.createUserPanel.show = true
      }
    },
    // 创建用户
    handleCreate() {
      // console.log(this.$refs)
      this.createUserPanel.workid = ''
      this.createUserPanel.password = ''
      this.createUserPanel.confirm = ''
      // this.$refs['registerForm'].resetFields()
      this.createUserPanel.show = true
    },
    // 分组授权
    handleGroupChange(selectedKeys, direction, movedKeys) {
      var isAssign = false
      if (direction === 'right') {
        isAssign = true
      }
      // 更新授权
      movedKeys.forEach((v) => {
        linkUserGroup({
          workid: this.selectUser.workid,
          groupname: v,
          assign: isAssign
        }).then(res => {
          console.log(res.data)
        })
      })
      this.groupPanel.selectGroups = selectedKeys
    },
    // 角色授权
    handleRoleChange(selectedKeys, direction, movedKeys) {
      var isAssign = false
      if (direction === 'right') {
        isAssign = true
      }
      // 更新授权
      movedKeys.forEach((v) => {
        linkUserRole({
          workid: this.selectUser.workid,
          rolename: v,
          assign: isAssign
        }).then(res => {
          console.log(res.data)
        })
      })

      this.rolePanel.selectRoles = selectedKeys
    },
    // 显示编辑面板
    handleEditAction(user) {
      this.selectUser = user
      this.editPanel.depart = user.depart
      this.editPanel.show = true
    },
    // 显示分组面板
    handleGroupAction(user) {
      this.selectUser = user
      this.groupPanel.show = true
      // 加载分组数据
      listGroups().then(res => {
        const groups = res.data.groups
        var groupData = []
        for (var k in groups) {
          var item = groups[k]
          groupData.push({
            'key': item.groupname,
            'label': item.groupname,
            'description': item.description
          })
        }
        this.groupPanel.list = groupData
      })
      // 加载已有分组
      listGroupsByUser(this.selectUser.workid).then(res => {
        const groups = res.data.groups
        var selectGroups = []
        for (var k in groups) {
          selectGroups.push(groups[k].groupname)
        }
        this.groupPanel.selectGroups = selectGroups
      })
    },
    handleRoleAction(user) {
      this.selectUser = user
      this.rolePanel.show = true
      listRoles().then(res => {
        const roles = res.data.roles
        var roleData = []
        for (var k in roles) {
          var item = roles[k]
          roleData.push({
            'key': item.rolename,
            'label': item.rolename,
            'description': item.description
          })
        }
        this.rolePanel.list = roleData
      })
      // 加载已有角色
      listRolesByUser(this.selectUser.workid).then(res => {
        const roles = res.data.roles
        var selectRoles = []
        for (var k in roles) {
          selectRoles.push(roles[k].rolename)
        }
        this.rolePanel.selectRoles = selectRoles
      })
    }
  }
}
</script>
