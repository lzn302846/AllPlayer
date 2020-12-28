<template>
                    <!-- 仿写微信图片上传功能 -->
  <div class="invdocmodalClass" v-if="head[headMsg]">
    <div :style="{height:modalHeight}" class="form-container">
          <a-row>
            <a-col :span="7">
              <div class="clearfix">
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
                <div
                 v-if="previewVisible"
                  ref="onModal"
                  class="onModal"
                  @mousedown.prevent="boxMouseDown"
                  @mouseup="boxMouseUp"
                  @mousemove="boxMouseMove"
                  @mouseleave="boxMouseLeave"
                  :style="{position:'fixed',left: moveInstanceLeft,top: moveInstanceTop,}"
                >
                  <div
                      class="onPreviewBox"
                      v-for="(fileImg,index) in invdocFileList"
                      :key="index"
                      >
                    <div v-if="fileName===fileImg.name">
                      <img
                      :src="fileImg.fileurl"
                      @mousedown.stop.prevent="ImgMouseDown"
                      @mouseup.stop.prevent="ImgMouseUp"
                      @mousemove.stop.prevent="ImgMouseMove"
                      @mouseout.stop.prevent="ImgMouseLeave"
                      :style="{position:'absolute',left: ImgInstanceLeft,top: ImgInstanceTop,transform:` translateX(-50%) translateY(-50%) rotate(${XzxzAngle}deg) scale(${Sfdx})`}"
                    />
                    <span @click="handleCancel()" class="onCancellogo">X</span>
                    <span class="iconfont iconzuojiantou onLeft" @click="onLeftClick(index)"></span>
                        <span class="iconfont iconyoujiantou1 onRight" @click="onRightClick(index)"></span>
                        <div class="operateImg">
                          <span class="iconfont iconxiangzuoxuanzhuan" @click="onXzxz"></span>
                          <span class="iconfont iconjiahao1" @click="onTpfd"></span>
                          <div class="ImgFullScale">
                            <span
                              class="iconfont iconFullScreen"
                              @click="onFullImg"
                              v-if="onFullScale"
                            ></span>
                            <span
                              class="iconfont iconc-scale-to-original"
                              @click="onScaleImg"
                              v-else
                            ></span>
                          </div>
                          <span class="iconfont iconjianhao" @click="onTpsx"></span>
                          <span class="iconfont iconxiangyouxuanzhuan" @click="onXyxz"></span>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            </a-col>
        </a-row>
      </div>
    </template>
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
  data () {
    return {
      ImgMouseHandle: false,
      BoxMoveFlag: false,
      onLargeX: 0,
      onLargeY: 0,
      moveInstanceLeft: '35%',
      moveInstanceTop: '20%',

      ImgSureMove: true,
      ImgMoveFlag: false,
      onImgLargeX: 0,
      onImgLargeY: 0,
      ImgInstanceLeft: '50%',
      ImgInstanceTop: '50%',

      onFullScale: true, // 预览图按钮控制
      Sfdx: 1, // 预览图缩放大小
      XzxzAngle: 0, // 预览图向左旋转的角度
      fileName: '',
      previewVisible: false,
      previewImage: '',
      invdocFileList: [],

      uploadClick: 'uploadNull',
      filesVal: '', // 物料档案图片路径
      newlyIncreased: false,
      presiveTitle: '',
      headMsg: 0,
      width: '95%',
      modalHeight: window.innerHeight - 220 + 'px',
      bodyStyle: {
        height: this.modalHeight
      }
    }
  },
  methods: {
    // 图片移动
    ImgMouseLeave () {
      this.ImgMoveFlag = false
    },
    ImgMouseUp () {
      this.ImgMoveFlag = false
    },
    ImgMouseDown (e) {
      this.ImgMoveFlag = true
      this.onImgLargeX = e.layerX
      this.onImgLargeY = e.layerY
    },
    ImgMouseMove (e) {
      const that = this
      if (this.ImgMoveFlag && this.ImgSureMove) {
        that.ImgInstanceLeft = (e.pageX - that.$refs.onModal.offsetLeft - that.$refs.onModal.clientLeft - that.onImgLargeX) + 'px'
        that.ImgInstanceTop = (e.pageY - that.$refs.onModal.offsetTop - that.$refs.onModal.clientTop - that.onImgLargeY) + 'px'
      }
    },
    // 外层div移动
    boxMouseLeave () {
      this.BoxMoveFlag = false
    },
    boxMouseUp () {
      this.ImgMoveFlag = false
      this.BoxMoveFlag = false
    },
    boxMouseDown (e) {
      this.BoxMoveFlag = true
      this.onLargeX = e.layerX
      this.onLargeY = e.layerY
    },
    boxMouseMove (e) {
      const that = this
      if (this.BoxMoveFlag) {
        that.moveInstanceLeft = e.pageX - that.onLargeX + 'px'
        that.moveInstanceTop = e.pageY - that.onLargeY + 'px'
      }
    },
    // 点击新增清空表体数据
    clearBodyMsg () {
      this.dataSource = {}
    },
    // 点击图片左侧箭头
    onLeftClick (index) {
      this.Sfdx = 1
      this.XzxzAngle = 0
      if (index > 0) {
        this.fileName = this.invdocFileList[index - 1].name
      } else {
        this.$message.warning('已经是第一张了！')
      }
    },
    // 点击图片预览右侧箭头
    onRightClick (index) {
      this.Sfdx = 1
      this.XzxzAngle = 0
      if (index < this.invdocFileList.length - 1) {
        this.fileName = this.invdocFileList[index + 1].name
      } else {
        this.$message.warning('已经是最后一张了！')
      }
    },
    handleCancel () {
      this.Sfdx = 1
      this.XzxzAngle = 0
      this.previewVisible = false
    },
    async handlePreview (file) {
      this.fileName = file.name
      // if (!file.url && !file.preview) {
      //   file.preview = await getBase64(file.originFileObj);
      // }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },
    handleChange ({ fileList }) {
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
      this.invdocFileList = fileList
    },

    tabClick (a) {
      this.headMsg = a
      if (this.title === '新增') {
        this.edit(this.presiveTitle[0], this.presiveTitle[1], this.presiveTitle[2])
        this.changeInitialValue()
        this.editType = 'add'
        this.title = '新增'
      } else if (this.title === '修改') {
        this.edit(this.presiveTitle[0], this.presiveTitle[1], this.presiveTitle[2])
      } else if (this.title === '查看') {
        this.examine(this.presiveTitle[0], this.presiveTitle[1], this.presiveTitle[2])
      }
    },

    onBodyAddShow () {
      this.changeBodyeditable()
      this._onBodyAdd()
    },
    // 新增携带物料分类值
    changeInitialValue () {
      this.$nextTick(() => {
        this.presiveTitle[0]['bd_invdoc.invclassid'] = this.onFieldsValue
        this.form.setFieldsValue({ 'bd_invdoc.invclassid': this.onFieldsValue })
      })
    },
    // 更改body状态,让子表显示
    changeBodyeditable () {
      this.body[0].columns.map(item => {
        item.editable = '1'
      })
    },
    onBeforeEdit (item) {},
    onBeforeBodyEdit (item) {},
    onHeadChange (item, group, art) {
      // this.$nextTick(() => {
      //   Object.assign(this.presiveTitle[0], this.form.getFieldsValue()[this.head[0].code])
      // })
    },

    onBodyChange (item, body, record, index, ds, arg) {
      this.presiveTitle[2][this.body[0].code] = ds
      if (item.code === 'hsmoney') {
        const hsmoney = arg[0]
        if (!this.checkMoney(record, hsmoney)) {
          ds[index].hsmoney = record.invhsmoney
          this.$set(this.dataSource, 'bx_expense_b', ds)
          this.$message.warn('报销金额不能大于发票金额')
        } else {
          this.calcTotalMoney(ds)
          this.caluCjkMoney()
        }
      }

      if (item.code === 'costid' || item.code === 'itemid') {
        this.itemcostChange(item, body, record, index, ds, arg)
      }
      this.cacluCountMoney()
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
    },
    // 用到图片上传的页面，重写_doSave
    _doSave (url) {
      const self = this
      if (this.invdocFileList && this.invdocFileList.length > 0) {
        this.invdocFileList.forEach(item => {
          Object.assign(item, { filename: item.name })
        })
      }
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err && self._checkValid()) {
          self.confirmLoading = true
          const params = self._getBillData(values)
          const action = self.beforeSave({
            url: url,
            params: {
              filesVal: this.invdocFileList ? this.invdocFileList : undefined,
              func: self.func,
              tabs: params
            }
          })

          if (action === false) {
            self.confirmLoading = false
            return
          }
          const SavePromis = self.beforeSave2(action)
          SavePromis.then(
            data => {
              'use strict'
              self.saveBill(data)
            },
            err => {
              'use strict'
              self.$message.error(err)
              self.confirmLoading = false
            }
          )
        } else {
          // var filedName='';
          // for(var item in err){
          //     for(var item2 in err[item]){
          //          filedName=item2;
          //          break;
          //     }
          // }
          // if(filedName!='')
          // self.$refs[filedName][0].$el.scrollIntoView({ behavior: "smooth" });
        }
      })
      this.visible = false
    }
  }
}
</script>
<style lang="scss">
* {
  margin: 0;
  padding: 0;
}
ul,
ol,
li {
  list-style: none;
}
.onModal {
  z-index: 99;
  width: 500px;
  height: 500px;
  background: gray;
  padding: 15px;
  overflow: hidden;
  .onPreviewBox{
    width: 100%;
    height: 100%;
    img{
      width: 80%;
      height: 80%;
    }
    .onCancellogo{
      position: absolute;
      right: 1%;
      top: 1%;
      cursor: pointer;
      font-size: 20px;
      transition: .4s;
    }
    .onCancellogo:hover{
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
.invdocmodalClass {
  .ant-form-item-label {
    line-height: 1rem !important;
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
  .clearfix {
    position: relative;
    margin: 0;
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
.form-container {
  // 打开滚动条固定显示
  overflow-y: scroll;

  /* 2020/10/12 新增代码 定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
  $scrollBarSize: 10px;
  &::-webkit-scrollbar {
    width: $scrollBarSize;
    height: $scrollBarSize;
    background-color: transparent;
    display: none;
  }

  & .-o-scrollbar {
    display: none;
  }

  /* 兼容IE */
  -ms-overflow-style: none;
  -ms-scroll-chaining: chained;
  -ms-content-zooming: zoom;
  -ms-scroll-rails: none;
  -ms-content-zoom-limit-min: 100%;
  -ms-content-zoom-limit-max: 500%;
  -ms-scroll-snap-type: proximity;
  -ms-scroll-snap-points-x: snapList(100%, 200%, 300%, 400%, 500%);

  /* 定义滚动条轨道 */
  &::-webkit-scrollbar-track {
    background-color: transparent;
  }

  /* 定义滑块 */
  &::-webkit-scrollbar-thumb {
    border-radius: $scrollBarSize;
    background-color: #eee;
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);

    &:hover {
      background-color: #dddddd;
    }

    &:active {
      background-color: #bbbbbb;
    }
  }
  &.colorWeak {
    filter: invert(80%);
  }
}
.card-container > .ant-tabs-card > .ant-tabs-content {
  margin-top: -16px;
}

.card-container > .ant-tabs-card > .ant-tabs-content > .ant-tabs-tabpane {
  background: #fff;
  padding: 16px;
}

.card-container > .ant-tabs-card > .ant-tabs-bar {
  border-color: #fff;
}

.card-container > .ant-tabs-card > .ant-tabs-bar .ant-tabs-tab {
  border-color: transparent;
  background: transparent;
}

.card-container > .ant-tabs-card > .ant-tabs-bar .ant-tabs-tab-active {
  border-color: #fff;
  background: #fff;
}
</style>
