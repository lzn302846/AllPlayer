// window.onload 网页加载完成后立即执行的操作
// Math.round 返回一个数字四舍五入后最接近的整数
// Math.abs（） 取括号中值的绝对值
// Math.cos（）计算余弦
// Math.sin（）返回一个数值的正弦值
// range  范围
window.onload = function () {
  var canvas = document.getElementById('canvas') // 获取canvas标签
  var ctx = canvas.getContext('2d') // ctx 创建context对象，里面有多种方法
  var fireArr = [] // 存储烟花
  var fragments = [] // fragments数组里面存储的是被移出的烟花
  // 初始化烟花数：5
  for (var i = 0; i < 5; i++) {
    fireArr.push(createRandomFire(CreateFireObj))
  }
  if (fireArr.length) {
    animate()
  }
  // 此函数生成一个烟花并炸开
  function CreateFireObj (x, y, color, offsetValueX, offsetValueY) {
    this.fragArr = [] // 小火花的数组
    this.initialX = x
    this.initialY = y
    this.x = x
    this.y = y
    this.vx = 2
    this.vy = 2
    this.radius = 4
    this.color = color
    this.angel = 180
    this.offsetValueX = offsetValueX
    this.offsetValueY = offsetValueY
    this.disappear = false // 烟花的存在与消失
    this.boomJudge = true
    this.draw = () => { // 烟花起点位置生成圆点
      ctx.save()
      ctx.beginPath()
      ctx.fillStyle = this.color
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true),
      ctx.fill()
      ctx.closePath()
      ctx.restore()
    }
    this.move = function () { // 烟花由下至上，腾空升起的效果
      this.x -= this.vx + this.offsetValueX
      this.y -= this.vy + this.offsetValueY
    }
    // boom函数产生小花火的随机数量、颜色、角度、终点
    this.boom = function () {
      var scope = Math.round(getRandom(10, 40))
      for (var i = 0; i < scope; i++) {
        var angel = getRandom(0, 2 * Math.PI) // 0-360的随机度数
        var range = Math.round(getRandom(50, 300)) // 范围 50-300
        var targetX = this.x + range * Math.cos(angel) // 目标点X
        var targetY = this.y + range * Math.sin(angel) // 目标点Y
        var r = Math.round(getRandom(120, 255)) // 120-255的随机数
        var g = Math.round(getRandom(120, 255))// 120-255的随机数
        var b = Math.round(getRandom(120, 255))// 120-255的随机数
        var color = 'rgb(' + r + ',' + g + ',' + b + ')' // 随机颜色
        // 生成烟花炸开后的小花
        var frag = new CreateFrag(this.x, this.y, color, targetX, targetY)
        this.fragArr.push(frag) // 将小花push进数组
      }
    }
  }
  // 烟花到达终点时，在终点位置（x,y）生成宽高都为2的实心方形，也就是小花火
  function CreateFrag (x, y, color, tx, ty) {
    var that = this
    that.x = x
    that.y = y
    that.ty = ty
    that.tx = tx
    that.color = color
    that.disappear = false
    that.draw = function () {
      ctx.save()
      ctx.beginPath()
      ctx.fillStyle = that.color
      ctx.fillRect(that.x, that.y, 2, 2)
      ctx.restore()
    }
    // 小火花的移动函数，因为是它产生了小火花如“重力”般下降的效果
    that.move = function () {
      // 函数接受了五个参数，后面两个tx、ty，代表了其目标点的x、y坐标，我们给出了一个他的当前位置和目标位置的差值，dx和dy，在这个差值的范围未超出某个给定的阈值（我们这里给得是0.1）时，小火花的横纵坐标都增加dx和dy的0.01倍，这个倍数越小，越能表现出烟花“爆炸”的细节。这个我们给到一个比较合适的值。小花火的“重力下降”其实得益于一句简单的代码，即：that.ty = that.ty + 0.5。如果没有这句代码，小花火的移动路线是直线，加了这句之后，相当于其垂直速度的增加速度是不断增大的，这就相当于给了它一个垂直方向的加速度，让其看起来像受“重力”牵引而不断下降一样
      that.ty = that.ty + 0.5
      var dx = that.tx - that.x // 终点坐标减去起点坐标,起点和终点的差值
      var dy = that.ty - that.y // 终点坐标减去起点坐标,起点和终点的差值
      //       	如果差值小于0.1    等于终点  否则 起点 = (起点 + 差值 * 0.01)
      that.x = Math.abs(dx) < 0.1 ? that.tx : (that.x + dx * 0.01)
      that.y = Math.abs(dy) < 0.1 ? that.ty : (that.y + dy * 0.01)
      // 如果差值X = 0 或 Y = 0 或 起点Y 大于等于 700 或起点X 小于等于300 或 大于等于1700
      if (dx == 0 || dy == 0 || that.y >= 700 || that.x <= 300 || that.x >= 1700) {
        that.fragDisappear = true // 小花消失
      }
    }
  }
  // 此函数生成烟花的随机颜色，并把起点和终点传入描绘烟花并炸开的函数中，并返回这个烟花
  function createRandomFire (func) {
    var r = Math.round(getRandom(200, 255))
    var g = Math.round(getRandom(200, 255))
    var b = Math.round(getRandom(0, 255))
    var color = 'rgb(' + r + ',' + g + ',' + b + ')'
    var fire = new func(960 + getRandom(-300, 300), 800, color, getRandom(-5, 5), getRandom(0, 3))
    return fire
  }

  function animate () {
    ctx.fillStyle = 'rgba(0,0,0,0.05)' // 产生拖尾效果
    // canvas.width和canvas.height是在canvas标签上设置的宽高
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    if (fireArr.length) {
      fireArr.forEach((item, index) => {
        var marginWidthLeft = parseInt(getRandom(0, canvas.width / 5), 10)
        var marginWidthRight = parseInt(getRandom(1500, canvas.width), 10)
        var marginHeight = parseInt(getRandom(0, 300), 10)
        if (item.x >= marginWidthRight || item.x <= marginWidthLeft || item.y <= marginHeight) {
          item.disappear = true // 满足以上条件，烟花消失
        }
        if (!item.disappear) { // 如果烟花消失的标志为false
          item.draw() // 生成烟花
          item.move() // 移动
        } else {
          // 烟花的消失原理:当烟花的一组花火中的某一个达到边界条件的时候，我就将该朵花火所在的整个数组干掉，而不是一个一个花火单独去除
          // fragments数组里面存储的是被移出的烟花，这里我们要注意一点，在fragments.forEach里面用的是item1[0]，而不是item1，是因为在执行废弃烟花的存储操作的时候，即var removeFire = fireArr.splice(index, 1);fragments.push(removeFire); fragments push的是fireArr splice的返回值，是一个含有单个元素的数组。
          var removeFire = fireArr.splice(index, 1)
          fragments.push(removeFire)
          if (fragments.length) {
            fragments.forEach(function (item, index) {
              if (item[0].boomJudge) { // 控制炸开的标志为原始值（true）
                item[0].boom() // 执行boom函数，生成小花火
                item[0].boomJudge = false // 将标志变为false，代表已炸开
              }
            })
          }
          // 接着 生成另一组烟花 fireArr是装着烟花的数组
          fireArr.push(createRandomFire(CreateFireObj))
        }
      })
    }
    // 存储被移除的烟花数组中还有烟花
    if (fragments.length) {
      fragments.forEach((item1, index1) => {
        // 循环存储小花的数组
        item1[0].fragArr.forEach(item2 => {
          // 小火花消失的标志为true
          if (item2.fragDisappear) {
            // 从数组里删除这个烟花，表示这个烟花已彻底消失
            fragments.splice(index1, 1)
          }
          // 如果小花没消失，则继续生成，继续运动
          item2.draw()
          item2.move()
        })
      })
    }
    window.requestAnimationFrame(animate)
  }
  // 获取随机数的方法
  function getRandom (a, b) {
    return Math.random() * (b - a + 1) + a
  }
}

// function move() {
// 	ctx.fillStyle = 'rgba(0,0,0,0.1)';
// 	ctx.fillRect(0, 0, canvas.width, canvas.height);
// 	fire.draw();
// 	fire.x = fire.trackRadius * Math.cos(Math.PI/180 * fire.angel) + fire.trackRadius + 960;
// 	fire.y = fire.trackRadius * Math.sin(Math.PI/180 * fire.angel) + 700;
// 	fire.angel += 2;
// }
// var button = document.getElementById('animationTest');
// button.addEventListener('click', function() {
// 	(new CreateFireObj(960, 700, 'blue', 100, Math.random()*3, Math.random()*3)).animate();
// })
