<template>
  <div id="app">
    <div class="d-flex flex-row justify-content-center py-3">
      <div class="turns p-3">
        <span class="btn btn-info">
          翻动次数 :
          <span class="badge" :class="finish ? 'badge-success' : 'badge-light'">{{turns}}</span>
        </span>
      </div>
      <div class="totalTime p-3">
        <span class="btn btn-info">
          花费时间 :
          <span class="badge" :class="finish ? 'badge-success' : 'badge-light'">{{min}} : {{sec}}</span>
        </span>
      </div>
      <div class="totalTime p-3">
        <button class="btn btn-info" @click="reset" :disabled="!start">重置</button>
      </div>
    </div>

    <div class="row">
      <div class="col-md-6 col-lg-6 col-xl-5 mx-auto">
        <div class="row justify-content-md-center">
          <div
            v-for="card in memoryCards"
            class="col-auto mb-3 flip-container"
            :class="{ 'flipped': card.isFlipped, 'matched' : card.isMatched }"
            @click="flipCard(card)"
          >
            <div class="memorycard">
              <div class="front border shadow">
                <img width="100" height="150" src="@/assets/xjy.jpg" />
              </div>
              <div class="back border" style="width: 100px; height: 150px;">
                <img width="100" height="150" :src="card.img" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 存储相同的卡片
      memoryCards: [],
      // 存储翻动的卡片
      flippedCards: [],
      // 结束
      finish: false,
      // 是否显示
      show: true,
      // 初识卡片
      cards: [
        {
          name: 'Apple',
          img: require('@/assets/f2.jpg')
        },
        {
          name: 'Banana',
          img: require('@/assets/f3.jpg')
        },
        {
          name: 'Orange',
          img: require('@/assets/f4.jpg')
        },
        {
          name: 'Pineapple',
          img: require('@/assets/f5.jpg')
        },
        {
          name: 'Strawberry',
          img: require('@/assets/x1.jpg')
        },
        {
          name: 'watermelon',
          img: require('@/assets/x2.jpg')
        }
      ],
      // 是否开始游戏
      start: false,
      // 记录翻转次数
      turns: 0,
      // 花费时间
      totalTime: {
        minutes: 0,
        seconds: 0
      }
    }
  },
  created () {
    // 在最开始的时候，给卡片的每一个项都加上是否翻动和匹配的属性
    this.cards.forEach(card => {
      this.$set(card, 'isFlipped', false)
      this.$set(card, 'isMatched', false)
    })
    // 每次开始游戏打乱数组的顺序
    // _.shuffle返回一个被打乱顺序的数组
    // concat 数组的合并
    // _.cloneDeep 深拷贝括号里面的值
    this.memoryCards = _.shuffle(
      this.memoryCards.concat(_.cloneDeep(this.cards), _.cloneDeep(this.cards))
    )
  },

  methods: {
    // 重置游戏
    reset () {
      // 清除定时器
      clearInterval(this.interval)

      this.cards.forEach(card => {
        this.$set(card, 'isFlipped', false)
        this.$set(card, 'isMatched', false)
      })

      setTimeout(() => {
        this.memoryCards = []
        this.memoryCards = _.shuffle(
          this.memoryCards.concat(
            _.cloneDeep(this.cards),
            _.cloneDeep(this.cards)
          )
        )
        this.totalTime.minutes = 0
        this.totalTime.seconds = 0
        this.start = false
        this.finish = false
        this.turns = 0
        this.flippedCards = []
      }, 600)
    },
    // 翻转卡片
    flipCard (card) {
      // 如果卡片已经匹配，翻转，且翻转的数组中已经有两张，就直接返回
      if (card.isMatched || card.isFlipped || this.flippedCards.length === 2) { return }

      card.isFlipped = true

      // 否则，向数组中添加被点击的卡片
      if (this.flippedCards.length < 2) this.flippedCards.push(card)
      if (this.flippedCards.length === 2)
      // 已经点击两张卡片，则进行两张卡片的相等验证
      { this._match(card) }

      if (!this.start) {
        this._startGame()
      }
    },

    // 卡片相等验证
    _match (card) {
      // 记录翻转次数
      this.turns++

      // 如果两张卡片的 name 属性相等，则认为两张卡片匹配成功
      if (this.flippedCards[0].name === this.flippedCards[1].name) {
        setTimeout(() => {
          // 改变两张卡片的匹配属性
          this.flippedCards.forEach(card => (card.isMatched = true))
          // 将数组置空
          this.flippedCards = []

          // 隐藏两张匹配的卡片包
          this.show = false

          // 判断游戏结束
          if (this.memoryCards.every(card => card.isMatched === true)) {
            clearInterval(this.interval)
            this.finish = true
          }
        }, 400)
      } else {
        setTimeout(() => {
          this.flippedCards.forEach(card => {
            card.isFlipped = false
          })
          this.flippedCards = []
        }, 800)
      }
    },
    // 开始游戏
    _startGame () {
      this._tick()
      this.interval = setInterval(this._tick, 1000)
      this.start = true
    },
    // 记录游戏
    _tick () {
      if (this.totalTime.seconds !== 59) {
        this.totalTime.seconds++
        return
      }

      this.totalTime.minutes++
      this.totalTime.seconds = 0
    }
  },

  computed: {
    // 设置时间格式
    sec () {
      if (this.totalTime.seconds < 10) {
        return '0' + this.totalTime.seconds
      }
      return this.totalTime.seconds
    },
    min () {
      if (this.totalTime.minutes < 10) {
        return '0' + this.totalTime.minutes
      }
      return this.totalTime.minutes
    }
  }
}
</script>
<style>
body {
  background-image: linear-gradient(
    to bottom right,
    rgb(114, 135, 254),
    rgb(130, 88, 186)
  );
  height: 100%;
  width: 100%;
}
.flip-container {
  -webkit-perspective: 1000;
  -moz-perspective: 1000;
  -o-perspective: 1000;
  perspective: 1000;
  min-height: 120px;
  cursor: pointer;
}

.front,
.back {
  -webkit-backface-visibility: hidden;
  -moz-backface-visibility: hidden;
  -o-backface-visibility: hidden;
  backface-visibility: hidden;
  -webkit-transition: 0.6s;
  -webkit-transform-style: preserve-3d;
  -moz-transition: 0.6s;
  -moz-transform-style: preserve-3d;
  -o-transition: 0.6s;
  -o-transform-style: preserve-3d;
  -ms-transition: 0.6s;
  -ms-transform-style: preserve-3d;
  transition: 0.6s;
  transform-style: preserve-3d;
  top: 0;
  left: 0;
  width: 100%;
}

.back {
  -webkit-transform: rotateY(-180deg);
  -moz-transform: rotateY(-180deg);
  -o-transform: rotateY(-180deg);
  -ms-transform: rotateY(-180deg);
  transform: rotateY(-180deg);
  position: absolute;
}

.flip-container.flipped .back {
  -webkit-transform: rotateY(0deg);
  -moz-transform: rotateY(0deg);
  -o-transform: rotateY(0deg);
  -ms-transform: rotateY(0deg);
  transform: rotateY(0deg);
}

.flip-container.flipped .front {
  -webkit-transform: rotateY(180deg);
  -moz-transform: rotateY(180deg);
  -o-transform: rotateY(180deg);
  -ms-transform: rotateY(180deg);
  transform: rotateY(180deg);
}

.matched {
  opacity: 0;
}
</style>
