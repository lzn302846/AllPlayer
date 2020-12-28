<template>
  <div style="position: relative;">
    <div id="oBtnGroup" style="display:flex;align-items: center;">
      <a-button
        id="startBtn"
        v-for="item in Datalist"
        @click="changeMsg(item.id)"
        :key="item.id"
        type="befault"
      >{{item.title}}</a-button>
      <!-- 添加 -->
      <div>
        <a-input
          placeholder="请输入要添加或查询的代办事项"
          v-model="addValue"
          style="width:300px;margin-left:70px"
        />
        <a-button type="primary" size="default" @click="addTodo">添加</a-button>
        <a-button style="background:orange;color:white" size="default" @click="findTodo">查询</a-button>
        <a-button style="background:pink;color:white" size="default" @click="backTodo">返回</a-button>
      </div>
      <!-- 添加 -->
    </div>
    <div style="margin-left:10px">
      <a-card style="width: 100%">
        <a-table
          v-if="!findMsg"
          :columns="columns"
          :data-source="changeTodo"
          :row-key="record=>record.id"
          :pagination="{
            total:changeTodo.length,
            pageSize:5,
            showQuickJumper:true,
            current:oPage,
          }"
          @change="changePage"
        />
        <a-table v-else :columns="columns" :data-source="findMsg" :row-key="record=>record.id" />
      </a-card>
    </div>
    <div v-if="updateShow" id="update" style>
      <TodoUpdate v-show="updateShow" @oRequest="oRequest" @oBack="oBack" :updateID="updateID"></TodoUpdate>
    </div>
    <a-modal
      :title="removeMsgTitle"
      :visible="removeMsgShow"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <p v-html="ModalText"></p>
    </a-modal>
  </div>
</template>

<script>
import TodoUpdate from './todoUpdate'
import moment from 'moment'
import axios from 'axios'
const AllMsgChange = {
  SendD: '时间',
  SendP: '发送人',
  state: '状态',
  type: '主题',
  id: 'ID'
}
export default {
  components: {
    TodoUpdate
  },
  created () {
    moment.locale('zh-cn')
  },
  data () {
    return {
      oPage: 1,
      // 修改页面的数据
      updateShow: false,
      updateMsg: '',
      updateID: '',
      // 删除代办的modal
      removeMsgShow: false,
      removeMsgTitle: '',
      confirmLoading: false,
      removeMsgId: '',
      ModalText: '',
      // 查询
      findMsg: '',
      // 查询

      columns: [],
      addValue: '',
      Datalist: [
        { id: 1, title: '我的代办' },
        { id: 2, title: '我的已办' },
        { id: 3, title: '我的草稿' }
      ],
      Alllist: [],
      oKey: 3
    }
  },
  computed: {
    changeTodo () {
      switch (this.oKey) {
        case 1:
          return this.Alllist.filter(item => item.state)
        case 2:
          return this.Alllist.filter(item => !item.state)
        default:
          return this.Alllist
      }
    }
  },
  mounted () {
    if (localStorage.getItem('oPage')) {
      const pageMount = Number(localStorage.getItem('oPage'))
      this.oPage = pageMount
    }
    this.oRequest()
  },
  methods: {
    handleOk (e) {
      this.confirmLoading = true
      axios.delete('http://localhost:9000/Alllist/' + this.removeMsgId).then(res => {
        this.oRequest()
      }).catch(err => {
        this.$message.error('删除失败！')
      }).finally(() => {
        this.removeMsgShow = false
        this.confirmLoading = false
        this.$message.success('删除成功！')
      })
    },
    handleCancel (e) {
      this.removeMsgShow = false
    },
    // 页码改变时
    changePage (page, pageSize) {
      this.oPage = page.current
      localStorage.setItem('oPage', page.current)
    },
    // 返回操作
    backTodo () {
      this.findMsg = ''
    },
    // 查询操作
    findTodo () {
      axios
        .get('http://localhost:9000/Alllist?q=' + this.addValue)
        .then(res => {
          this.findMsg = res.data
          // 代码高亮
          this.findMsg.map(item => {
            if (item.SendP.includes(this.addValue)) {
              this.columns = this.columns.map(msg => {
                if (typeof msg === 'boolean') {
                  return false
                }
                if (msg.key == 'SendP') {
                  return {
                    title: AllMsgChange[msg],
                    customRender: (text, record, index) => {
                      return <span style="color:orange">{text.SendP}</span>
                    },
                    key: msg.key
                  }
                }
                if (msg.key === 'id') {
                  return false
                }
                if (msg.key === 'state') {
                  return {
                    title: AllMsgChange[msg.key],
                    customRender: function (text, record, index) {
                      return text.state ? '已读' : '未读'
                    },
                    key: msg.key
                  }
                }
                return {
                  title: AllMsgChange[msg.key],
                  dataIndex: msg.key,
                  key: msg.key
                }
              })
              return false
            }
            if (item.SendD.includes(this.addValue)) {
              this.columns = this.columns.map(msg => {
                if (typeof msg === 'boolean') {
                  return false
                }
                if (msg.key == 'SendD') {
                  return {
                    title: AllMsgChange[msg],
                    customRender: (text, record, index) => {
                      return <span style="color:orange">{text.SendD}</span>
                    },
                    key: msg.key
                  }
                }
                if (msg.key === 'id') {
                  return false
                }
                if (msg.key === 'state') {
                  return {
                    title: AllMsgChange[msg.key],
                    customRender: function (text, record, index) {
                      return text.state ? '已读' : '未读'
                    },
                    key: msg.key
                  }
                }
                return {
                  title: AllMsgChange[msg.key],
                  dataIndex: msg.key,
                  key: msg.key
                }
              })
              return false
            }
            if (item.type.includes(this.addValue)) {
              this.columns = this.columns.map(msg => {
                if (typeof msg === 'boolean') {
                  return false
                }
                if (msg.key == 'type') {
                  return {
                    title: AllMsgChange[msg],
                    customRender: (text, record, index) => {
                      return <span style="color:orange">{text.type}</span>
                    },
                    key: msg.key
                  }
                }
                if (msg.key === 'id') {
                  return false
                }
                if (msg.key === 'state') {
                  return {
                    title: AllMsgChange[msg.key],
                    customRender: function (text, record, index) {
                      return text.state ? '已读' : '未读'
                    },
                    key: msg.key
                  }
                }
                return {
                  title: AllMsgChange[msg.key],
                  dataIndex: msg.key,
                  key: msg.key
                }
              })
              return false
            }
          })
        })
    },
    // 修改
    oUpdateTodo (id) {
      this.updateID = id
      this.updateShow = true
    },
    // 隐藏修改页面
    oBack () {
      this.updateShow = false
    },
    // 添加代办事项
    addTodo () {
      axios
        .post('http://localhost:9000/Alllist', {
          state: false,
          type: this.addValue,
          SendP: '随机',
          SendD: moment().format('lll')
        })
        .then(res => {
          this.oRequest()
          this.addValue = ''
        })
    },
    changeMsg (key) {
      this.oKey = key
    },
    // 请求数据库数据，渲染页面
    oRequest () {
      axios.get('http://localhost:9000/Alllist').then(res => {
        this.Alllist = res.data
        this.setColumns(res)
      })
    },
    setColumns (res) {
      const newArr = Object.keys(res.data[0])
      const columnsMsg = newArr.map(item => {
        if (item === 'id') {
          return false
        }
        if (item === 'state') {
          return {
            title: AllMsgChange[item],
            customRender: function (text, record, index) {
              return text.state ? '已读' : '未读'
            },
            key: item
          }
        }
        return {
          title: AllMsgChange[item],
          dataIndex: item,
          key: item
        }
      })
      columnsMsg.push({
        title: '操作',
        customRender: (text, record, index) => {
          return (
            <a-button-group style="display:flex">
              <a-button
                onClick={() => this.oUpdateTodo(text.id)}
                type="primary"
              >
                修改
              </a-button>
              <a-button onClick={() => this.remove(text.id, text)} type="danger">
                删除
              </a-button>
            </a-button-group>
          )
        },
        key: 'action'
      })
      this.columns = columnsMsg
    },
    remove (id, t) {
      this.removeMsgTitle = '删除操作'
      this.removeMsgShow = true
      this.removeMsgId = id
      this.ModalText = `请问您确定要删除 <span style="color:orange;font-weight:bold">${t.SendP}</span> 录入的代办事项 <span style="color:orange;font-weight:bold">${t.type}</span> 吗？`
    }
  }
}
</script>
<style lang="scss">
.ant-table-body {
  table {
    .ant-table-thead {
      background: #f7e9a0 !important;
    }
  }
}
#update {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  z-index: 5;
  background: #f7e9a0;
  width: 820px;
  height: 450px;
  text-align: center;
  padding-left: 55px;
  padding-top: 55px;
}
#oBtnGroup {
  height: 50px;
  padding-left: 30px;
  #startBtn {
    border: 1px solid #ad9942;
    color: #ad9942;
    margin: 3px 20px;
    border-radius: 5px;
    width: 87px;
    height: 40px;
  }
  #startBtn:hover {
    border: 1px solid #e8d063;
    color: #e8d063;
  }
}
</style>
