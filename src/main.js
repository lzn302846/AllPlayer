import Vue from 'vue'
import App from './App.vue'
import router from './routes/index'
import store from './store/index'
import Print from './plugin/print/Print'
import 'ant-design-vue/dist/antd.less';
import Antd from 'ant-design-vue/es'
import config from '@/defaultSettings'
import ConfigProvider from 'ant-design-vue/es'  // antd-vue国际化
import 'lodash'
// 重置样式
import './stylesheets/main.scss'
// import Button from 'ant-design-vue/lib/button';
import Video from 'video.js'
import 'video.js/dist/video-js.css'
import Storage from 'vue-ls';

// layui  
import '../node_modules/layui-src/dist/css/layui.css'
import '../node_modules/layui-src/dist/layui.js'
 
Vue.use(Storage, config.storageOptions)
// 或 Vue.use(Storage);

Vue.prototype.$video = Video
Vue.use(ConfigProvider)
Vue.use(Print)
Vue.use(Antd)
// Vue.component(Button.name, Button);

Vue.config.productionTip = false
new Vue({
  render: h => h(App),
  router,store 
}).$mount('#app')  
