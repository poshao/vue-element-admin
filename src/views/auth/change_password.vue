<template>
  <el-container>
    <el-card class="panel_changepassword">
      <div slot="header">
        密码修改
      </div>
      <el-form ref="ChangePasswordForm" :model="info" :rules="infoRules">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input v-model="info.oldPassword" type="password" placeholder />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="info.newPassword" type="password" placeholder />
        </el-form-item>
        <el-form-item label="确认" prop="confirm">
          <el-input v-model="info.confirm" type="password" placeholder />
        </el-form-item>
        <el-button type="primary" @click="handleChangePassword">确认修改</el-button>
      </el-form>
    </el-card>
  </el-container>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  data() {
    return {
      info: {
        oldPassword: '',
        newPassword: '',
        confirm: ''
      },
      infoRules: {
        oldPassword: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { type: 'string', min: 6, max: 16, message: '请输入正确的密码' }
        ],
        newPassword: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { type: 'string', min: 6, max: 16, message: '请输入正确的密码' }
        ],
        confirm: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { type: 'string', min: 6, max: 16, message: '请输入正确的密码' }
        ]
      }
    }
  },
  methods: {
    ...mapActions(['changePassword']),
    handleChangePassword() {
      this.$refs.ChangePasswordForm.validate((valid) => {
        if (valid) {
          if (this.info.newPassword === this.info.confirm) {
            this.changePassword(this.info).then(res => {
              this.$message.info('修改成功，请重新登录')
              this.$router.replace({ name: 'login' })
            }).catch(e => {
              this.$message.error('修改失败')
            })
          } else {
            this.$message.error('新密码输入不一致')
          }
        }
      })
    }
  }
}
</script>

<style>
.panel_changepassword{
  width: 350px;
}
</style>
