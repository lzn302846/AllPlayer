<template>
  <div ref="oEcharts" class="echartsClass" style="width: 100%;height:250px"></div>
</template>

<script>
import echarts from 'echarts'
var weatherIcons = {
  Sunny: '/data/asset/img/weather/sunny_128.png',
  Cloudy: '/data/asset/img/weather/cloudy_128.png',
  Showers: '/data/asset/img/weather/showers_128.png'
}

var option = {
  title: {
    text: '天气情况统计',
    subtext: '虚构数据',
    left: 'center'
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ({d}%)'
  },
  legend: {
    // orient: 'vertical',
    // top: 'middle',
    bottom: 10,
    left: 'center',
    data: ['西凉', '益州', '兖州', '荆州', '幽州']
  },
  series: [
    {
      type: 'pie',
      radius: '55%',
      center: ['50%', '50%'],
      selectedMode: 'single',
      data: [
        {
          value: 1548,
          name: '幽州'
        },
        { value: 535, name: '荆州' },
        { value: 510, name: '兖州' },
        { value: 634, name: '益州' },
        { value: 735, name: '西凉' }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
}

export default {
  data () {
    return {
      myChart: ''
    }
  },
  mounted () {
    // 基于准备好的dom，初始化echarts实例
    this.myChart = echarts.init(this.$refs.oEcharts)
    this.myChart.setOption(option)
  }
}

</script>
<style lang="scss">

</style>
