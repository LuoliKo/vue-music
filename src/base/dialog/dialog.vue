<template>
  <div class="dialog">
    <slot></slot>
  </div>
</template>

<script>
  export default {};
</script>

<style lang="stylus">
  .dialog
    position: fixed
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
    background: #fff
</style>
