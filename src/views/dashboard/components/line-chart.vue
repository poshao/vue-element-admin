<template>
  <div :id="id" :style="{width:width,height:height}" />
</template>

<script>
import echarts from 'echarts'
import { getOrderCountStatus } from '@/api/linkcs/'
export default {
  name: 'LineChart',
  props: {
    id: {
      default: 'linechart',
      type: String
    },
    width: {
      default: '100%',
      type: String
    },
    height: {
      default: '500px',
      type: String
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.initChart()
  },
  beforeDestroy() {
    if (this.chart !== null) {
      this.chart.dispose()
      this.chart = null
    }
  },
  methods: {
    initChart() {
      getOrderCountStatus().then(res => {
        // console.log(res.data.dataset)
        this.chart = echarts.init(document.getElementById(this.id))
        this.chart.setOption({
        // title:{
        //   text:'Line Chart'
        // },
          xAxis: {
            type: 'category'
          },
          yAxis: {},
          dataset: {
            source: res.data.dataset.reverse(),
            dimensions: ['dt', 'cnt'],
            sourceHeader: false
          },
          series: [
            { type: 'line', label: { show: true }}
          ]
        })
      })
    }
  }
}
</script>

<style>

</style>
