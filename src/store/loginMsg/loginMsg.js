export default  {
    namespaced:true,
    state:{
        loginMsg:''
    },
    mutations:{
        changeLoginMsg(state,msg){
            state.loginMsg = msg
        }
    },
    actions:{},
    getters:{}
}