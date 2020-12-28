<template>
<a-config-provider :locale="zh_CN">
  <div id="app">
    <router-view></router-view>
  </div>
</a-config-provider>
</template>

<script>
import Cookies from 'js-cookie'
import instance2 from '@/utils/http';
import login from './views/login/login'
import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN';
import {mapMutations} from 'vuex'
export default {
  name: 'App',
  components:{
    login
  },
  methods:{
    ...mapMutations('LoginMsg',['changeLoginMsg'])
  },
  //路由守卫都有三个参数 to from  next
  // beforeRouteEnter(to,from,next){
  //   instance2.post('/api/user/isloginin').then(res=>{
  //     console.log(res)
  //     next('/home')
  //     }).catch(err=>{next('/login')})
  // },
  created(){
  //   instance2.post('/api/user/isloginin').then(res=>{
  //     this.changeLoginMsg(res)
  if(Cookies.get('token')){
    this.changeLoginMsg(localStorage.getItem('username'))
    if(sessionStorage.getItem('path')){
      this.$router.push(JSON.parse(sessionStorage.getItem('path')))
    }else{
      this.$router.push('/home')
    }
  }else{
    this.$router.push('/login')
  }
    
  },
  data(){
    return{
      zh_CN, // 语言
      loginMsg:''
    }
  },
}
</script>

<style lang="scss">

</style>
