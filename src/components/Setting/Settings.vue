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
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
export default {
  props: ["collapsed"],
  inject: ["toggleSettingDrawer"],
  computed: {
    ...mapState("Notice", ["NoticeData"]),
    ...mapState("Settings", ["layoutMode"]),
    ...mapState("LoginMsg", ["loginMsg"]),
    ...mapGetters("Notice", ["isReadCount"])
  },
  methods: {
    ...mapMutations("Notice", ["oChangeIsRead", "oChangeAllIsRead"]),
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
  data() {
    return {
      MenuList: [
        { id: 1, title: "首页", key: "content" },
        { id: 2, title: "公告信息", key: "notice" }
      ]
    };
  }
};
</script>
<style lang="less">
.usernameClass{
  color: #52C41A;
}
.action {
  color: black;
  position: absolute;
  right: 18%;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}
.settingsWidth {
  transition: 0.2s;
  width: 94.1% !important;
  margin-left: 90px !important;
}
.settings {
  transition: 0.2s;
  border-bottom: 1px lightgray solid;
  width: 88.8%;
  background: white;
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
    top: 50%;
    right: 10%;
    transform: translateY(-50%);
  }
}
</style>