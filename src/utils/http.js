import axios from 'axios'
import Cookies from 'js-cookie'

//login
const instance2 = axios.create({
    baseURL:'nc-server'
})

//axios高级应用，axios拦截
//发送请求后拦截
instance2.interceptors.request.use(config=>{
    if(Cookies.get('token')){
        config.headers['X-Access-Token'] = Cookies.get('token')
    }
    return config
})
//响应回来后拦截
instance2.interceptors.response.use(res=>{
    if(res.status == 200){
        return res.data
    }else{
        return Promise.reject('出错了')
    }
})

export default instance2
