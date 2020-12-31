<template>
  <div>
    <div id="oContent">
      <a-card style="width: 750px;height:230px;border-top:10px solid #1890F7;box-sizing:border-box;background: rgba(255,255,255,0.6)!important;">
          <h2>公告通知</h2>
      </a-card>
      <a-card style="width: 550px;height:230px;border-top:10px solid #1890F7;box-sizing:border-box;background: rgba(255,255,255,0.6)!important;">
          <h2>预警消息</h2>
      </a-card>
      <a-card style="width: 750px;height:370px;margin-top:10px;border-top:10px solid #1890F7;box-sizing:border-box;text-align:center;position: relative;background: rgba(255,255,255,0.6)!important;">
          <h2 style="text-align:left">北京时间</h2>
          <canvas ref="tutorial" width="300" height="300">
        你的浏览器不支持 canvas，请升级你的浏览器。
        </canvas>
        <section id="onNumber">
      <span style="position: absolute;top:42px;left: 50%;transform:translateX(-50%)">12</span>
      <span style="position: absolute;top:50%;left: 42px;transform:translateY(-50%)">9</span>
      <span style="position: absolute;bottom:42px;left: 50%;transform:translateX(-50%)">6</span>
      <span style="position: absolute;top:50%;right: 42px;transform:translateY(-50%)">3</span>
    </section>
      </a-card>
      <a-card style="width: 550px;height:370px;margin-top:10px;border-top:10px solid #1890F7;box-sizing:border-box;background: rgba(255,255,255,0.6)!important;">
          <h2>新增供应商分析</h2>
        <div class="chartPack">
            <echartsPages></echartsPages>
        </div>
      </a-card>
    </div>
  </div>
</template>

<script>
export default {
  components: {
    echartsPages: () => import('@/components/echarts/echartsPages')
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      const canvas = this.$refs.tutorial
      const ctx = canvas.getContext('2d')
      this.draw(ctx)
    },
    draw (ctx) {
      const that = this
      requestAnimationFrame(function step () {
        that.drawDial(ctx)
        that.drawHand(ctx)
        requestAnimationFrame(step)
      })
    },

    drawHand (ctx) {
      const time = new Date()
      const s = time.getSeconds()
      const m = time.getMinutes()
      const h = time.getHours()
      const pi = Math.PI

      const secondAngle = pi / 180 * 6 * s
      const minuteAngle = pi / 180 * 6 * m + secondAngle / 60
      const hourAngle = pi / 180 * 30 * h + minuteAngle / 12 // 12小时 12 * 30 = 360 ，
      this.drawHands(secondAngle, 136, 2, 'orange', ctx)
      this.drawHands(minuteAngle, 110, 4, '#1890F7', ctx)
      this.drawHands(hourAngle, 70, 6, 'lightgreen', ctx)
    },
    drawHands (angle, len, width, color, ctx) {
      ctx.save()
      ctx.translate(150, 150)
      // rotate 0度为x轴，顺时针为正方向；-Math.PI/2是12点的方向，加上时分秒的单次角度，就是实时的时间
      ctx.rotate(-Math.PI / 2 + angle)
      ctx.beginPath() // 开始
      ctx.moveTo(-4, 0) // 将起点移到指定位置
      ctx.lineTo(len, 0) // 终点(从起点到终点绘制直线)
      ctx.strokeStyle = color // 设置样式
      ctx.lineWidth = width // 宽度
      ctx.lineCap = 'round' // 线的终点以圆弧结尾
      ctx.stroke() // 绘制
      ctx.closePath() // 关闭路径
      ctx.restore() // 返回上一次保存
    },
    // 绘制表盘
    drawDial (ctx) {
      ctx.clearRect(0, 0, 300, 300) // 清空所有
      ctx.save() // 保存
      ctx.translate(150, 150) // 位移坐标轴
      ctx.beginPath() // 开始路径
      ctx.arc(0, 0, 148, 0, 2 * Math.PI) // 绘制圆形
      ctx.stroke() // 开始绘制
      ctx.closePath() // 关闭路径
      ctx.restore() // 返回上次保存

      for (let i = 0; i < 60; i++) {
        ctx.save() // 保存
        ctx.translate(150, 150) // 位移坐标轴
        ctx.rotate(Math.PI / 180 * 6 * i) // 旋转坐标轴
        ctx.beginPath()
        ctx.moveTo(110, 0)
        ctx.lineTo(140, 0)
        ctx.strokeStyle = i % 5 ? 'pink' : 'rebeccapurple'
        ctx.lineWidth = i % 5 ? '2' : '4'
        ctx.stroke()
        ctx.closePath()
        ctx.restore()
      }
    }
  }
}
</script>
<style lang="scss">
#onNumber{
  width: 300px;
  height: 300px;
  position: absolute;
  left: 50%;
  top: 11%;
  transform: translateX(-50%);
  z-index: 1;
  border-radius: 50%;
  margin: 0 auto;
}
#oContent{
    display: flex;
    justify-content: space-evenly;
    flex-flow: wrap;
    background: rgba(255,255,255,.8)!important;
}
.ant-card-body{
    padding: 0!important;
    h2{
        line-height: 40px;
        padding-left: 17px;
    }
}
.chartPack{
    // width: 800px;
}
</style>
