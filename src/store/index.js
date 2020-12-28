import Vue from 'vue'
import Vuex from 'vuex'
import Todolist from '../store/Todolist/index'
import Notice from './notice/index'
import LoginMsg from './loginMsg/loginMsg'
import Settings from './settings/settings'

Vue.use(Vuex)

const store = new Vuex.Store({
    modules:{
        Todolist,Notice,LoginMsg,Settings
    }
})

export default store