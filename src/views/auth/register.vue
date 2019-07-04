<template>
  <div>
    <h1>新用户注册</h1>
    <el-form ref="Register" :model="register">
      <el-form-item label="工号">
        <el-input v-model="register.workid" type="text" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="register.password" type="password" placeholder="请输入密码" />
      </el-form-item>
      <el-form-item label="确认">
        <el-input v-model="register.confirm" type="password" placeholder="请再次输入密码" />
      </el-form-item>
      <el-button type="primary" long @click="handleSubmit">注册</el-button>
    </el-form>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  data() {
    return {
      register: {
        workid: '',
        password: '',
        confirm: ''
      }
    }
  },
  methods: {
    ...mapActions(['handleRegister']),
    handleSubmit() {
      if (this.register.password === this.register.confirm) {
        var workid = this.register.workid
        var password = this.register.password
        this.handleRegister({ workid, password }).then(res => {
          this.$Message.info('注册成功')
          this.$router.go(-1)
        })
      } else {
        this.$Message.error('请输入一致的密码')
      }
    }
  }
}
</script>
