<template>
  <div style="margin:0 5px">
    <el-button-group style="margin-bottom:2px;">
      <el-button type="default" icon="fa fa-refresh" @click="handleRefresh">刷新</el-button>
      <el-button type="primary" icon="fa fa-graduation-cap" @click="handleCreate">新建</el-button>
    </el-button-group>
    <el-table :data="data">
      <el-table-column v-for="col in column" :key="col.key" :prop="col.key" :label="col.title" :width="col.width" />
      <el-table-column label="操作" width="180">
        <template slot-scope="{row}">
          <el-button-group>
            <el-button icon="fa fa-user" @click="handleUserAction(row)">用户</el-button>
            <el-button icon="fa fa-university" @click="handlePermissionAction(row)">权限</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :visible.sync="userPanel.show"
      title="用户角色分配"
      :width="'860px'"
      :close-on-click-modal="false"
    >
      <p>
        选中角色名:
        <b>{{ selectRole.rolename }}</b>
        ({{ selectRole.id }})
      </p>
      <p>{{ selectRole.description }}</p>
      <el-transfer
        v-model="userPanel.selectUsers"
        :list-style="{height:'400px',width:'240px'}"
        :titles="['可选用户','有效用户']"
        :data="userPanel.list"
        filterable
        @change="handleUserChange"
      />
    </el-dialog>
    <el-dialog
      :visible.sync="permissionPanle.show"
      title="角色权限分配"
      :width="'860px'"
      :close-on-click-modal="false"
    >
      <p>
        选中角色名:
        <b>{{ selectRole.rolename }}</b>
        ({{ selectRole.id }})
      </p>
      <p>{{ selectRole.description }}</p>
      <el-transfer
        v-model="permissionPanle.selectPermissions"
        :titles="['可选权限','有效权限']"
        :data="permissionPanle.list"
        filterable
        @change="handlePermissionChange"
      />
    </el-dialog>
    <el-dialog
      :visible.sync="createRolePanel.show"
      title="新建角色"
      :close-on-click-modal="false"
    >
      <el-form>
        <el-form-item label="名称">
          <el-input v-model="createRolePanel.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="createRolePanel.description"
            placeholder="请输入角色描述"
            type="textarea"
            :autosize="{minRows: 2,maxRows: 5}"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="createRolePanel.show = false">取 消</el-button>
        <el-button type="primary" @click="handleCreateRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listRoles,
  listUsers,
  listUserByRole,
  listPermissions,
  listPermissionsByRole,
  linkUserRole,
  linkRolePermission,
  createRole
} from '../../../api/auth'
export default {
  name: 'RoleList',
  data() {
    return {
      // 当前选中角色
      selectRole: {},
      createRolePanel: {
        show: false,
        name: '',
        description: ''
      },
      userPanel: {
        show: false,
        list: [],
        selectUsers: []
      },
      permissionPanle: {
        show: false,
        list: [],
        selectPermissions: []
      },
      column: [{
        title: 'ID',
        key: 'id',
        width: 80
      }, {
        title: '角色名称',
        key: 'rolename',
        width: 120
      }, {
        title: '描述',
        key: 'description'
      }, {
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
    // 处理添加用户操作
    handleUserAction(role) {
      this.selectRole = role
      this.userPanel.show = true
      // 加载用户数据
      listUsers().then(res => {
        const users = res.data.users.list
        var userData = []
        for (var k in users) {
          var item = users[k]
          userData.push({
            'key': item.workid,
            'label': item.username + '(' + item.workid + ')'
          })
        }
        this.userPanel.list = userData
      })
      // 加载拥有角色的用户
      listUserByRole(this.selectRole.rolename).then(res => {
        const users = res.data.users
        var selectUsers = []
        for (var k in users) {
          selectUsers.push(users[k].workid)
        }
        this.userPanel.selectUsers = selectUsers
      })
    },
    // 处理添加权限操作
    handlePermissionAction(role) {
      this.selectRole = role
      this.permissionPanle.show = true
      // 加载权限数据
      listPermissions().then(res => {
        const permissions = res.data.permissions
        var permissionData = []
        for (var k in permissions) {
          var item = permissions[k]
          permissionData.push({
            'key': item.permissionname,
            'label': item.permissionname,
            'description': item.description
          })
        }
        this.permissionPanle.list = permissionData
      })
      // 加载角色的权限
      listPermissionsByRole(this.selectRole.rolename).then(res => {
        const permissions = res.data.permissions
        var selectPermissions = []
        for (var k in permissions) {
          selectPermissions.push(permissions[k].permissionname)
        }
        this.permissionPanle.selectPermissions = selectPermissions
      })
    },
    // 刷新列表
    handleRefresh() {
      listRoles().then(res => {
        this.data = res.data.roles
      })
    },
    // 显示新建角色
    handleCreate() {
      this.createRolePanel.name = ''
      this.createRolePanel.description = ''
      this.createRolePanel.show = true
    },
    // 新建角色
    handleCreateRole() {
      createRole({ role: this.createRolePanel.name, desc: this.createRolePanel.description }).then(res => {
        this.$message.info('角色创建成功')
        this.handleRefresh()
        this.createRolePanel.show = false
      })
    },
    // 用户添加角色
    handleUserChange(selectedKeys, direction, movedKeys) {
      var isAssign = false
      if (direction === 'right') {
        isAssign = true
      }
      // 更新授权
      movedKeys.forEach((v) => {
        linkUserRole({
          workid: v,
          rolename: this.selectRole.rolename,
          assign: isAssign
        }).then(res => {
          console.log(res.data)
        })
      })

      this.userPanel.selectUsers = selectedKeys
    },
    // 角色添加权限
    handlePermissionChange(selectedKeys, direction, movedKeys) {
      var isAssign = false
      if (direction === 'right') {
        isAssign = true
      }
      // 更新授权
      movedKeys.forEach((v) => {
        linkRolePermission({
          role: this.selectRole.rolename,
          permission: v,
          assign: isAssign
        }).then(res => {
          console.log(res.data)
        })
      })
      this.permissionPanle.selectPermissions = selectedKeys
    }
  }

}
</script>
