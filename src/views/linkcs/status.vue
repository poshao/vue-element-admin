<template>
  <el-card>
    <div slot="header" class="clearfix">
      <span>每日单量分布图</span>
      <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
    </div>
    <LineChart />
  </el-card>
</template>

<script>
import LineChart from './components/line-chart'
export default {
  components: { LineChart }
}
</script>

<style>

</style>
