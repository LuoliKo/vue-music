<template>
  <transition name="fade">
    <div class="menu">
      <div class="mask" @click="close"></div>
      <div class="box">
        <slot></slot>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    methods: {
      close () {
        this.$emit('close');
      }
    }
  };
</script>

<style lang="stylus">
  .menu
    position: relative
    z-index: 1000
    .mask
      position: fixed
      top: 0
      left: 0
      right: 0
      bottom: 0
      background: rgba(0, 0, 0, .6)
    .box
      position: fixed
      bottom: 0
      left: 0
      right: 0
      background: #fff

  .fade-enter-active, .fade-leave-active
    .mask, .box
      transition: all .3s

  .fade-enter, .fade-leave-to
    .mask
      opacity: 0
    .box
      transform: translateY(100%)
</style>
