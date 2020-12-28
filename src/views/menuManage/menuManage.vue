<template>
  <excel-export :sheet="sheet">
   <div>导出</div>
</excel-export>
</template>

<script>
import { ExcelExport } from 'pikaz-excel-js'
export default {
  components: {
    ExcelExport
  },
  data () {
    return {
      sheet: [
        {
          title: '水果的味道',
          tHeader: ['荔枝', '柠檬'],
          table: [{ litchi: '甜', lemon: '酸' }],
          keys: ['litchi', 'lemon'],
          sheetName: '水果的味道'
        }
      ]
    }
  }
}

</script>
<style>
</style>
