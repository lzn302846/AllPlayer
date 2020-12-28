<template>
  <div id="components-form-demo-advanced-search">
    <a-form class="ant-advanced-search-form" :form="form" @submit="handleSearch">
      <a-row :gutter="24" style="display:flex">
        <a-col
          v-for="item in InputMsg"
          :key="item"
          :span="8"
        >
          <a-form-item :label="item" style="z-index:1">
            <a-input
              v-decorator="[
                item,
                {
                  rules: [
                    {
                      message: 'Input something!',
                    },
                  ],
                },
              ]"
              :placeholder="'请输入'+item"
            />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-button type="primary" html-type="submit">
            查询
          </a-button>
          <a-button :style="{ marginLeft: '8px' }" @click="handleReset">
            重置
          </a-button>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script>
export default {
    props:{
        InputMsg:{
            type:Array,
            required:true
        }
    },
data() {
    return {
      expand: false,
      form: this.$form.createForm(this, { name: 'advanced_search' }),
    };
  },
  computed: {
    count() {
      return this.expand ? 11 : 7;
    },
  },
  updated() {
    console.log('updated');
  },
  methods: {
    handleSearch(e) {
      e.preventDefault();
      this.form.validateFields((error, values) => {
        console.log('error', error);
        console.log('Received values of form: ', values);
      });
    },

    handleReset() {
      this.form.resetFields();
    },

    toggle() {
      this.expand = !this.expand;
    },
  },
};
</script>
<style lang="scss">
.ant-advanced-search-form {
  padding: 24px;
  background: white;
}

.ant-advanced-search-form .ant-form-item {
  display: flex;
}

.ant-advanced-search-form .ant-form-item-control-wrapper {
  flex: 1;
}
#components-form-demo-advanced-search .ant-form {
  max-width: none;
}
#components-form-demo-advanced-search .search-result-list {
  margin-top: 16px;
  background-color: white;
  min-height: 200px;
  text-align: center;
  padding-top: 80px;
}
</style>