<template>
  <div style="position: absolute;">
    <div v-if="editable">
      <span
      @click.stop="selectClick"
      role="combobox"
      aria-haspopup="listbox"
      tabindex="0"
      class="ant-select ant-select-enabled ant-select-allow-clear"
      :class="selectFocus?'ant-select-focused':''"
      text="32"
      style="width: 100%;"
    >
      <span
        class="ant-select-selection ant-select-selection--single"
        :style="{height:selectHeight}"
      >
        <span class="ant-select-selection__rendered">
          <span class="ant-select-selection__placeholder">{{value}}</span>
        </span>
        <span class="ant-select-arrow" style="outline: none;">
          <i aria-label="图标: down" class="anticon anticon-down ant-select-arrow-icon">
            <svg
              viewBox="64 64 896 896"
              data-icon="up"
              width="1em"
              height="1em"
              fill="currentColor"
              aria-hidden="true"
              focusable="false"
              :class="svgRoute?'svgRoute':''"
            >
              <path
                d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z"
              />
            </svg>
          </i>
        </span>
      </span>
    </span>
    <div style="position: absolute; top: 0px; left: 0px; width: 100%;">
      <div
      class="ant-select-dropdown ant-select-tree-dropdown dropdownTransition ant-select-dropdown--singleant-select-dropdown-placement-bottomLeft"
      :style="{maxHeight: '400px', overflow: 'auto',position: 'absolute', left: '0', top: selectHeight, minWidth: '224px',}"
      :class="dropDownShow?'':'dropDownShow'"
    >
      <div class="InputOften">
        <a-input
          @click.stop
          style="width:90%;margin:4px auto;border-radius:4px"
          placeholder="输入名称,按Enter键搜索"
          v-model="SearchInput"
          @change="onChange"
        />
      </div>
      <div class="oftenShow" v-if="!SearchInput">
        <p>常用</p>
        <ul>
          <li v-for="often in oftenItem" :key="often" @click="onLiClick(often)">{{often}}</li>
        </ul>
      </div>
      <div
        :style="{padding: '4px 8px',width:'100%',background:'white', cursor: 'pointer',overflowY: 'auto',maxHeight:'35vh',}"
        @mousedown="e => e.preventDefault()"
      >
        <a-tree
          :expanded-keys="expandedKeys"
          :auto-expand-parent="autoExpandParent"
          :tree-data="gData"
          @expand="onExpand"
          @select="onSelect"
        >
          <template slot="title" slot-scope="{ title }">
            <span v-if="title.indexOf(searchValue) > -1">
              {{ title.substr(0, title.indexOf(searchValue)) }}
              <span
                style="color: #f50"
              >{{ searchValue }}</span>
              {{ title.substr(title.indexOf(searchValue) + searchValue.length) }}
            </span>
            <span v-else>{{ title }}</span>
          </template>
        </a-tree>
      </div>
    </div>
    </div>

    </div>
    <div v-else class="editable-cell-text-wrapper">
      {{ value || ' ' }}
      <a-icon type="edit" class="editable-cell-icon" @click.stop="edit" />
    </div>
  </div>
</template>

<script>
const gData = [
  {
    title: '测试 1',
    key: '测试 1',
    children: [
      {
        title: '测试 1-0',
        key: '测试 1-0',
        children: [
          { title: '测试 1-0-0', key: '测试 1-0-0' },
          { title: '测试 1-0-1', key: '测试 1-0-1' },
          { title: '测试 1-0-2', key: '测试 1-0-2' }
        ]
      },
      {
        title: '测试 2-0',
        key: '测试 2-0',
        children: [
          { title: '测试 2-0-0', key: '测试 2-0-0' },
          { title: '测试 2-0-1', key: '测试 2-0-1' },
          { title: '测试 2-0-2', key: '测试 2-0-2' }
        ]
      },
      {
        title: '测试 3-0',
        key: '测试 3-0'
      }
    ]
  },
  {
    title: '测试 2',
    key: '测试 2',
    children: [
      { title: '测试 2.0', key: '测试 2.0' },
      { title: '测试 2.1', key: '测试 2.1' },
      { title: '测试 2.2', key: '测试 2.2' }
    ]
  },
  {
    title: '测试 3',
    key: '测试 3'
  }
]

const addScoped = data => {
  data.map(item => {
    Object.assign(item, { scopedSlots: { title: 'title' } })
    if (item.children) {
      addScoped(item.children)
    }
  })
}
addScoped(gData)
// 采用递归的方式遍历
// 将(3) [{…}, {…}, {…}, __ob__: Observer]
//              转为
// (15) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
const dataList = []
const generateList = data => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i]
    const key = node.key
    dataList.push({ key, title: key })
    if (node.children) {
      generateList(node.children)
    }
  }
}
generateList(gData)

const getParentKey = (key, tree) => {
  let parentKey
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i]
    if (node.children) {
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children)
      }
    }
  }
  return parentKey
}
export default {
  data () {
    return {
      selectHeight: '35px', // select的高度
      selectFocus: false, // select的焦点
      svgRoute: false, // select箭头的旋转
      dropDownShow: false, // 下拉内容的显隐

      // 常用事项数组
      oftenItem: ['测试1', '测试2', '测试3', '测试4', '测试5', '测试6'],
      // 输入框v-model
      SearchInput: '',
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,
      gData,
      value: '你好',
      editable: false,
      selectDropWidth: '200px',
      boxShow: false
    }
  },
  methods: {
    // 编辑图标的点击事件
    edit () {
      this.editable = true
    },
    // input的onChange事件
    onChange (e) {
      const value = e.target.value
      console.log(dataList)
      const expandedKeys = dataList
        .map(item => {
          if (item.title.indexOf(value) > -1) {
            return getParentKey(item.key, gData)
          }
          return null
        })
        .filter((item, i, self) => item && self.indexOf(item) === i)
      Object.assign(this, {
        expandedKeys,
        searchValue: value,
        autoExpandParent: true
      })
    },
    // 常用li的点击事件
    onLiClick (often) {
      this.value = often
      this.editable = false
    },
    // select的点击事件
    selectClick () {
      this.selectFocus = !this.selectFocus
      this.svgRoute = !this.svgRoute
      this.dropDownShow = !this.dropDownShow
    },
    // 树 事件
    onExpand (expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onSelect (selectedKeys, info) {
      console.log(info.node.eventKey)
      this.value = info.node.eventKey
      this.editable = false
    }
  }
}
</script>
<style lang="scss">
.dropdownTransition{
  transition: .5s;

}
// 下拉显隐
.dropDownShow{
  height: 0;
  opacity: 0;
}
.editable-cell-text-wrapper:hover .editable-cell-icon{
  display: inline;
}
.svgRoute {
  transition: 0.5s;
  transform: rotateZ(180deg);
}

.oftenShow {
  background: rgb(243, 240, 240);
  text-align: left;
  padding: 5px;
  p {
    color: gray;
    font-size: 12px;
  }
  ul {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-flow: wrap;
    li {
      margin-right: 10px;
      margin-bottom: 5px;
      padding: 2px 6px;
      font-size: 12px;
      color: rgb(83, 81, 81);
      border: 1px solid rgb(207, 200, 200);
      background: rgb(255, 254, 254);
      cursor: pointer;
    }
  }
}
.oDropdownRender {
  position: absolute;
  top: 0;
  width: 100%;
  background: white;
}
.InputOften {
  text-align: center;
}
</style>
<div role="listbox" id="rc-tree-select-list_1" tabindex="-1" class="ant-select-dropdown-content">
        <span class="ant-select-dropdown-search">
          <span class="ant-select-search__field__wrap">
            <input
              type="text"
              aria-label="filter select"
              aria-autocomplete="list"
              aria-controls="rc-tree-select-list_1"
              aria-multiline="false"
              class="ant-select-search__field"
            />
            <span class="ant-select-search__field__mirror">&nbsp;</span>
          </span>
        </span>
        <ul role="tree" unselectable="on" class="ant-select-tree">
          <li role="treeitem" class="ant-select-tree-treenode-switcher-open">
            <span class="ant-select-tree-switcher ant-select-tree-switcher_open">
              <i
                aria-label="图标: caret-down"
                class="anticon anticon-caret-down ant-select-switcher-icon"
              >
                <svg
                  viewBox="0 0 1024 1024"
                  data-icon="caret-down"
                  width="1em"
                  height="1em"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                  class
                >
                  <path
                    d="M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z"
                  />
                </svg>
              </i>
            </span>
            <span
              title="parent 1"
              class="ant-select-tree-node-content-wrapper ant-select-tree-node-content-wrapper-open"
            >
              <span class="ant-select-tree-title">parent 1</span>
            </span>
            <ul
              data-expanded="true"
              role="group"
              class="ant-select-tree-child-tree ant-select-tree-child-tree-open"
            >
              <li role="treeitem" class="ant-select-tree-treenode-switcher-open">
                <span class="ant-select-tree-switcher ant-select-tree-switcher_open">
                  <i
                    aria-label="图标: caret-down"
                    class="anticon anticon-caret-down ant-select-switcher-icon"
                  >
                    <svg
                      viewBox="0 0 1024 1024"
                      data-icon="caret-down"
                      width="1em"
                      height="1em"
                      fill="currentColor"
                      aria-hidden="true"
                      focusable="false"
                      class
                    >
                      <path
                        d="M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z"
                      />
                    </svg>
                  </i>
                </span>
                <span
                  title="parent 1-0"
                  class="ant-select-tree-node-content-wrapper ant-select-tree-node-content-wrapper-open"
                >
                  <span class="ant-select-tree-title">parent 1-0</span>
                </span>
                <ul
                  data-expanded="true"
                  role="group"
                  class="ant-select-tree-child-tree ant-select-tree-child-tree-open"
                >
                  <li role="treeitem" class="ant-select-tree-treenode-switcher-open">
                    <span class="ant-select-tree-switcher ant-select-tree-switcher-noop"></span>
                    <span
                      title="my leaf"
                      class="ant-select-tree-node-content-wrapper ant-select-tree-node-content-wrapper-normal"
                    >
                      <span class="ant-select-tree-title">my leaf</span>
                    </span>
                  </li>
                  <li role="treeitem" class="ant-select-tree-treenode-switcher-open">
                    <span class="ant-select-tree-switcher ant-select-tree-switcher-noop"></span>
                    <span
                      title="your leaf"
                      class="ant-select-tree-node-content-wrapper ant-select-tree-node-content-wrapper-normal"
                    >
                      <span class="ant-select-tree-title">your leaf</span>
                    </span>
                  </li>
                </ul>
              </li>
              <li role="treeitem" class="ant-select-tree-treenode-switcher-open">
                <span class="ant-select-tree-switcher ant-select-tree-switcher_open">
                  <i
                    aria-label="图标: caret-down"
                    class="anticon anticon-caret-down ant-select-switcher-icon"
                  >
                    <svg
                      viewBox="0 0 1024 1024"
                      data-icon="caret-down"
                      width="1em"
                      height="1em"
                      fill="currentColor"
                      aria-hidden="true"
                      focusable="false"
                      class
                    >
                      <path
                        d="M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z"
                      />
                    </svg>
                  </i>
                </span>
                <span
                  title="parent 1-1"
                  class="ant-select-tree-node-content-wrapper ant-select-tree-node-content-wrapper-open"
                >
                  <span class="ant-select-tree-title">parent 1-1</span>
                </span>
                <ul
                  data-expanded="true"
                  role="group"
                  class="ant-select-tree-child-tree ant-select-tree-child-tree-open"
                >
                  <li role="treeitem" class="ant-select-tree-treenode-switcher-open">
                    <span class="ant-select-tree-switcher ant-select-tree-switcher-noop"></span>
                    <span
                      title
                      class="ant-select-tree-node-content-wrapper ant-select-tree-node-content-wrapper-normal"
                    >
                      <span class="ant-select-tree-title">
                        <b style="color: rgb(0, 136, 204);">sss</b>
                      </span>
                    </span>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </div>
