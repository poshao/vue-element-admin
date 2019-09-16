<template>
  <el-form
    ref="forgetForm"
    :model="forgetForm"
    autocomplete="off"
    label-width="80"
  >
    <el-form-item :label="$t('login.reset.workid')">
      <el-input v-model="workid" type="text">
        <el-button slot="append" @click="handleRequest">{{ $t('login.reset.send_code') }}</el-button>
      </el-input>
    </el-form-item>

    <el-form-item :label="$t('login.reset.code')">
      <el-input v-model="code" name="code" type="text" />
    </el-form-item>
    <el-form-item :label="$t('login.reset.newpassword')">
      <el-input v-model="password" type="password" auto-complete="new-password" />
    </el-form-item>
    <el-form-item :label="$t('login.reset.again')">
      <el-input v-model="confirm" type="password" />
    </el-form-item>
    <el-button type="primary" style="width:100%" @click="handleConfirm">{{ $t('login.reset.submit') }}</el-button>
  </el-form>
</template>

<script>
import {
  resetPasswordRequest,
  resetPasswordConfirm
} from '@/api/user.js'

export default {
  name: 'ResetPassword',
  data() {
    return {
      workid: '',
      code: '',
      password: '',
      confirm: ''
    }
  },
  methods: {
    handleRequest() {
      resetPasswordRequest(this.workid).then(res => {
        if (res.data.result) {
          this.$message(this.$t('login.reset.code_sended'))
        }
      })
    },
    handleConfirm() {
      if (this.password !== this.confirm) {
        this.$message(this.$t('login.reset.password_not_match'))
        return
      }
      resetPasswordConfirm(this.workid, this.code, this.password).then(res => {
        if (res.data.result) {
          this.$message(this.$t('login.reset.success'))
          this.$emit('success')
        }
      })
    }
  }
}
</script>

<style>

</style>
