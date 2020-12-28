<template>
  <div>
    <div>
      <a-card style="width: 100%">
        <a-table :columns="columns" :data-source="changeTodo" :row-key="record=>record.id" />
      </a-card>
    </div>
  </div>
</template>

<script>
import axios from "axios";
let AllMsgChange = {
  SendD: "时间",
  SendP: "发送人",
  state: "状态",
  type: "主题",
  id: "ID"
};
export default {
    props:{
        columns,
        Alllist,
    },
  data() {
    return {
      //   data,
      columns: [],
      Alllist: [],
      oKey: 3
    };
  },
  computed: {
    changeTodo() {
      switch (this.oKey) {
        case 1:
          return this.Alllist.filter(item => item.state);
        case 2:
          return this.Alllist.filter(item => !item.state);
        default:
          return this.Alllist;
      }
    }
  },
  mounted() {
    this.oRequest();
  },
  methods: {
    changeMsg(key) {
      this.oKey = key;
    },
    oRequest() {
      axios.get("http://localhost:9000/Alllist").then(res => {
        this.Alllist = res.data;
        this.setColumns(res);
      });
    },
    setColumns(res) {
      let newArr = Object.keys(res.data[0]);
      let columnsMsg = newArr.map(item => {
        if (item === "state") {
          return {
            title: AllMsgChange[item],
            customRender: function(text, record, index) {
              return text.state ? "已读" : "未读";
            },
            key: item
          };
        }
        return {
          title: AllMsgChange[item],
          dataIndex: item,
          key: item
        };
      });
      columnsMsg.push({
        title: "操作",
        customRender: (text, record, index)=> {
          return (
            <a-button-group style="display:flex">
              <a-button
                style={{ display: text.state ? "none" : "block" }}
                onClick={() => (text.state = true)}
                type="primary"
              >
                阅读
              </a-button>
              <a-button
                onClick={() => this.remove(text.id)}
                type="danger"
              >
                删除
              </a-button>
            </a-button-group>
          );
        },
        key:'action'
      });
      this.columns = columnsMsg;
    },
    remove(id) {
      axios.delete('http://localhost:9000/Alllist/'+id).then(res=>{
            this.oRequest()
        })
    }
  }
};
</script>
<style lang="scss">
.ant-table-body{
  table{
    .ant-table-thead{
        background: #F7E9A0!important;
    }
  }
}
#oBtnGroup {
  height: 50px;
  padding-left: 30px;
  button {
    border: 1px solid #AD9942;
    color: #AD9942;
    margin: 3px 20px;
    border-radius: 5px;
    width: 87px;
    height: 40px;
  }
  button:hover{
    border: 1px solid #E8D063;
    color: #E8D063;
  }
}
</style>