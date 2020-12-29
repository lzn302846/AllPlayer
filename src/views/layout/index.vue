<template>
  <a-layout id="components-layout-demo-custom-trigger">
    <canvas id="snowCanvas" style="position: absolute;left: 0;top: 0;"></canvas>
    <div class="header" style>
      <div :class="['logo',collapsed?'logoWidth':'',layoutMode==='topmenu'?'logoTopMenu':'']">
        <p class="logoTitle">大惠企业</p>
      </div>
      <div class="headerStyle">
        <Settings
          :collapsed="collapsed"
          @changeCollapsed="changeCollapsed"
          @handleChange="handleChange"
          @oSkip="oSkip"
        >
          <transition name="def">
            <div v-if="layoutMode==='topmenu'" class="topmenuStyle">
              <a-menu v-model="current" mode="horizontal">
                <a-menu-item key="content" @click="oSkip(panes[0])">
                  <a-icon type="home" />&nbsp;
                  <span>首页</span>
                </a-menu-item>
                <a-sub-menu :key="menu.key" v-for="menu in MenuList">
                  <span slot="title">
                    <a-icon :type="menu.type" />
                    <span>{{menu.title}}</span>
                  </span>
                  <a-menu-item
                    @click="oSkip(me)"
                    :key="me.key"
                    v-for="me in menu.children"
                  >{{me.title}}</a-menu-item>
                </a-sub-menu>
              </a-menu>
            </div>
          </transition>
        </Settings>
      </div>
    </div>
    <a-layout>
      <a-layout-sider
        v-if="layoutMode==='sidemenu'"
        v-model="collapsed"
        :trigger="null"
        width="162"
        :style="{background: 'rgba(255,255,255,0.6)!important'}"
      >
        <a-menu
          mode="inline"
          :theme="theme"
          :openKeys="openKeys"
          :selectedKeys="[oPath]"
          :defaultSelectedKeys="[oPath]"
          @click="handClick"
          :defaultOpenKeys="[defaultPath || 'sub1']"
          :style="{ height: '100%', borderRight: 0,background: 'rgba(255,255,255,0.6)!important'}"
          @openChange="onOpenChange"
        >
          <a-menu-item key="content" @click="oSkip(panes[0])">
            <a-icon type="home" />&nbsp;
            <span>首页</span>
          </a-menu-item>
          <a-sub-menu :key="menu.key" v-for="menu in MenuList">
            <span slot="title">
              <a-icon :type="menu.type" />
              <span>{{menu.title}}</span>
            </span>
            <a-menu-item @click="oSkip(me)" :key="me.key" v-for="me in menu.children">{{me.title}}</a-menu-item>
          </a-sub-menu>
        </a-menu>
      </a-layout-sider>
      <a-layout style="padding: 0 24px 24px">
        <a-tabs
          v-model="activeKey"
          type="editable-card"
          @edit="onEdit"
          :hideAdd="true"
          @change="handleChange"
          class="tab-layout-tabs"
        >
          <a-tab-pane
            v-for="pane in panes"
            :key="pane.key"
            :tab="pane.title"
            :closable="pane.closable"
          >
            <a-layout-content
              :style="{ background: '#fff', padding: '24px', margin: 0, minHeight: onHeight }"
            >
              <router-view></router-view>
            </a-layout-content>
          </a-tab-pane>
        </a-tabs>
      </a-layout>
    </a-layout>
    <SettingDrawer ref="SettingDrawer"></SettingDrawer>
  </a-layout>
</template>
<script>
import { mapState } from "vuex";
import SettingDrawer from "@/views/Setting/SettingDrawer";
import Settings from "@/components/Setting/Settings";
var particles = [];
var mp = 95;
var snowAngle = 0;
var W = window.innerWidth;
var H = window.innerHeight;
for (var i = 0; i < mp; i++) {
  particles.push({
    x: Math.random() * W,
    y: Math.random() * H,
    r: Math.random() * 4 + 1,
    d: Math.random() * mp
  });
}
export default {
  data() {
    const panes = [{ title: "首页", key: "content" }];
    return {
      onHeight: window.innerHeight + "px",
      current: ["mail"],
      TwoLinkAge: { content: ["content", "sub1"] },
      activeKey: panes[0].key,
      panes,
      newTabIndex: 0,
      changeRoute: "",
      
      MenuList: [
        {
          key: "sub2",
          type: "money-collect",
          title: "价格管理",
          children: [
            { key: "goodsPrice", title: "商品询价" },
            { key: "goodsNotice", title: "商品报价" }
          ]
        },
        {
          key: "sub3",
          type: "notification",
          title: "通知管理",
          children: [
            { key: "notice", title: "公告信息" },
            { key: "todolist", title: "代办事项" }
          ]
        },
        {
          key: "sub4",
          type: "sync",
          title: "系统管理",
          children: [
            { key: "UploadImage", title: "图片上传" },
            { key: "menuManage", title: "菜单管理" }
          ]
        }
      ],
      // 头部样式管理
      oNotify: false, // 通知管理
      oPriceStyle: false, // 价格管理
      oHideHeader: false, // 头部显隐
      oHTlist: [], // 价格管理头部数组

      rootSubmenuKeys: [
        "sub1",
        "sub2",
        "sub3",
        "sub4",
        "sub5",
        "sub6",
        "sub7",
        "sub8"
      ],
      oPath: "1", // 初始展开的 SubMenu 菜单项
      defaultPath: "sub1", // 初始选中的菜单项 key 数组
      openKeys: ["sub1"],

      oHeader: "",
      collapsed: false
    };
  },
  components: {
    Settings,
    SettingDrawer
  },
  mounted() {
    document.body.classList.add("colorWeak");
    document.title = "大惠"; // 利用这个可以动态更改页面标题
    var canvas = document.getElementById("snowCanvas");
    var ctx = canvas.getContext("2d");

    canvas.width = W;
    canvas.height = H;
    setInterval(()=>{
      this.drawSnow(ctx)
    }, 22);
  },
  created() {
    if (sessionStorage.getItem("path")) {
      this.oPath = JSON.parse(sessionStorage.getItem("path")).key;
      this.defaultPath = sessionStorage.getItem("defaultPath");
      this.openKeys = [sessionStorage.getItem("defaultPath")];
      this.TwoLinkAge[this.oPath] = [this.oPath, this.defaultPath];
      this.oSkip(JSON.parse(sessionStorage.getItem("path")));
    }
  },
  provide() {
    return {
      toggleSettingDrawer: this.toggleSettingDrawer
    };
  },
  computed: {
    ...mapState("Settings", ["theme", "color", "layoutMode"]),
  },
  methods: {
        setRandomColor(){
          var r = parseInt(Math.random()*256)
          var g = parseInt(Math.random()*256)
          var b = parseInt(Math.random()*256)
          return `rgb(${r},${g},${b})`
        },
    drawSnow(ctx) {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = 'rgb(255,215,0)'
      ctx.beginPath()
      for(var i = 0;i < mp; i++){
        var p = particles[i]
        ctx.moveTo(p.x,p.y)
        ctx.arc(p.x,p.y,p.r,0,Math.PI*2,true)
      }
      ctx.fill()
      this.updateSnow()
    },
    updateSnow(){
      snowAngle += 0.01
      for(var i = 0;i < mp; i++){
        var p = particles[i]
        p.x += Math.sin(snowAngle)*2
        p.y += Math.cos(snowAngle+p.d)+1+p.r/2
        if(p.x > W+5 || p.x < -5 || p.y > H){
          if(i%3>0){
            particles[i] = {x:Math.random()*W,y:-10,r:p.r,d:p.d}
          }else{
            if(Math.sin(snowAngle) > 0){
              particles[i] = {x:-5,y:Math.random()*H,r:p.r,d:p.d}
            }else{
              particles[i] = {x:W + 5,y:Math.random()*H,r:p.r,d:p.d}
            }
          }
        }
      }
    },
    toggleSettingDrawer() {
      this.$refs.SettingDrawer.changeVisible();
    },
    changeCollapsed() {
      this.collapsed = !this.collapsed;
    },
    // 联动
    changeRouteMe(state) {
      this.openKeys = [this.TwoLinkAge[state][1]];
      this.oPath = state;
      sessionStorage.setItem("defaultPath", this.openKeys);
      sessionStorage.setItem(
        "path",
        JSON.stringify(this.panes.filter(item => item.key === state)[0])
      );
    },
    onEdit(targetKey, action) {
      this[action](targetKey);
    },
    handleChange(e) {
      if (e === "notice") {
        this.TwoLinkAge[e] = [e, "sub3"];
      }
      this.$router.push("/home/" + e);
      this.changeRouteMe(e);
    },
    remove(targetKey) {
      if (targetKey == this.panes[0].key) {
        this.$message.warning("首页不能关闭!");
        return;
      }
      if (this.panes.length === 1) {
        this.$message.warning("这是最后一页，不能再关闭了啦");
        return;
      }
      let activeKey = this.activeKey;
      let lastIndex;
      this.panes.forEach((pane, i) => {
        if (pane.key === targetKey) {
          lastIndex = i - 1;
        }
      });
      const panes = this.panes.filter(pane => pane.key !== targetKey);
      if (panes.length && activeKey === targetKey) {
        if (lastIndex >= 0) {
          activeKey = panes[lastIndex].key;
        } else {
          activeKey = panes[0].key;
        }
      }
      this.panes = panes;
      this.activeKey = activeKey;
      this.handleChange(this.activeKey);
    },
    handClick(e) {
      this.TwoLinkAge[e.keyPath[0]] = e.keyPath;
      this.defaultPath = e.keyPath[1];
      sessionStorage.setItem("defaultPath", this.defaultPath);
    },
    oSkip(path) {
      this.activeKey = path.key;
      this.oPath = path.key;
      sessionStorage.setItem("path", JSON.stringify(path));
      this.panes.push({ title: path.title, key: path.key });

      const obj = {};
      const peon = this.panes.reduce((cur, next) => {
        obj[next.key] ? "" : (obj[next.key] = true && cur.push(next));
        return cur;
      }, []);
      this.panes = peon;
      this.$router.push(this.oPath);
    },
    onOpenChange(openKeys) {
      const latestOpenKey = openKeys.find(
        key => this.openKeys.indexOf(key) === -1
      );
      if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
        this.openKeys = openKeys;
      } else {
        this.openKeys = latestOpenKey ? [latestOpenKey] : [];
      }
    }
  }
};
</script>

<style lang="less">
@logoHeight: 70px;
@scrollBarSize: 10px;
.ant-menu-submenu-selected {
  color: @primary-color!important;
}
.logoTitle {
  color: white;
  font-size: 35px;
  line-height: @logoHeight;
}
.tab-layout-tabs {
  margin-left: 10px;
  overflow-y: scroll;
  background: rgba(255,255,255,0.6)!important;
  &::-webkit-scrollbar {
    width: @scrollBarSize;
    height: @scrollBarSize;
    background-color: transparent;
    display: none;
  }

  & .-o-scrollbar {
    display: none;
  }
}
.logoTopMenu {
  transition: 0.2s;
  position: absolute;
  left: 10px;
}
.topmenuStyle {
  transition: 0.2s;
  position: absolute;
  bottom: 0;
}
.logoWidth {
  transition: 0.2s;
  width: 80px !important;
  img {
    width: 80px !important;
  }
}
.page-transition-enter {
  opacity: 0;
}

.page-transition-leave-active {
  opacity: 0;
}

.page-transition-enter .page-transition-container,
.page-transition-leave-active .page-transition-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

/*美化弹出Tab样式*/
.ant-tabs-nav-container {
  background: rgba(255,255,255,0.6)!important;
  padding-left: 10px;
  padding-top: 5px;
}

/* 修改 ant-tabs 样式 */
.tab-layout-tabs.ant-tabs {
  margin: 12px 0 0 10px;
  border-bottom: 1px solid #ccc;
  // border-left: 1px solid #ccc;
  background-color: white;
  padding: 0 20px;

  .ant-tabs-bar {
    margin: 4px 0 0;
    border: none;
  }
}

.ant-tabs {
  &.ant-tabs-card .ant-tabs-tab {
    padding: 0 24px !important;
    background-color: white !important;
    margin-right: 10px !important;

    .ant-tabs-close-x {
      width: 12px !important;
      height: 12px !important;
      opacity: 0 !important;
      cursor: pointer !important;
      font-size: 12px !important;
      margin: 0 !important;
      position: absolute;
      top: 36%;
      right: 6px;
    }

    &:hover .ant-tabs-close-x {
      opacity: 1 !important;
    }
  }
}

.ant-tabs.ant-tabs-card > .ant-tabs-bar {
  .ant-tabs-tab {
    height: 28px !important;
    line-height: 28px !important;
    border: none !important;
    border-bottom: 1px solid transparent !important;
  }
  .ant-tabs-tab-active {
    border-color: @primary-color!important;
    height: 28px;
  }
}
// 首页旁边头部样式管理
.oNotifyTitle {
  text-decoration: underline;
  margin-left: 45px;
  color: @primary-color;
}

#app {
  height: 100%;
  .ant-layout {
    height: 100%;
  }
}
.header {
  width: 100%;
  height: @logoHeight !important;
  z-index: 2;
  /* logo */
  .logo {
    transition: 0.2s;
    height: @logoHeight !important;
    width: 162px;
    background-color: @primary-color;
    img {
      transition: 0.2s;
      margin: 0 auto;
      height: @logoHeight;
    }
  }
}

// 右侧整体
.ant-layout {
  padding-left: 0 !important;
  
}
// content
.ant-layout-content {
  background: none !important;
  padding: 0 !important;
}
.ant-breadcrumb {
  width: 100%;
  margin-left: 10px !important;
}
</style>
