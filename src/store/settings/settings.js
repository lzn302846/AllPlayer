let menuTheme = localStorage.getItem('menuTheme')
let primaryColor = localStorage.getItem('primaryColor')
let mode = localStorage.getItem('mode')
export default {
    namespaced:true,
    state:{
        theme:menuTheme?menuTheme:'light',
        color:primaryColor?primaryColor:'#AD9942',
        layoutMode:mode?mode:'sidemenu'
    },
    mutations:{
        // 动态切换顶部导航和侧边导航
        handleLayout(state,mode){
            localStorage.setItem('mode',mode)
            state.layoutMode = mode
        },
        // 切换侧边栏主题色
        changeTheme(state,theme){
            localStorage.setItem('menuTheme',theme)
            state.theme = theme
        },
        // 切换颜色
        changeMainColor(state,MainColor){
            localStorage.setItem('primaryColor',MainColor)
            state.color = MainColor
        },
    },
    actions:{},
    getters:{},
}