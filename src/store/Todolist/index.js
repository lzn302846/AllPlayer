module.exports = {
    namespaced:true,
    state:{
        datalist:[
            {
                id:1,
                title:'吃饭',
                isFinish:true
            },
            {
                id:2,
                title:'睡觉',
                isFinish:true
            },
            {
                id:3,
                title:'玩游戏',
                isFinish:false
            },
        ],
    },
    mutations:{
        addMsg(state,payload){
            state.datalist = [...state.datalist,{id:payload.id,title:payload.e,isFinish:false}]
        },
        CopyList(state){
            state.datalist = state.datalist.slice()
        },
        removeMsg(state,id){
            state.datalist = state.datalist.filter(item=>item.id!==id)
        }
    },
    actions:{},
    getters:{
    },
}