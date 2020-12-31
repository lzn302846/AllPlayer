<template>
  <div class="box">
    css样式使用js变量
  </div>
</template>
<script>
export default {
  data(){
    return {
    height:'124',

    }
  },
  mounted(){
    Object.assign(document.querySelector('.box').style,this.styleVar)
  },
  computed: {
    styleVar() {
      return {
        'fontSize': this.height + 'px'
      }
    }
  },
}
</script>
<style scoped>
.box {
  font-size: var(--fontSize);
}
</style>