<template>
  <el-tabs value="frmUser" type="card" class="auth_summary">
    <el-tab-pane label="用户" name="frmUser">
      <UserList />
    </el-tab-pane>
    <el-tab-pane label="分组" name="frmGroup">
      <GroupList />
    </el-tab-pane>
    <el-tab-pane label="角色" name="frmRole">
      <RoleList />
    </el-tab-pane>
    <el-tab-pane label="权限" name="frmPermission">
      <PermissionList />
    </el-tab-pane>
  </el-tabs>
</template>

<script>

export default {
  components: {
    'RoleList': () => import('./components/role-list.vue'),
    'UserList': () => import('./components/user-list.vue'),
    'PermissionList': () => import('./components/permission-list.vue'),
    'GroupList': () => import('./components/group-list.vue')
  }
}
</script>

<style lang="scss" scoped>
  .auth_summary{
    padding: 26px;
  }
</style>

