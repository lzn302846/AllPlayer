
<template>
  <div class="invdocmodalClass" v-if="head[headMsg]">
    <!-- tabs start -->
    <div class="card-container">
      <a-tabs type="card" @tabClick="tabClick">
        <a-tab-pane :tab="ta.name" v-for="(ta,index) in head" :key="index"></a-tab-pane>
      </a-tabs>
    </div>
    <!-- tabs end -->
    <div :style="{height:modalHeight}" class="form-container">
      <a-spin :spinning="confirmLoading">
        <!-- 主表单区域 -->
        <a-form :form="form" :style="{paddingRight:'10px'}">
          <a-row :gutter="10">
            <a-col style="float:right;" v-if="headMsg===0">
              <div class="UploadContent">
                <div class="ImgBox" @dblclick="doubleclick">
                  <p :style="{display:fileObj.fileurl?'none':'block'}">点击下方按钮上传图片</p>
                  <img :src="fileObj.fileurl" :style="{display:fileObj.fileurl?'block':'none'}" />
                </div>
                <a-button class="box">
                  <p>上传</p>
                  <input
                    type="file"
                    ref="inputer"
                    id="fileExport"
                    accept="image/*, application/pdf"
                    @change="subFile"
                  />
                </a-button>
              </div>
            </a-col>
            <a-col
              v-for="item in head[headMsg].children"
              :key="item.id"
              v-bind="item.width"
            >
              <a-form-item :label="item.title" style="text-align:left;margin:0">
                <component
                  :ref="item.code"
                  :is="item._component.is"
                  v-bind="item._component.attrs"
                  @beforesearch="onBeforeEdit(item,head[headMsg])"
                  @change="onHeadChange(item, head[headMsg], arguments)"
                  :read-only="readOnly || item.editable == '0'"
                  v-decorator="[head[headMsg].code+'.'+item.code, {initialValue: item.initialValue, rules: item.rules }]"
                  style="width:100%;"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
        <a-card v-if="body.length == 1&&headMsg===0" :bordered="false" size="small">
          <div slot="title">
            <span>辅计量信息</span>
            <a-button @click="onBodyAddShow" style="margin-left: 20px;color:black">新增</a-button>
            <span>
              <a-button
                style="margin-left: 20px;color:black"
                @click="onBodyDelete"
                v-if="(editType==='edit'||editType==='add')&&dataSource[body[0].code]&&dataSource[body[0].code].length>0"
              >
                删除
                <a-icon type="delete" />
              </a-button>
              <!-- <a-button
                style="margin-left: 20px;color:#1890ff"
                :disabled="copycost"
                @click="onCostItemCopy"
                v-if="(editType==='edit'||editType==='add')&&dataSource[body[0].code]&&dataSource[body[0].code].length>0"
              >
                复制[事项费项地点]
                <a-icon type="copy" />
              </a-button>
              <a-button
                style="margin-left: 20px;color:#1890ff"
                @click="onCostItemPaste"
                v-if="(editType==='edit'||editType==='add')&&dataSource[body[0].code]&&dataSource[body[0].code].length>0"
              >
                粘贴[事项费项地点]
                <a-icon type="snippets" />
              </a-button>-->
            </span>
          </div>
          <!-- 新增显示f-table -->
          <div v-if="dataSource[body[0].code]&&dataSource[body[0].code].length>0">
            <f-table
              @changeBodyeditable="changeBodyeditable"
              ref="bodyTable"
              :columns="body[0].columns"
              :dataSource="dataSource[body[0].code]"
              :rowSelection="body[0].rowSelection"
            >
              <span
                v-for="item in body[0].columns"
                :key="item.id"
                :slot="item.code"
                slot-scope="{text, record, index}"
              >
                <span v-if="item.editable == '1'">
                  <component
                    :is="item._component.is"
                    v-model="record[item.code]"
                    v-bind="item._component.attrs"
                    @change="onBodyChange(item, body[0], record, index, dataSource[body[0].code], arguments)"
                    :disabled="readOnly || item.editable == '0'"
                    style="width:100%;"
                  />
                </span>
                <span v-else>{{text}}</span>
              </span>
            </f-table>
          </div>
          <!-- 新增显示f-table -->
          <!-- 新增显示a-table -->
          <!-- <div>
            <a-table
              ref="bodyTable"
              :columns="body[0].columns"
              :dataSource="dataSource[body[0].code] || []"
              :pagination="false"
              :scroll="{x:body[0].width,y:400}"
              size="small"
              rowKey="id"
              :rowSelection="body[0].rowSelection"
            >
              <span
                v-for="item in body[0].columns"
                :key="item.id"
                :slot="item.code"
                slot-scope="text, record, index"
              >
                <span v-if="item.editable == '1'">
                  <component
                    :is="item._component.is"
                    @valueChange="bodyValueChange(item,index,arguments)"
                    v-model="record[item.code]"
                    v-bind="item._component.attrs"
                    @beforesearch="onBeforeBodyEdit(item,head[0])"
                    @change="onBodyChange(item, body[0], record, index, dataSource[body[0].code], arguments)"
                    :disabled="readOnly || item.editable == '0'"
                    style="width:100%;"
                  />
                </span>
                <span v-else>{{text}}</span>
              </span>
              <span slot="ftaction" slot-scope="text, record">
                <a @click="onEditShare(record)" style="margin-right:6px;">分摊</a>
              </span>
            </a-table>
          </div>-->
          <!-- 新增显示a-table -->
        </a-card>
      </a-spin>
    </div>
    <template
      slot="footer"
      style="display:block;border-top:1px solid lightgray;padding-top:20px;text-align:right"
    >
      <div>
        <a-row :gutter="12" type="flex" align="bottom" justify="space-around">
          <a-col :offset="12" :span="12">
            <template v-for="itm in cardButtons">
              <a-button-group v-if="itm.groupName" style="margin-right:6px;">
                <template v-for="child in itm.children">
                  <a-dropdown v-if="child.menuName">
                    <a-menu slot="overlay">
                      <template v-for="btn in child.children">
                        <a-menu-divider v-if="btn.code === '-'" />
                        <template v-else>
                          <a-menu-item
                            v-if="btn.perms"
                            v-has="btn.perms"
                            @click="btn.onClick"
                            :disabled="btn.disabled"
                          >{{btn.name}}</a-menu-item>
                          <a-menu-item
                            v-else
                            @click="btn.onClick"
                            :disabled="btn.disabled"
                          >{{btn.name}}</a-menu-item>
                        </template>
                      </template>
                    </a-menu>
                    <a-button :type="child.type" :icon="child.icon">
                      {{child.menuName}}
                      <a-icon type="down" />
                    </a-button>
                  </a-dropdown>
                  <template>
                    <a-button
                      v-if="child.perms"
                      v-has="child.perms"
                      @click="child.onClick"
                      :type="child.type"
                      :icon="child.icon"
                      :disabled="child.disabled"
                    >{{child.name}}</a-button>
                    <a-button
                      v-else
                      @click="child.onClick"
                      :type="child.type"
                      :icon="child.icon"
                      :disabled="child.disabled"
                    >{{child.name}}</a-button>
                  </template>
                </template>
              </a-button-group>
              <a-dropdown v-else-if="itm.menuName" style="margin-right:6px;">
                <a-menu slot="overlay">
                  <template v-for="btn in itm.children">
                    <a-menu-divider v-if="btn.code === '-'" />
                    <template v-else>
                      <a-menu-item
                        v-if="btn.perms"
                        v-has="btn.perms"
                        @click="btn.onClick"
                        :disabled="btn.disabled"
                      >{{btn.name}}</a-menu-item>
                      <a-menu-item v-else @click="btn.onClick" :disabled="btn.disabled">{{btn.name}}</a-menu-item>
                    </template>
                  </template>
                </a-menu>
                <a-button :type="itm.type" :icon="itm.icon">
                  {{itm.menuName}}
                  <a-icon type="down" />
                </a-button>
              </a-dropdown>
              <template v-else>
                <a-button
                  v-if="itm.perms"
                  v-has="itm.perms"
                  @click="itm.onClick"
                  :type="itm.type"
                  :icon="itm.icon"
                  :disabled="itm.disabled"
                  style="margin-right:6px;"
                >{{itm.name}}</a-button>
                <a-button
                  v-else
                  @click="itm.onClick"
                  :type="itm.type"
                  :icon="itm.icon"
                  :disabled="itm.disabled"
                  style="margin-right:6px;"
                  :loading="confirmLoading"
                >{{itm.name}}</a-button>
              </template>
            </template>
          </a-col>
        </a-row>
        <!-- 双击放大图片 -->
        <a-modal :visible="PreviewVisible" :footer="null" @cancel="handleCancel">
          <img alt="请上传图片" style="width: 100%" :src="fileObj.fileurl" />
        </a-modal>
      </div>
    </template>
  </div>
</template>
<script>
import BaseBillFormModal from '@/views/md/base/BaseBillFormModal'
// import InvoiceRef from '@/views/bx/refmodule/InvoiceRef'
// import CjkTableRef from '@/views/bx/components/CjkTableRef'
import { bxdCommon } from '@/views/bx/bxdCommon'
import { getAction, postAction } from '@/api/manage'
export default {
  props: ['onFieldsValue', 'fileObj'],
  name: 'invdocmodal',
  mixins: [bxdCommon],
  extends: BaseBillFormModal,
  components: {
    FTable: () => import('@/views/md/components/FTable')
  },
  data () {
    return {
      uploadClick: 'uploadNull',
      filesVal: '', // 物料档案图片路径
      newlyIncreased: false,
      presiveTitle: '',
      headMsg: 0,
      width: '95%',
      modalHeight: window.innerHeight - 300 + 'px',
      bodyStyle: {
        height: this.modalHeight
      },
      PreviewVisible: false // 图片预览的显隐
    }
  },
  methods: {
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

    // 图片预览点击关闭
    handleCancel () {
      this.PreviewVisible = false
    },
    // 图片的双击放大
    doubleclick () {
      this.PreviewVisible = true
    },
    // 本地上传
    subFile: function () {
      this.uploadClick = 'uploadEnd'
      const file = this.$refs.inputer
      var myfile = file.files
      for (let i = 0; i < myfile.length; i++) {
        var fileSize = myfile[i].size
        const fileData = new Object()
        fileData.name = myfile[i].name
        fileData.file = []
        myfile[i].id = fileData.id = new Date().getTime() // 唯一标识
        if (fileSize < 5242880) {
          var reader = new FileReader()
          reader.readAsDataURL(myfile[i])
          reader.onload = e => {
            this.fileObj.fileurl = e.target.result
            if (fileData.name != this.fileObj.filename) {
              this.filesVal = [{ filename: fileData.name, file: e.target.result }]
              return
            }
            this.filesVal = [{ filename: fileData.name, file: e.target.result, fileid: this.fileObj.fileid }]
          }
        } else {
          alert('图片大小超过限制')
          return false
        }
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
      this.$nextTick(() => {
        Object.assign(this.presiveTitle[0], this.form.getFieldsValue()[this.head[0].code])
      })
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
    }
  }
}
</script>
<style lang="scss">
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
.invdocmodalClass {
  .ant-form-item-label {
    line-height: 1rem !important;
  }
}
.UploadContent {
  width: 190px;
  height: 224px;
  text-align: center;
}
.ImgBox {
  width: 100%;
  height: 180px;
  overflow: hidden;
  line-height: 160px;
  text-align: center;
  background: lightgray;
  img {
    width: 100%;
    height: 100%;
  }
}
.box {
  margin-top: 2px;
  width: 60px;
  height: 20px;
  position: relative;
  p {
    cursor: pointer;
    font-size: 12px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
  }
  #fileExport {
    position: relative;
    cursor: pointer;
    opacity: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }
}
</style>
