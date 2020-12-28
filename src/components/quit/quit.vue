<template>
  <div class="oQuit">
    <a-icon type="appstore" />
    <span>退出登录</span>
  </div>
</template>

<script>
export default {};
</script>
<style lang="scss">
.oQuit {
  cursor: pointer;
  position: absolute;
  right: 5%;
  top: 50%;
  color: white;
  font-size: 16px;
  transform: translateY(-50%);
  .anticon-appstore {
    margin-right: 5px;
  }
}
</style>