export default  {
    namespaced:true,
    state:{
        NoticeData:[
            {
              id:1,
              title: "去北京看升旗",
              isRead:false
            },
            {
              id:2,
              title: "去济宁拍照片",
              isRead:true
            },
            {
              id:3,
              title: "去烟台旅游",
              isRead:true
            },
            {
              id:4,
              title: "去星巴克喝超大杯甄选豆蓝山",
              isRead:false
            },
            {
              id:5,
              title: "去车展买顶级豪华特斯拉",
              isRead:true
            }
          ]
    },
    mutations:{
        oChangeIsRead(state,id){
            setTimeout(()=>{
              state.NoticeData.forEach(item=>{
                if(item.id === id){
                      item.isRead = false
                  }
              })
            },200)
        },
        oChangeAllIsRead(state){
            setTimeout(() => {
              state.NoticeData.forEach(item=>{
                item.isRead = false
        })
            }, 400);
        },
    },
    actions:{},
    getters:{
      isReadCount(state){
        return state.NoticeData.filter(item=>item.isRead===true)
      }
    }
}