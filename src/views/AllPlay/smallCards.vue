<template>
  <div>
    <div class="onHandle">
      <div class="rounds">
        <span>翻动次数：</span>
        <p>{{turns}}</p>
      </div>
      <div class="depleteTime" v-if="deptime">
        花费时间：
        <p>{{min}} : {{sec}}</p>
      </div>
      <div v-else>
        倒计时：
        <p>{{minD}} : {{secD}}</p>
      </div>
      <div>
        选择游戏难度：
        <a-select :value="startLevel" style="width: 120px" @change="handleChange" :disabled="onDisabled">
          <a-select-option
            :value="item.level"
            v-for="(item,index) in GameLevel"
            :key="index"
          >{{item.level}}</a-select-option>
        </a-select>
      </div>
      <a-button @click="onReset" :disabled="resetButton">游戏重开</a-button>
    </div>
    <hr />
    <a-spin tip="正在玩命加载中......" :spinning="spinning" v-if="victoryFire">
      <div :style="{width:boxWidth,height:'500px',margin:'0 auto',}">
        <a-row
          :gutter="[gutters[gutterKey], vgutters[vgutterKey]]"
          :style="{background:backgroundImage[backgroundShow].ContentB,padding:'25px'}"
        >
          <a-col
            class="CardsCol"
            :class="{'filper':card.isfilper,'matched':card.ismatched}"
            v-for="(card, index) in memoryCards"
            :key="index"
            :span="cardsAmount"
            @click="filperCards(card)"
          >
            <div
              class="back"
              :style="{width:'100px',height:'150px',left:gutters[gutterKey]/2+'px',top:vgutters[vgutterKey]/2+'px'}"
            >
              <img :src="card.img" width="100" height="150" />
            </div>
            <div class="face" style="width:100px;height:150px;">
              <img :src="backgroundImage[backgroundShow].background" width="100" height="150" />
            </div>
          </a-col>
        </a-row>
      </div>
    </a-spin>
    <iframe v-else src="html/fireworks.html" width="1400" height="950" frameborder="0" scrolling="auto" class="iframe"></iframe>
  </div>
</template>
<script>
export default {
  data () {
    const gutters = {}
    const colCounts = {}
    const vgutters = {};
    [8, 16, 24, 32, 40, 48].forEach((value, i) => {
      gutters[i] = value
    });
    [8, 16, 24, 32, 40, 48].forEach((value, i) => {
      vgutters[i] = value
    });
    [6, 8, 10, 12].forEach((value, i) => {
      colCounts[i] = value
    })
    return {
      victoryFire: true, // 过关后的效果控制标志
      resetButton: false, // 重开按钮禁用控制标志
      countdownStart: null, // 倒计时定时器
      minD: 0, // 倒计时分钟
      secD: 0, // 倒计时秒钟
      deptime: true, // 花费时间和倒计时切换
      spinning: false, // 加载动画
      encourageArray: [
        '666啊！老铁',
        '你这操作我给满分！',
        '你离超哥的高度越来越近了！',
        '你离小韩的高度越来越近了！',
        '超哥给你点了个赞！',
        '小韩给你点了个赞！',
        '太厉害了！',
        '精彩的操作，闪爆他们！'
      ],
      onDisabled: false, // 选择难度按钮禁用控制标志
      boxWidth: '500px', // 游戏盒子宽度
      cards: 'startCards',
      cardsAmount: 6, // 每行卡片数量
      startLevel: '初出茅庐',
      GameLevel: [
        {
          level: '初出茅庐',
          cardTitle: 'startCards'
        },
        {
          level: '小试牛刀',
          cardTitle: 'dCards'
        },
        {
          level: '大展身手',
          cardTitle: 'startCards'
        },
        {
          level: '炉火纯青',
          cardTitle: 'startCards'
        },
        {
          level: '登峰造极',
          cardTitle: 'startCards'
        },
        {
          level: '位列神坛',
          cardTitle: 'startCards'
        }
      ],
      finish: false, // 结束的标志
      startGameInterval: null, // 游戏开始的定时器
      start: false, // 游戏开始的标志
      totalTime: {
        // 计时
        minute: 0,
        second: 0
      },
      backgroundShow: 0, // 显示第几张背景图
      backgroundImage: [
        // 背景图列表
        {
          background: require('@/assets/startLevel/background.jpg'),
          ContentB:
            'linear-gradient(to bottom right, rgb(114, 135, 254), rgb(130, 88, 186))'
        },
        {
          background: require('@/assets/dLevel/background.jpg'),
          ContentB: 'linear-gradient(to bottom right, #01ccfe, #08a4fa,#1268f3)'
        },
        {
          background: require('@/assets/fLevel/background.jpg'),
          ContentB:
            'linear-gradient(to right, #eea2a2 0%, #bbc1bf 19%, #57c6e1 42%, #b49fda 79%, #7ac5d8 100%)'
        },
        {
          background: require('@/assets/gLevel/background.jpg'),
          ContentB: 'linear-gradient(to right, #ff9569 0%, #e92758 100%)'
        }
      ],
      turns: 0, // 记录翻动次数
      filperList: [], // 存储翻动过的卡片
      memoryCards: [], // 存储卡片的数组
      gutterKey: 1,
      vgutterKey: 1,
      colCountKey: 2,
      colCounts,
      gutters,
      vgutters,
      startCards: [
        {
          name: 'f2',
          img: require('@/assets/startLevel/f2.jpg')
        },
        {
          name: 'f3',
          img: require('@/assets/startLevel/f3.jpg')
        },
        {
          name: 'f4',
          img: require('@/assets/startLevel/f4.jpg')
        },
        {
          name: 'f5',
          img: require('@/assets/startLevel/f5.jpg')
        },
        {
          name: 'f1',
          img: require('@/assets/startLevel/f1.jpg')
        },
        {
          name: 'f6',
          img: require('@/assets/startLevel/f6.jpg')
        }
      ],
      fCards: [
        {
          name: 'x0',
          img: require('@/assets/fLevel/x0.jpg')
        },
        {
          name: 'x1',
          img: require('@/assets/fLevel/x1.jpg')
        },
        {
          name: 'x2',
          img: require('@/assets/fLevel/x2.jpg')
        },
        {
          name: 'x3',
          img: require('@/assets/fLevel/x3.jpg')
        },
        {
          name: 'x4',
          img: require('@/assets/fLevel/x4.jpg')
        },
        {
          name: 'x5',
          img: require('@/assets/fLevel/x5.jpg')
        },
        {
          name: 'x7',
          img: require('@/assets/fLevel/x7.jpg')
        },
        {
          name: 'x6',
          img: require('@/assets/fLevel/x6.jpg')
        },
        {
          name: 'x8',
          img: require('@/assets/fLevel/x8.jpg')
        },
        {
          name: 'x9',
          img: require('@/assets/fLevel/x9.jpg')
        },
        {
          name: 'x10',
          img: require('@/assets/fLevel/x10.jpg')
        },
        {
          name: 'x11',
          img: require('@/assets/fLevel/x11.jpg')
        },
        {
          name: 'x12',
          img: require('@/assets/fLevel/x12.jpg')
        },
        {
          name: 'x13',
          img: require('@/assets/fLevel/x13.jpg')
        },
        {
          name: 'x14',
          img: require('@/assets/fLevel/x14.jpg')
        },
        {
          name: 'x15',
          img: require('@/assets/fLevel/x15.jpg')
        }
      ],
      gCards: [
        {
          name: 'hai (0)',
          img: require('@/assets/gLevel/hai (0).jpg')
        },
        {
          name: 'hai (1)',
          img: require('@/assets/gLevel/hai (1).jpg')
        },
        {
          name: 'hai (2)',
          img: require('@/assets/gLevel/hai (2).jpg')
        },
        {
          name: 'hai (3)',
          img: require('@/assets/gLevel/hai (3).jpg')
        },
        {
          name: 'hai (4)',
          img: require('@/assets/gLevel/hai (4).jpg')
        },
        {
          name: 'hai (5)',
          img: require('@/assets/gLevel/hai (5).jpg')
        },
        {
          name: 'hai (6)',
          img: require('@/assets/gLevel/hai (6).jpg')
        },
        {
          name: 'hai (7)',
          img: require('@/assets/gLevel/hai (7).jpg')
        },
        {
          name: 'hai (8)',
          img: require('@/assets/gLevel/hai (8).jpg')
        },
        {
          name: 'hai (9)',
          img: require('@/assets/gLevel/hai (9).jpg')
        },
        {
          name: 'hai (10)',
          img: require('@/assets/gLevel/hai (10).jpg')
        },
        {
          name: 'hai (11)',
          img: require('@/assets/gLevel/hai (11).jpg')
        },
        {
          name: 'hai (12)',
          img: require('@/assets/gLevel/hai (12).jpg')
        },
        {
          name: 'hai (13)',
          img: require('@/assets/gLevel/hai (13).jpg')
        },
        {
          name: 'hai (14)',
          img: require('@/assets/gLevel/hai (14).jpg')
        },
        {
          name: 'hai (15)',
          img: require('@/assets/gLevel/hai (15).jpg')
        },
        {
          name: 'hai (16)',
          img: require('@/assets/gLevel/hai (16).jpg')
        },
        {
          name: 'hai (17)',
          img: require('@/assets/gLevel/hai (17).jpg')
        },
        {
          name: 'hai (18)',
          img: require('@/assets/gLevel/hai (18).jpg')
        },
        {
          name: 'hai (19)',
          img: require('@/assets/gLevel/hai (19).jpg')
        },
        {
          name: 'hai (20)',
          img: require('@/assets/gLevel/hai (20).jpg')
        },
        {
          name: 'hai (21)',
          img: require('@/assets/gLevel/hai (21).jpg')
        },
        {
          name: 'hai (22)',
          img: require('@/assets/gLevel/hai (22).jpg')
        },
        {
          name: 'hai (23)',
          img: require('@/assets/gLevel/hai (23).jpg')
        }
      ],
      dCards: [
        {
          name: 'fruit0',
          img: require('@/assets/dLevel/fruit0.jpg')
        },
        {
          name: 'fruit1',
          img: require('@/assets/dLevel/fruit1.jpg')
        },
        {
          name: 'fruit2',
          img: require('@/assets/dLevel/fruit2.jpg')
        },
        {
          name: 'fruit3',
          img: require('@/assets/dLevel/fruit3.jpg')
        },
        {
          name: 'fruit4',
          img: require('@/assets/dLevel/fruit4.jpg')
        },
        {
          name: 'fruit5',
          img: require('@/assets/dLevel/fruit5.jpg')
        },
        {
          name: 'fruit6',
          img: require('@/assets/dLevel/fruit6.jpg')
        },
        {
          name: 'fruit7',
          img: require('@/assets/dLevel/fruit7.jpg')
        },
        {
          name: 'fruit8',
          img: require('@/assets/dLevel/fruit8.jpg')
        },
        {
          name: 'fruit9',
          img: require('@/assets/dLevel/fruit9.jpg')
        },
        {
          name: 'fruit10',
          img: require('@/assets/dLevel/fruit10.jpg')
        },
        {
          name: 'fruit11',
          img: require('@/assets/dLevel/fruit11.jpg')
        }
      ]
    }
  },
  beforeDestroy () {
    clearInterval(this.startGameInterval)
  },
  methods: {
    handleChange (a) {
      this.startLevel = a
      if (a === '初出茅庐') {
        this.spinning = true
        this.cards = 'startCards'
        this.cardsAmount = 6;
        (this.boxWidth = '500px'), (this.backgroundShow = 0)
        this.onReset()
      }
      if (a === '小试牛刀') {
        this.spinning = true
        this.cards = 'dCards'
        this.boxWidth = '770px'
        this.cardsAmount = 4
        this.backgroundShow = 1
        this.onReset()
      }
      if (a === '大展身手') {
        this.spinning = true
        this.cards = 'fCards'
        this.boxWidth = '950px'
        this.cardsAmount = 3
        this.backgroundShow = 2
        this.onReset()
      }
      if (a === '炉火纯青') {
        this.spinning = true
        this.cards = 'gCards'
        this.boxWidth = '1400px'
        this.cardsAmount = 2
        this.backgroundShow = 3
        this.onReset()
      }
      if (a === '登峰造极') {
        this.spinning = true
        const that = this
        this.$confirm({
          title: '你确定要进入这个模式嘛？',
          content: '点击确定开始倒计时，开启"登峰造极"模式',
          onOk () {
            that.cards = 'gCards'
            that.boxWidth = '1400px'
            that.cardsAmount = 2
            that.backgroundShow = 3
            that.onReset()
            that.minD = 2
            that.deptime = false
            that.onDisabled = true
            that.resetButton = true
            that._countdown()
          },
          onCancel () {}
        })
      }
    },
    _countdown () {
      this._DTime()
      this.countdownStart = setInterval(this._DTime, 1000)
    },
    _DTime () {
      if (this.secD != 0) {
        this.secD--
        return
      }
      this.minD--
      this.secD = 59
      if (this.minD < 0) {
        clearInterval(this.countdownStart)
        this.$message.error('很遗憾，时间到了！')
        const that = this
        this.$confirm({
          title: '是否继续挑战这个模式嘛？',
          content: '点击确定开始倒计时，点击取消返回第一关',
          onOk () {
            that.cards = 'gCards'
            that.boxWidth = '1400px'
            that.cardsAmount = 2
            that.backgroundShow = 3
            that.onReset()
            that.minD = 1
            that.deptime = false
            that.onDisabled = true
            that.resetButton = true
            that._countdown()
          },
          onCancel () {
            that.deptime = true
            that.handleChange('初出茅庐')
            that.startLevel = '初出茅庐'
            that.onReset()
            that.onDisabled = false
            that.resetButton = false
          }
        })
      }
    },
    onReset () {
      this.victoryFire = true
      this.memoryCards = []
      this[this.cards].forEach(_ => {
        this.$set(_, 'isfilper', false)
        this.$set(_, 'ismatched', false)
      })
      this.memoryCards = _.shuffle(
        this.memoryCards.concat(
          _.cloneDeep(this[this.cards]),
          _.cloneDeep(this[this.cards])
        )
      )
      setTimeout(() => {
        this.totalTime.second = 0
        this.totalTime.minute = 0
        this.turns = 0
        this.filperList = []
        clearInterval(this.startGameInterval)
        this.finish = false
        this.start = false
        this.spinning = false
      }, 200)
    },
    filperCards (card) {
      if (card.isfilper || card.ismatched || this.filperList.length === 2) {
        return
      }
      this.turns++
      card.isfilper = true
      if (this.filperList.length < 2) {
        this.filperList.push(card)
      }
      if (this.filperList.length === 2) {
        this._match()
      }
      if (!this.start) {
        this._startGame()
      }
    },
    _tick () {
      if (this.totalTime.second != 59) {
        this.totalTime.second++
        return
      }
      this.totalTime.minute++
      this.totalTime.second = 0
    },
    _startGame () {
      this._tick()
      this.startGameInterval = setInterval(this._tick, 1000)
      this.start = true
    },
    _match () {
      if (this.filperList[0].name === this.filperList[1].name) {
        const onCount = parseInt(Math.random() * this.encourageArray.length)
        setTimeout(() => {
          this.$message.success(this.encourageArray[onCount])
          this.filperList.forEach(_ => (_.ismatched = true))
          this.filperList = []
        }, 800)
        if (this.memoryCards.every(_ => _.ismatched === true)) { // 游戏胜利后
          this.victoryFire = false
          this.finish = true
          clearInterval(this.startGameInterval)
        }
      } else {
        setTimeout(() => {
          this.filperList.forEach(_ => {
            _.ismatched = false
            _.isfilper = false
          })
          this.filperList = []
        }, 800)
      }
    }
  },
  computed: {
    min () {
      if (this.totalTime.minute < 10) {
        return '0' + this.totalTime.minute
      }
      return this.totalTime.minute
    },
    sec () {
      if (this.totalTime.second < 10) {
        return '0' + this.totalTime.second
      }
      return this.totalTime.second
    }
  },
  created () {
    this[this.cards].forEach(_ => {
      this.$set(_, 'isfilper', false)
      this.$set(_, 'ismatched', false)
    })
    this.memoryCards = _.shuffle(
      this.memoryCards.concat(
        _.cloneDeep(this[this.cards]),
        _.cloneDeep(this[this.cards])
      )
    )
  }
}
</script>
<style lang="less">
.onHandle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .depleteTime {
    display: flex;
  }
  p {
    text-align: center;
    line-height: 22px;
    color: white;
    min-width: 45px;
    height: 22px;
    background: @primary-color;
    border-radius: 4px;
  }
  .rounds {
    display: flex;
    align-items: center;
  }
}
.CardsCol {
  perspective: 1000px;
}
.face img,
.back img {
  border-radius: 25px;
}
.face,
.back {
  backface-visibility: hidden;
  transition: 0.6s;
  transform-style: preserve-3d;
}
.back {
  position: absolute;
  transform: rotateY(-180deg);
}
.filper .back {
  transform: rotateY(0deg);
}
.filper .face {
  transform: rotateY(-180deg);
}
.matched {
  opacity: 0;
}
</style>
