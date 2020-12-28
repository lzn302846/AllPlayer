<template>
  <div>
    <a-form
      :form="form"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 12 }"
      @submit="handleSubmit"
    >
      <a-form-item label="状态">
        <a-input v-decorator="['state', { initialValue:updateMsg.state?'已读':'未读',
        rules: [{  message: '请输入状态' }]
        }]"
        />
      </a-form-item>
      <a-form-item label="代办主题">
        <a-input v-decorator="['type', { initialValue:updateMsg.type,
        rules: [{  message: '请输入主题' }]
        }]"
        />
      </a-form-item>
      <a-form-item label="发送人">
        <a-input v-decorator="['SendP', { initialValue:updateMsg.SendP,
        rules: [{  message: '请输入发送人' }]
        }]"
        />
      </a-form-item>
      <a-form-item hidden label="时间">
        <a-input v-decorator="['SendD', {
        rules: [{  message: '请输入时间' }]
        }]"
        />
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
        <a-button type="primary" style="margin-right:20px" :loading="submitLoading" @click="handleSubmit">确认</a-button>
        <a-button type="default" style="margin-left:20px" @click="oCancle">返回</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import moment from 'moment'
import axios from 'axios'
export default {
  created () {
    moment.locale('zh-cn')
    axios.get('http://localhost:9000/Alllist/' + this.updateID).then(res => {
      this.updateMsg = res.data
    })
  },
  props: {
    updateID: {
      type: Number
    }
  },
  data () {
    return {
      submitLoading: false,
      // 修改页面布局数据
      updateMsg: '',
      formLayout: 'horizontal',
      form: this.$form.createForm(this, { name: 'coordinated' })
    }
  },
  methods: {
    // 修改页面的布局
    handleSubmit (e) {
      this.submitLoading = true
      e.preventDefault()
      this.form.validateFields((err, values) => {
        values.SendD = moment().format('lll')
        if (!err) {
          axios.patch('http://localhost:9000/Alllist/' + this.updateID, values).then(res => {
            this.oCancle()
            this.$emit('oRequest')
          }).finally(() => {
            this.submitLoading = false,
            this.$message.success('修改成功')
          })
        }
      })
    },
    handleSelectChange (value) {
      console.log(value)
      this.form.setFieldsValue({
        note: `Hi, ${value === 'male' ? 'man' : 'lady'}!`
      })
    },
    oCancle () {
      this.$emit('oBack')
    }
  }
}
</script>
<style>
</style>
