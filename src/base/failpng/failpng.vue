<template>
  <div class="fail-box">
    <div class="png">
      <img src="./fail.png">
    </div>
    <slot></slot>
  </div>
</template>

<script>
  export default {};
</script>

<style lang="stylus">
  .fail-box
    text-align: center
    .png
      display: block
      width: 100%
      img
        width: 100%
        height: auto
</style>
