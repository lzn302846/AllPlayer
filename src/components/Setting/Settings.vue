<template>
  <div :class="['settings',collapsed ? 'settingsWidth' : '']">
    <a-icon
      class="trigger"
      :type="collapsed ? 'menu-unfold' : 'menu-fold'"
      @click="changeSideWidth"
    />
      <slot></slot>
    <span class="action" @click="toggleSetting">
      <a-icon type="setting"></a-icon>
    </span>
    <a-badge :count="isReadCount.length" :offset="[5,-5]">
      <!-- <a-icon type="setting" style="color:white;font-size:18px" /> -->
      <a-dropdown>
        <a
          class="ant-dropdown-link"
          style="color:black;font-size:16px"
          @click="e => e.preventDefault()"
        >
          欢迎您,
          <span class="usernameClass">{{loginMsg}}</span>
        </a>
        <a-menu slot="overlay">
          <a-menu-item v-for="oMenuMsg in MenuList" :key="oMenuMsg.id">
            <div @click="jumpClick(oMenuMsg)">
              <a-badge
                :dot="oMenuMsg.title==='公告信息'?true:false"
                v-show="isReadCount.length>0"
                :offset="[1,-10]"
              ></a-badge>
              {{oMenuMsg.title}}
            </div>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </a-badge>
      <p class="logout" @click="logoutClick"><a-icon type="logout" style="position:relative;bottom:3px;right:5px" />退出登录</p>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
export default {
  props: ["collapsed"],
  inject: ["toggleSettingDrawer"],
  data() {
    return {
      logoutModalText:'确定要退出登录吗？',
      logoutVisible:false,
      logoutConfirmLoading:false,
      MenuList: [
        { id: 1, title: "首页", key: "content" },
        { id: 2, title: "公告信息", key: "notice" }
      ]
    };
  },
  computed: {
    ...mapState("Notice", ["NoticeData"]),
    ...mapState("Settings", ["layoutMode"]),
    ...mapState("LoginMsg", ["loginMsg"]),
    ...mapGetters("Notice", ["isReadCount"])
  },
  methods: {
    ...mapMutations("Notice", ["oChangeIsRead", "oChangeAllIsRead"]),
    logoutClick(){
      const that = this

        this.$confirm({
          title: '提示',
          content: '真的要注销登录吗 ?',
          onOk() {
                Cookies.remove('token')
                window.location.href="/";
          },
          onCancel() {
          },
        });
    },
    // 点击设置按钮
    toggleSetting() {
      this.toggleSettingDrawer();
    },
    changeSideWidth() {
      this.$emit("changeCollapsed");
    },
    jumpClick(e) {
      this.$emit("handleChange", e.key);
      this.$emit("oSkip", e);
    }
  },
  
};
</script>
<style lang="less">
.logout{
  position: absolute;
  right: 2%;
  color: black;
  cursor: pointer;
}
.logout:hover{
  color: @primary-color;
  animation: move 1s cubic-bezier(0,1.59,.9,.15);
}
@keyframes move {
  0%{font-size: 20px;} 
  100%{font-size: 16px;}
}
.usernameClass{
  color: @primary-color;
}
.action {
  margin-right: 15px;
  color: black;
  position: absolute;
  right: 19.5%;
  cursor: pointer;
}
.settingsWidth {
  transition: 0.2s;
  width: 94.1% !important;
  margin-left: 90px !important;
}
.settings {
  display: flex;
  align-items: center;
  transition: 0.2s;
  border-bottom: 1px lightgray solid;
  width: 88.8%;
  background: rgba(255,255,255,0.8);
  height: 70px;
  margin-left: 172px;
  color: white;
  font-size: 16px;
  position: relative;
  .trigger {
    color: black;
    font-size: 20px;
    line-height: 70px;
    margin-left: 15px;
  }
  .ant-badge {
    cursor: pointer;
    position: absolute;
    right: 11%;
  }
}
</style>