<template>
  <div>
    <el-button-group style="margin-bottom:2px;">
      <el-button type="default" icon="fa fa-refresh" @click="handleRefresh">刷新</el-button>
      <el-button type="primary" icon="fa fa-users" @click="handleCreate">新建</el-button>
    </el-button-group>
    <el-table :data="data">
      <el-table-column v-for="col in column" :key="col.key" :prop="col.key" :label="col.title" :width="col.width" />
      <el-table-column label="操作" width="180">
        <template slot-scope="{row}">
          <el-button-group>
            <el-button icon="fa fa-pencil" @click="handleModify(row)">修改</el-button>
            <el-button icon="fa fa-user" @click="handleUserAction(row)">用户</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="editGroupPanel.show"
      :title="editGroupPanel.type==='create'?'新建分组':'编辑分组'"
    >
      <el-form>
        <el-form-item label="名称">
          <el-input v-model="editGroupPanel.name" placeholder="请输入分组名称" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="editGroupPanel.description"
            placeholder="描述"
            type="textarea"
            :autosize="{minRows: 2,maxRows: 5}"
          />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="editGroupPanel.rolename" placeholder="请选择绑定角色" filterable>
            <el-option
              v-for="item in editGroupPanel.roles"
              :key="item"
              :value="item.rolename"
            >{{ item.rolename }}</el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="editGroupPanel.show = false">取 消</el-button>
        <el-button type="primary" @click="handleGroupSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="userPanel.show"
      title="用户分配"
      :width="'860px'"
      :close-on-click-modal="false"
    >
      <p>
        选中分组名:
        <b>{{ selectGroup.groupname }}</b>
        ({{ selectGroup.id }})
      </p>
      <p>{{ selectGroup.description }}</p>
      <el-transfer
        v-model="userPanel.selectUsers"
        :titles="['可选用户','有效用户']"
        :data="userPanel.list"
        filterable
        @change="handleUserChange"
      />
    </el-dialog>
  </div>
</template>

<script>
import {
  listGroups,
  listRoles,
  createGroup,
  updateGroup,
  linkUserGroup,
  listUsers,
  listUsersByGroup
} from '@/api/auth'
export default {
  name: 'GroupList',
  data() {
    return {
      // 当前选中分组
      selectGroup: {},
      userPanel: {
        show: false,
        list: [],
        selectUsers: []
      },
      editGroupPanel: {
        type: 'create',
        oldname: '',
        show: false,
        name: '',
        description: '',
        rolename: '',
        roles: []
      },
      column: [{
        title: 'ID',
        key: 'id',
        width: 80
      }, {
        title: '分组名称',
        key: 'groupname',
        width: 120
      }, {
        title: '描述',
        key: 'description'
      }, {
        title: '角色',
        key: 'rolename',
        width: 120
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
    // 显示用户分配面板
    handleUserAction(group) {
      this.selectGroup = group
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
      // 加载已选中用户
      listUsersByGroup(this.selectGroup.groupname).then(res => {
        const users = res.data.users
        var selectUsers = []
        for (var k in users) {
          selectUsers.push(users[k].workid)
        }
        this.userPanel.selectUsers = selectUsers
      })
    },
    handleUserChange(selectedKeys, direction, movedKeys) {
      var isAssign = false
      if (direction === 'right') {
        isAssign = true
      }
      // 更新授权
      movedKeys.forEach((v) => {
        linkUserGroup({
          workid: v,
          groupname: this.selectGroup.groupname,
          assign: isAssign
        }).then(res => {
          console.log(res.data)
        })
      })
      this.userPanel.selectUsers = selectedKeys
    },
    // 刷新列表
    handleRefresh() {
      listGroups().then(res => {
        this.data = res.data.groups
      })
    },
    // 显示修改分组面板
    handleModify(group) {
      this.editGroupPanel.type = 'edit'
      this.editGroupPanel.name = group.groupname
      this.editGroupPanel.oldname = group.groupname
      this.editGroupPanel.description = group.description
      this.editGroupPanel.rolename = group.rolename
      // 加载角色表
      this.editGroupPanel.roles = []
      listRoles().then(res => {
        this.editGroupPanel.roles = res.data.roles
        this.editGroupPanel.show = true
      })
    },
    // 显示新建分组面板
    handleCreate() {
      this.editGroupPanel.type = 'create'
      this.editGroupPanel.name = ''
      this.editGroupPanel.description = ''
      this.editGroupPanel.rolename = ''
      // 加载角色表
      this.editGroupPanel.roles = []
      listRoles().then(res => {
        this.editGroupPanel.roles = res.data.roles
        this.editGroupPanel.show = true
      })
    },
    // 处理分组编辑
    handleGroupSubmit() {
      if (this.editGroupPanel.type === 'create') {
        createGroup({
          group: this.editGroupPanel.name,
          desc: this.editGroupPanel.description,
          role: this.editGroupPanel.rolename
        }).then(res => {
          this.$message.info('分组创建成功')
          this.handleRefresh()
        })
      } else if (this.editGroupPanel.type === 'edit') {
        updateGroup({
          groupname: this.editGroupPanel.oldname,
          info: {
            groupname: this.editGroupPanel.name,
            description: this.editGroupPanel.description,
            rolename: this.editGroupPanel.rolename
          }
        }).then(res => {
          this.$message.info('分组更新成功')
          this.handleRefresh()
        })
      }
    }
  }
}
</script>
