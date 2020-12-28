<template>
  <div>
    <div id="testTable" ref="tstable">
      <div id="hotTable" ref="testHot" class="hotTable">
        <HotTable id="oTable" :root="root" ref="hotTab" :settings="hotSettings"></HotTable>
      </div>
    </div>
    <button @click="print">打印</button>
  </div>
</template>

<script>
import { HotTable } from '@handsontable-pro/vue'
import 'handsontable-pro/dist/handsontable.full.css'
import Handsontable from 'handsontable-pro'
import 'handsontable-pro/languages/zh-CN'
import 'handsontable-pro/dist/handsontable.full.js'

// import printJS from 'print-js'

// 左侧菜单栏数据
let writeInMsg = ''
let TableMsg = ''
export default {
  props: {
    mode: {
      validator: function (value) {
        return ['edit', 'read', 'print'].indexOf(value) >= 0
      },
      default: 'edit'
    },
    paper: {
      type: String,
      default: '4'
    },

    layout: {
      type: String,
      default: '1'
    },
    // 打印时的页边距（单位：毫米）
    padding: {
      type: [Number, Array],
      default: 0
    },
    subjects: {
      type: Array,
      default: () => []
    },
    data: {
      type: Object,
      default: () => ({})
    }
  },
  watch: {
    paperWidth: {
      handler (nv) {
        this.$emit('paperwidth', `${nv}mm`)
      },
      immediate: true
    }
  },
  data: () => {
    return {
      hot2: '',
      // 顶部button
      borderWidth: '',
      fontSize: 16,
      oStyles: [],

      // 开关
      oBegin: true,

      root: 'test-hot',

      hotSettings: {
        data: [], // 数据可以是二维数组，也可以是数组对象
        language: 'zh-CN', // 声明用中文的语言包
        contextMenu: [
          'row_above',
          'row_below',
          'col_left',
          'col_right',
          '---------',
          'remove_row',
          'remove_col',
          '---------',
          'alignment',
          'copy',
          'cut',
          'mergeCells'
        ],
        rowHeights: 23.4,
        colWidths: 66,

        startRows: 60, // 行列范围

        startCols: 60,

        minRows: 46, // 最小行列

        minCols: 11,

        maxRows: 999, // 最大行列

        maxCols: 11,

        rowHeaders: true, // 行表头，可以使布尔值（行序号），可以使字符串（左侧行表头相同显示内容，可以解析html），也可以是数组（左侧行表头单独显示内容）。

        colHeaders: true, // 自定义列表头or 布尔值

        minSpareCols: 1, // 列留白

        minSpareRows: 1, // 行留白

        currentRowClassName: 'currentRow', // 为选中行添加类名，可以更改样式

        currentColClassName: 'currentCol', // 为选中列添加类名

        autoWrapRow: true, // 自动换行

        contextMenu: {
          // 自定义右键菜单，可汉化，默认布尔值

          items: {
            row_above: {
              name: '上方插入一行'
            },

            row_below: {
              name: '下方插入一行'
            },

            col_left: {
              name: '左方插入列'
            },

            col_right: {
              name: '右方插入列'
            },

            hsep1: '---------', // 提供分隔线

            remove_row: {
              name: '删除行'
            },

            remove_col: {
              name: '删除列'
            },

            make_read_only: {
              name: '只读'
            },

            borders: {
              name: '表格线'
            },

            commentsAddEdit: {
              name: '添加备注'
            },
            alignment: {
              name: '排列方式'
            },

            commentsRemove: {
              name: '取消备注'
            },

            freeze_column: {
              name: '固定列'
            },

            unfreeze_column: {
              name: '取消列固定'
            },

            hsep2: '---------'
          }
        }, // 右键效果

        fillHandle: true, // 选中拖拽复制 possible values: true, false, "horizontal", "vertical"

        fixedColumnsLeft: 0, // 固定左边列数

        fixedRowsTop: 0, // 固定上边列数

        selectionMode: 'multiple',
        outsideClickDeselects: false, // 点击外面焦点不会消失  *****
        mergeCells: [
          // 合并
          // {row: 1, col: 1, rowspan: 3, colspan: 3},  //指定合并，从（1,1）开始行3列3合并成一格
          // {row: 3, col: 4, rowspan: 2, colspan: 2}   // 指定合并行3列4向下合并两行
        ],

        columns: [
          // 添加每一列的数据类型和一些配置
          // {

          //   //data: 'title', 此设置标识，数组对象数据格式时的列字段

          //   type: 'date',   //时间格式

          //   dateFormat: 'YYYYMMDD',

          //   correctFormat: true,

          //   defaultDate: '19000101'

          // },
          // {

          //   type: 'dropdown', //下拉选择

          //   source: ['BMW', 'Chrysler', 'Nissan', 'Suzuki', 'Toyota', 'Volvo'],

          //   strict: false   //是否严格匹配

          // },

          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' }, // 数值
          { type: 'text' },
          { type: 'text' }, // 指定的数据格式
          { type: 'text' }, // 字符串
          { type: 'text' }, //
          { type: 'text' }, //
          { type: 'text' }, //
          { type: 'text' }, //
          { type: 'text' }, //
          { type: 'text' }, //
          { type: 'text' }, //
          { type: 'text' }, //
          { type: 'text' }, //
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' },
          { type: 'text' }
        ],

        // 焦点消失时触发 afterDeselect

        // 此方法返回什么就为当前选中的td添加什么class
        afterDrawSelection (oStyle) {
          return oStyle
        },

        // 数据改变时触发此方法
        afterChange: function (changes, source) {
          TableMsg = this.getData()
        },

        // 获取单元格属性前被调用
        beforeGetCellMeta (row, col, cellProperties) {
          // console.log(row, col, cellProperties)
        },
        // 手动渲染后调用 afterRenderer(TD, row, col, prop, value, cellProperties)
        // let msg = JSON.parse(localStorage.getItem('oStyle'))
        // this.setDataAtCell(msg.row, msg.col, msg)

        // 单元格样式被改变后调用
        afterSetCellMeta (row, col, key, value) {
          // if (value.top.hide && value.bottom.hide && value.left.hide && value.right.hide) {
          // } else {
          //   let result = {}
          //   let oMap = {}
          //   let oArr = ['left', 'right', 'top', 'bottom', 'row', 'col']
          //   Object.keys(value)
          //     .filter(index => oArr.includes(index))
          //     .forEach(index => {
          //       result[index] = value[index]
          //     })
          //   newArr.push(result)
          //   // 1、把数组元素作为对象的键存起来（这样就算有重复的元素，也会相互替换掉）
          //   newArr.forEach(item => (oMap[JSON.stringify(item)] = item))
          //   // 2、再把对象的值抽成一个数组返回即为不重复的集合
          //   newArr = Object.keys(oMap).map(key => oMap[key])
          //   console.log(newArr)
          //   localStorage.setItem('result', JSON.stringify(newArr))
          // }
        },
        // 设置指定单元格数据 this.setDataAtCell(3,5,'value')

        // 获取单元格的配置信息后被调用 afterGetCellMeta (row, col, cellProperties)

        // 设定单元格样式 negativeValueRenderer(instance, td, row, col, prop, value, cellProperties)
        // negativeValueRenderer(instance, td, row, col, prop, value, cellProperties){
        //   let row = localStorage.getItem('row')
        //   let col = localStorage.getItem('col')
        //   console.log(instance, td, row, col, prop, value, cellProperties)
        // },
        // 单元格选择完成后将触发事件 afterSelectionEnd(r,w)
        // 在提供的坐标处的源数据集中设置提供的值。
        // setSourceDataAtCell(row, column, value, source){

        // },

        // 单击一个单元格之后但在所有与之相关的计算之前触发 beforeOnCellMouseDown(event, coords, TD, controller)
        // 单击事件的回调函数
        afterOnCellMouseDown (e, coords, TD) {
          // 判断 oRed 是否为true进行更改样式
          localStorage.setItem('row', coords.row)
          localStorage.setItem('col', coords.col)
          // this.getSelected()       //获取当前点击单元格的坐标（数组形式）
          // this.getCell(coords.row,coords.col) //获得单元格对象
          // console.log(this.getCellMeta(1,1)) //获得单元格的属性对象
          // this.selectCell(coords.row,coords.col)//获得单元格的属性对象
          if (TD.innerHTML) {
          } else {
            TD.innerHTML = writeInMsg
            this.setDataAtCell(coords.row, coords.col, writeInMsg)
            writeInMsg = ''
          }
        },
        manualColumnFreeze: true, // 手动固定列

        manualColumnMove: true, // 手动移动列

        manualRowMove: true, // 手动移动行

        manualColumnResize: true, // 手工更改列距

        manualRowResize: true, // 手动更改行距

        comments: true, // 添加注释
        licenseKey: 'ab3e4-1bee8-ed01c-4d94b-08cfe',

        cell: [
          // {row: 1, col: 1, comment: {value: 'this is test'}},
        ],

        customBorders: [], // 添加边框

        columnSorting: true, // 排序

        stretchH: 'none' // 根据宽度横向扩展，last:只扩展最后一列，none：默认不扩展
      }
    }
  },

  name: 'handsonTable',

  components: {
    HotTable
  },
  // 进入修改页面时向后端发送请求获取数据，渲染页面
  created () {

    // 1、横、纵；2、A0-A5；3、data数据；4、样式
    // axios('***').then(res=>{
    //   // 给hotSettings中的data赋值，渲染表格数据
    //     this.hotSettings.data = res.TableMsg
    //     给this.oStyles赋值渲染样式
    // this.oStyles = res.oStyles
    //   })
  },

  methods: {
    // 改变字体大小
    onChange (value) {
      document.querySelector('.current').style.fontSize = this.fontSize + 'px'
    },
    // 打印
    print () {
      // const style = '@page { margin: 0 } @media print { }'
      // printJS({ printable: 'hotTable', type: 'html',style:style, scanStyles: false})
      this.$print(this.$refs.tstable)
    },

    // 单元格样式
    oStyleClick (styleData) {
      this.hot2 = new Handsontable(document.getElementById('hotTable'), this.hotSettings)
      const row = localStorage.getItem('row')
      const col = localStorage.getItem('col')
      this.oStyles = this.oStyles.map(item => {
        if ((item[0] == row) && (item[1] == col)) {
          this.hot2.setCellMeta(item[0], item[1], 'className', item[2] + styleData)
          item[2] = item[2] + styleData
          this.oBegin = false
        } else {
          this.hot2.setCellMeta(item[0], item[1], 'className', item[2])
        }
        return item
      })
      if (this.oBegin) {
        this.hot2.setCellMeta(row, col, 'className', styleData)
        this.oStyles.push([row, col, styleData])
      }
      this.oBegin = true
    },
    // 将表格中的数据放在localStorage
    ScTableMsg () {
      localStorage.setItem('TableMsg', JSON.stringify(TableMsg))
    },
    // 改变横向，纵向
    changeHz (minRMsg, maxRMsg, maxCMsg) {
      if (minRMsg && maxRMsg && maxCMsg) {
        this.changeTableA0(minRMsg, maxRMsg, maxCMsg)
      } else {
        this.changeTableA0(this.hotSettings.maxCols, this.hotSettings.maxCols, this.hotSettings.minRows)
      }
    },
    // 更改数组长度
    // rowHeights: 1,  // 行高
    // colWidths: 1,
    // minRows: 46,  //最小行列
    // maxCols: 5,
    // columns  数组的长度对应列的长度
    // A0-A5 改变大小
    changeTableA0 (minR, maxR, maxC) {
      this.hotSettings.minRows = minR
      this.hotSettings.maxRows = maxR
      this.hotSettings.maxCols = maxC
    },
    writeIn (data) {
      writeInMsg = data
    }
  }
}

</script>
<style lang="scss">
// current highlight
// 下对齐
.handsontable td.Vb {
 vertical-align: bottom;
}
// 垂直居中
.handsontable td.Vm {
 vertical-align: middle;
}
// 上对齐
.handsontable td.Vt {
 vertical-align: top;
}
// 右对齐
.handsontable td.AlignRight {
  text-align: right;
}
// 居中
.handsontable td.AlignCenter {
  text-align: center;
}
// 左对齐
.handsontable td.AlignLeft {
  text-align: left;
}
// 左边框
.handsontable td.LeftBorder {
  border-left: 1px black solid;
}
// 下边框
.handsontable td.BottomBorder {
  border-bottom: 1px black solid;
}
// 右边框
.handsontable td.RightBorder {
  border-right: 1px black solid;
}
// 上边框
.handsontable td.TopBorder {
  border-top: 1px black solid;
}
// 边框
.handsontable td.AllBorder {
  border: 1px black solid;
}
// 加粗
.handsontable td.oBold {
  font-weight: bold;
}
// 斜体
.handsontable td.oItalic {
  font-style: italic;
}
// 下划线
.handsontable td.underLine {
  text-decoration: underline;
}

// 单元格省略号
.handsontable td {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

// 整体布局
#testTable {
  width: 1200px;
  height: auto;
  overflow: hidden;
  #hotTable {
    width: auto !important;
    height: auto !important;
    overflow: visible;
  .wtHolder{
    height: auto!important;
  }
  }
}
</style>
