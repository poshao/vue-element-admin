<template>
  <el-card class="user_profile">
    <div slot="header" class="clearfix">
      <span>用户信息</span>
      <el-button style="float: right; padding: 3px 0" type="text" @click="handleSubmit">保存</el-button>
    </div>
    <el-form ref="FormSetting" :v-model="userinfo">
      <el-form-item label="工号">
        <el-input v-model="userinfo.workid" readonly />
      </el-form-item>
      <el-form-item label="部门">
        <el-input v-model="userinfo.depart" placeholder="请联系管理设定部门" readonly />
      </el-form-item>
      <el-form-item label="用户名">
        <el-input v-model="userinfo.username" />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="userinfo.email" />
      </el-form-item>
      <el-form-item label="电话">
        <el-input v-model="userinfo.phone" />
      </el-form-item>
    </el-form>
    <el-upload
      action=""
      :before-upload="handleUpdateAvator"
      accept="image/png, image/gif, image/jpeg"
      :max-size="1024"
      :format="['jpg','jpeg','png']"
    >
      <el-button icon="ios-person-outline">上传头像</el-button>
    </el-upload>
  </el-card>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapActions } = createNamespacedHelpers('user')
export default {
  data() {
    var userinfo = this.$store.state.user
    return {
      userinfo: {
        username: userinfo.name,
        workid: userinfo.workid,
        depart: userinfo.depart,
        email: userinfo.email,
        phone: userinfo.phone
      }
    }
  },
  methods: {
    ...mapActions(['handleUpdateUserInfo', 'handleUploadAvator']),
    handleSubmit() {
      var userinfo = this.userinfo
      this.handleUpdateUserInfo({ userinfo }).then(res => {
        this.$message.info('用户资料更新成功')
        this.$router.go(-1)
      })
    },
    /**
     * 上传头像
     */
    handleUpdateAvator(file) {
      this.handleUploadAvator(file)
      return false
    }
  }
}
</script>

<style lang="scss" scoped>
  .user_profile{
    width: 350px;
    margin: 26px;
  }
</style>
