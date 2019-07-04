<template>
  <div>
    <el-button-group style="margin-bottom:2px;">
      <el-button type="default" icon="fa fa-refresh" @click="handleRefresh">刷新</el-button>
    </el-button-group>
    <el-table :data="data">
      <el-table-column v-for="col in column" :key="col.key" :prop="col.key" :label="col.title" :width="col.width" />
    </el-table>
  </div>
</template>

<script>
import { listPermissions } from '../../../api/auth'
export default {
  name: 'PermissionList',
  data() {
    return {
      column: [{
        title: 'ID',
        key: 'id',
        width: 80
      }, {
        title: '权限名称',
        key: 'permissionname'
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
    handleRefresh() {
      listPermissions().then(res => {
        this.data = res.data.permissions
      })
    }
  }
}
</script>
