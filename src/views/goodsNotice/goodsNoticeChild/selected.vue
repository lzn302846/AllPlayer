<template>
  <div class="editable-cell">
    <div v-if="editable" class="editable-cell-input-wrapper">
      <a-select
        ref="onSelect"
        :open="boxShow"
        @click.prevent="selectClick"
        @focus="selectFocus"
        :default-value="value"
        style="width:100%"
        :dropdownMatchSelectWidth="false"
        :getPopupContainer="triggerNode => triggerNode.parentNode"
      >
        <div slot="dropdownRender" slot-scope="menu">
          <v-nodes :vnodes="menu" />
          <a-divider style="margin: 4px 0;" />
          <div class="oDropdownRender">
            <div class="InputOften">
                  <a-input
                    v-onfocus
                    @blur.stop="InputBlur"
                    @focus.stop="InputClick"
                    ref="onInput"
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
              :style="{padding: '4px 8px',width:selectDropWidth,background:'white', cursor: 'pointer',overflowY: 'auto',maxHeight:'40vh',}"
              @mousedown="e => e.preventDefault()"
              v-if="SearchInput"
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
        <a-select-option
          disabled
          :style="{width:selectDropWidth,height:'10px!important'}"
          value="请选择"
        >请选择</a-select-option>
      </a-select>
      <a-icon type="check" class="editable-cell-icon-check" @click="check" />
    </div>
    <div v-else class="editable-cell-text-wrapper">
      {{ value || ' ' }}
      <a-icon type="edit" class="editable-cell-icon" @click="edit" />
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
  mounted () {
    document.oncontextmenu = function () {
      return false
    }
    document.onselectstart = function () {
      return false
    }
  },
  data () {
    return {
      // 常用事项数组
      oftenItem: ['测试1', '测试2', '测试3', '测试4', '测试5', '测试6'],
      // 输入框v-model
      SearchInput: '',
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,
      gData,
      value: this.text,
      editable: false,
      selectDropWidth: '200px',
      boxShow: false
    }
  },
  props: ['text'],
  components: {
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes
    }
  },
  methods: {
    selectClick () {
      console.log('select被点击了。。')
    },
    // input内容改变
    onExpand (expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
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
    InputBlur () {
      console.log('input-->blur')
      this.boxShow = false
    },
    // input点击事件
    InputClick () {
      console.log('input-->focus')
      this.boxShow = true
    },
    // 常用li的点击事件
    onLiClick (often) {
      this.value = often
      console.log('li-->click')
      this.editable = false
    },
    selectFocus () {
      this.boxShow = true
    },
    onSelect (selectedKeys, info) {
      console.log(info.node.eventKey)
      this.value = info.node.eventKey
      this.editable = false
    },
    check () {
      this.editable = false
      this.$emit('change', this.value)
    },
    edit () {
      this.editable = true
    }
  }
}
</script>
<style lang="scss">
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
