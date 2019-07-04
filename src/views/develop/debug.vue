<template>
  <div>
    <el-switch v-model="debug" @change="handleChangeDebugMode" />调试模式
  </div>
</template>

<script>
import { getPhpDebugStatus, setPhpDebugFlag } from '@/utils/debug'
export default {
  data() {
    return {
      debug: getPhpDebugStatus()
    }
  },
  methods: {
    // 调试模式设定
    handleChangeDebugMode() {
      setPhpDebugFlag(this.debug)
    }
  }
}
</script>
