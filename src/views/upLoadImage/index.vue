<template>
  <!-- 仿写微信图片上传功能 -->
  <div class="invdocmodalClass">
    <a-upload
      action="#"
      list-type="picture-card"
      :file-list="invdocFileList"
      @preview="handlePreview"
      @change="handleChange"
    >
      <div v-if="invdocFileList.length < 8">
        <a-icon type="plus" />
        <div class="ant-upload-text">上传图片</div>
      </div>
    </a-upload>
    <p class="UploadImgCount">已上传<span> {{invdocFileList.length}} </span>张图片</p>
    <div
      v-if="previewVisible"
      ref="onModal"
      class="onModal"
      @mousedown.prevent="ImgBoxMove"
      :style="{position:'fixed',left: moveInstanceLeft,top: moveInstanceTop,height:onModalHeight}"
    >
      <div class="onPreviewBox" v-for="(fileImg,index) in invdocFileList" :key="index">
        <div v-if="fileName===fileImg.name">
          <img
            ref="onImgRef"
            :src="fileImg.fileurl"
            @mousedown.stop.prevent="PreImgMove"
            :style="{position:'absolute',left: ImgInstanceLeft,top: ImgInstanceTop,transform:` translateX(-50%) translateY(-50%) rotate(${XzxzAngle}deg) scale(${Sfdx})`,width: '80%'}"
          />
          <span @click="handleCancel()" class="onCancellogo">X</span>
          <span class="iconfont iconzuojiantou onLeft" @click="onLeftClick(index)"></span>
          <span class="iconfont iconyoujiantou1 onRight" @click="onRightClick(index)"></span>
          <div class="operateImg">
            <span class="iconfont iconxiangzuoxuanzhuan" @click="onXzxz"></span>
            <span class="iconfont iconjiahao1" @click="onTpfd"></span>
            <div class="ImgFullScale">
              <span class="iconfont iconFullScreen" @click="onFullImg" v-if="onFullScale"></span>
              <span class="iconfont iconc-scale-to-original" @click="onScaleImg" v-else></span>
            </div>
            <span class="iconfont iconjianhao" @click="onTpsx"></span>
            <span class="iconfont iconxiangyouxuanzhuan" @click="onXyxz"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
function getBase64 (file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}
export default {
  name: 'goodsNotice',
  data () {
    return {
      originX: 0,
      originY: 0,

      onModalHeight: undefined,
      ImgMouseHandle: false,
      BoxMoveFlag: false,
      onLargeX: 0,
      onLargeY: 0,
      moveInstanceLeft: '50%',
      moveInstanceTop: '50%',
      ImgInstanceLeft: '50%',
      ImgInstanceTop: '50%',

      ImgSureMove: true,
      ImgMoveFlag: false,
      onImgLargeX: 0,
      onImgLargeY: 0,

      onFullScale: true, // 预览图按钮控制
      Sfdx: 1, // 预览图缩放大小
      XzxzAngle: 0, // 预览图向左旋转的角度
      fileName: '',
      previewVisible: false,
      previewImage: '',
      invdocFileList: [],

      uploadClick: 'uploadNull',
      filesVal: '', // 物料档案图片路径
      presiveTitle: ''
    }
  },
  methods: {
    // 预览图片外层div移动要使用原生js的方法，否则会有鼠标移动过快元素跟不上的bug
    ImgBoxMove (e) {
      // 获取拖拽起始位置坐标
      this.BoxMoveFlag = true
      this.onLargeX = e.layerX
      this.onLargeY = e.layerY
      const that = this
      document.onmousemove = (e) => {
        if (that.BoxMoveFlag) {
          that.moveInstanceLeft = e.pageX - that.onLargeX + 'px'
          that.moveInstanceTop = e.pageY - that.onLargeY + 'px'
        }
      }
      document.onmouseup = (e) => {
        that.ImgMoveFlag = false
        that.BoxMoveFlag = false
      }
    },
    PreImgMove (e) {
      // 获取拖拽起始位置坐标
      this.ImgMoveFlag = true
      this.onImgLargeX = e.layerX
      this.onImgLargeY = e.layerY
      const that = this
      document.onmousemove = (e) => {
        if (that.ImgMoveFlag && that.ImgSureMove) {
          that.ImgInstanceLeft =
          e.pageX -
          that.$refs.onModal.offsetLeft -
          that.$refs.onModal.clientLeft -
          that.onImgLargeX +
          'px'
          that.ImgInstanceTop =
          e.pageY -
          that.$refs.onModal.offsetTop -
          that.$refs.onModal.clientTop -
          that.onImgLargeY +
          'px'
        }
      }
      document.onmouseup = (e) => {
        that.ImgMoveFlag = false
      }
    },

    // 点击图片左侧箭头
    onLeftClick (index) {
      this.ImgInstanceLeft = '50%'
      this.ImgInstanceTop = '50%'
      this.Sfdx = 1
      this.XzxzAngle = 0
      if (index > 0) {
        this.fileName = this.invdocFileList[index - 1].name
      } else {
        this.$message.warning('已经是第一张了！')
      }
      this.setImgHeight()
    },
    // 点击图片预览右侧箭头
    onRightClick (index) {
      this.ImgInstanceLeft = '50%'
      this.ImgInstanceTop = '50%'
      this.Sfdx = 1
      this.XzxzAngle = 0
      if (index < this.invdocFileList.length - 1) {
        this.fileName = this.invdocFileList[index + 1].name
      } else {
        this.$message.warning('已经是最后一张了！')
      }
      this.setImgHeight()
    },
    handleCancel () {
      this.ImgInstanceLeft = '50%'
      this.ImgInstanceTop = '50%'
      this.Sfdx = 1
      this.XzxzAngle = 0
      this.previewVisible = false
    },
    setImgHeight () {
      const self = this
      this.$nextTick(() => {
        const oImg = this.$refs.onImgRef[0]
        // 获取图片的高度 -- Ding ~
        oImg.onload = function () {
          self.onModalHeight = (oImg.height + 100) + 'px'
        }
      })
    },
    async handlePreview (file) {
      this.fileName = file.name
      this.previewImage = file.url || file.preview
      this.previewVisible = true
      this.setImgHeight()
    },
    handleChange ({ file, fileList }) {
      if (fileList.length > 1) {
        for (let i = 0; i < fileList.length - 1; i++) {
          if (fileList[i].name === fileList[fileList.length - 1].name) {
            this.$message.warning('请勿上传重复的图片！')
            fileList.splice(fileList.length - 1, 1)
          }
        }
      }
      if (fileList.length > 0) {
        fileList.forEach(async item => {
          if (item.originFileObj) {
            item.fileurl = await getBase64(item.originFileObj)
          }
        })
      }
      if (file.status === 'done') {
        this.$message.success(`${file.name}上传成功`)
      }
      this.invdocFileList = fileList
    },

    // 图片预览的操作按钮
    onFullImg () {
      this.Sfdx = 2.1
      this.onFullScale = false
    },
    onScaleImg () {
      this.Sfdx = 1
      this.onFullScale = true
    },
    // 向左旋转
    onXzxz () {
      this.XzxzAngle = this.XzxzAngle - 90
      if (this.XzxzAngle / 90 % 2) {
        const oImg = this.$refs.onImgRef[0]
        console.log(666)
        const self = this
        this.$nextTick(() => {
        // 获取图片的高度 -- Ding ~
          oImg.onload = function () {
            oImg.style.height = oImg.width + 'px'
          }
        })
      }
    },
    // 向右旋转
    onXyxz () {
      this.XzxzAngle = this.XzxzAngle + 90
    },
    // 图片放大
    onTpfd () {
      if (this.Sfdx > 2) {
        return
      }
      this.Sfdx = this.Sfdx + 0.1
    },
    // 图片缩小
    onTpsx () {
      if (this.Sfdx < 0.2) {
        return
      }
      this.Sfdx = this.Sfdx - 0.1
    }
  }
}
</script>
<style lang="less">
.invdocmodalClass{
  position: relative;
}
.ant-upload-list-picture-card {
    margin-left: 112px;
    width: 224px;
    height: 108px;
    overflow: hidden;
  }
  .ant-upload-select-picture-card {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 99;
  }
.UploadImgCount{
  position: absolute;
  left: .5%;
  font-size: 10px;
  color: rgba(0, 0, 0, 0.4);
  transition: .4s;
  span{
  transition: .4s;
    color: @primary-color;
    opacity: 0.4;
  }
}
.onModal {
  transform: translateX(-50%) translateY(-50%);
  z-index: 99;
  width: 500px;
  min-height: 270px;
  background: gray;
  padding: 15px!important;
  overflow: hidden;
  .onPreviewBox {
    width: 100%;
    height: 100%;
    img {
      display: block;

    }
    .onCancellogo {
      position: absolute;
      right: 1%;
      top: 1%;
      cursor: pointer;
      font-size: 20px;
      transition: 0.4s;
    }
    .onCancellogo:hover {
      font-size: 25px;
      color: white;
    }
    .operateImg {
      font-weight: bold;
      transition: 0.4s;
      position: absolute;
      bottom: 5%;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      justify-content: space-around;
      align-items: center;
      width: 60%;
      height: 28px;
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      .iconc-scale-to-original {
        font-size: 22px;
        color: rgba(0, 0, 0, 0.4);
        transition: 0.2s;
        cursor: pointer;
      }
      .iconc-scale-to-original:hover {
        color: rgba(255, 255, 255, 1);
      }
      .iconFullScreen {
        font-size: 22px;
        color: rgba(0, 0, 0, 0.4);
        transition: 0.2s;
        cursor: pointer;
      }
      .iconFullScreen:hover {
        color: rgba(255, 255, 255, 1);
      }
      .iconjiahao1 {
        color: rgba(0, 0, 0, 0.4);
        transition: 0.2s;
        cursor: pointer;
      }
      .iconjiahao1:hover {
        transform: scale(1.3);
        color: rgba(255, 255, 255, 1);
      }
      .iconjianhao {
        color: rgba(0, 0, 0, 0.4);
        transition: 0.2s;
        cursor: pointer;
      }
      .iconjianhao:hover {
        transform: scale(1.3);
        color: rgba(255, 255, 255, 1);
      }
      .iconxiangyouxuanzhuan {
        color: rgba(0, 0, 0, 0.4);
        transition: 0.2s;
        cursor: pointer;
      }
      .iconxiangyouxuanzhuan:hover {
        transform: scale(1.3);
        color: rgba(255, 255, 255, 1);
      }
      .iconxiangzuoxuanzhuan {
        color: rgba(0, 0, 0, 0.4);
        transition: 0.2s;
        cursor: pointer;
      }
      .iconxiangzuoxuanzhuan:hover {
        transform: scale(1.3);
        color: rgba(255, 255, 255, 1);
      }
    }
    .operateImg:hover {
      background: rgba(0, 0, 0, 0.4);
    }

    .onLeft {
      transition: 0.2s;
      cursor: pointer;
      position: absolute;
      left: 1%;
      top: 45%;
      font-size: 20px;
      color: rgba(0, 0, 0, 0.4);
    }
    .onLeft:hover {
      color: rgba(0, 0, 0, 0.7);
      font-size: 25px;
    }
    .onRight:hover {
      color: rgba(0, 0, 0, 0.7);
      font-size: 25px;
    }
    .onRight {
      font-size: 20px;
      color: rgba(0, 0, 0, 0.4);
      transition: 0.2s;
      cursor: pointer;
      position: absolute;
      right: 1%;
      top: 45%;
    }
  }
}
// 图片预览样式
.previewbox {
  width: 100%;
  height: 100%;
  z-index: 99;
  position: absolute;
  top: 1%;
  ul {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    width: 60%;
    height: 60%;
    .onPreviewImgLi {
      overflow: hidden;
      width: 100%;
      height: 100%;
      .onPreviewImg {
        width: 100%;
        height: 100%;
      }
    }
  }
}
.UploadImgCount:hover{
  color: rgba(0, 0, 0, 0.8);
  span{
    color: @primary-color;
    opacity: 1;
  }
}
</style>
