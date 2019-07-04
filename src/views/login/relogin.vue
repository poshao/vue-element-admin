<template>
  <el-form label-width="50px">
    <el-form-item label="账号">
      <el-input v-model="username" placeholder="请输入账号" @input="handleInput" />
    </el-form-item>
    <el-form-item label="密码">
      <el-input v-model="password" type="password" placeholder="请输入账号" @input="handleInput" />
    </el-form-item>
    <!-- <div style="float:right">
      <el-button type="primary" @click="handleRelogin">登陆</el-button>
      <el-button type="default" @click="handleCancel">取消</el-button>
    </div> -->
  </el-form>
</template>

<script>
export default {
  name: 'Relogin',
  props: {
    username: {
      default: '',
      type: String
    },
    password: {
      default: '',
      type: String
    }
  },
  methods: {
    handleInput() {
      this.$emit('input', { username: this.username, password: this.password })
    }
  }
}
</script>

