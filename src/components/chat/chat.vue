<template>
  <div id="chat">
    <fail-png class="png-box">
      <span>作者很懒！这一页什么东西都没有，除了我~~</span>
    </fail-png>
  </div>
</template>

<script>
  import FailPng from 'base/failpng/failpng';

  export default {
    components: {
      FailPng
    }
  };
</script>

<style lang="stylus">
  #chat
    .png-box
      padding-top: 50px
      margin: auto
      width: 50%
</style>
