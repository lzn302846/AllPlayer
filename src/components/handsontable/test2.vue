<template>
  <div>
    <a-select v-model="model.paper" default-value="2" style="width: 120px" @change="handleChange">
      <a-select-option value="0">
        A0
      </a-select-option>
      <a-select-option value="1">
        A1
      </a-select-option>
      <a-select-option value="2">
        A2
      </a-select-option>
      <a-select-option value="3">
        A3
      </a-select-option>
    </a-select>

    <!-- table -->
    <test :msg='msg'></test>
  </div>
</template>

<script>
import { Select } from 'ant-design-vue'
import Vue from 'vue'

Vue.use(Select)
export default {
  data () {
    return {
      msg: '',
      model: {}
    }
  },
  components: {
    test
  },
  methods: {
    edit (data) {
      this.title = '修改'
      this.readOnly = false
      this.visible = true
      this.model = Object.assign({
        paper: '4',
        layout: '1'
      }, data)

      this._loadData()
    },
    handleChange (value) {
      this.msg = value
    //   console.log(`selected ${value}`);
    }
  }
}

</script>
<style>
</style>
