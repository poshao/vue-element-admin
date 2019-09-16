<template>
  <el-card shadow="hover" class="profile" :body-style="{padding:0}">
    <el-row class="profile_size">
      <el-col :span="4">
        <el-scrollbar :native="false" wrap-class="profile_size">
          <el-menu>
            <el-menu-item>
              <span slot="title">基础资料1</span>
            </el-menu-item>
            <el-menu-item>
              <span slot="title">安全</span>
            </el-menu-item>
            <el-menu-item>
              <span slot="title">邮件</span>
            </el-menu-item>
            <el-menu-item>
              <span slot="title">基础资料2</span>
            </el-menu-item>
            <el-menu-item>
              <span slot="title">安全</span>
            </el-menu-item>
            <el-menu-item>
              <span slot="title">邮件</span>
            </el-menu-item>
            <el-menu-item>
              <span slot="title">基础资料3</span>
            </el-menu-item>
            <el-menu-item>
              <span slot="title">安全</span>
            </el-menu-item>
            <el-menu-item>
              <span slot="title">邮件</span>
            </el-menu-item>
            <el-menu-item>
              <span slot="title">基础资料4</span>
            </el-menu-item>
            <el-menu-item>
              <span slot="title">安全</span>
            </el-menu-item>
            <el-menu-item>
              <span slot="title">邮件</span>
            </el-menu-item>
            <el-menu-item>
              <span slot="title">基础资料5</span>
            </el-menu-item>
            <el-menu-item>
              <span slot="title">安全</span>
            </el-menu-item>
            <el-menu-item>
              <span slot="title">邮件</span>
            </el-menu-item>
            <el-menu-item>
              <span slot="title">基础资料6</span>
            </el-menu-item>
            <el-menu-item>
              <span slot="title">安全</span>
            </el-menu-item>
            <el-menu-item>
              <span slot="title">邮件</span>
            </el-menu-item>
            <el-menu-item>
              <span slot="title">基础资料7</span>
            </el-menu-item>
            <el-menu-item>
              <span slot="title">安全</span>
            </el-menu-item>
            <el-menu-item>
              <span slot="title">邮件</span>
            </el-menu-item>
          </el-menu>
        </el-scrollbar>
      </el-col>
      <el-col :span="20">
        <div class="content">
          <router-view />
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
  data() {
    []
  },
  mounted() {

  }
}
</script>
<style>
.el-scrollbar__wrap{
  overflow-x: hidden;
}
.profile_size{
  min-height: 400px;
  height: calc(100vh - 8rem);
  margin-bottom:0px;
}
</style>
<style lang="scss" scoped>

.profile{
  margin: 20px;
  min-height: 400px;
  height: calc(100vh - 8rem);
}
</style>
