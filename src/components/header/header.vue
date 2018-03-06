<template>
  <div id="header">
    <span class="iconfont icon-icon-9 icon-left" @click="showSideBox"></span>
    <span class="iconfont icon-icon-8 icon-right" @click="toSearch"></span>
    <ul>
      <router-link tag="li" to="/disc">
        <i class="iconfont icon-icon-"></i>
      </router-link>
      <router-link tag="li" to="/chat">
        <i class="iconfont icon-icon-3"></i>
      </router-link>
      <router-link tag="li" to="/collection">
        <i class="iconfont icon-xiai"></i>
      </router-link>
    </ul>
  </div>
</template>

<script>
  export default {
    methods: {
      showSideBox () {
        this.$emit('showSideBox', true);
      },
      toSearch () {
        this.$router.push({path: '/search'});
      }
    }
  };
</script>

<style lang="stylus">
  @import "~common/stylus/variable"

  #header
    position: relative
    z-index: 100
    display: block
    width: 100%
    height: 55px
    background: $color-theme
    color: #fff
    .iconfont
      font-size: 30px
    & > span
      position: absolute
      top: 50%
      transform: translate(0, -50%)
      padding: 5px
      border-radius: 50%
      &.icon-left
        left: 10px
      &.icon-right
        right: 10px
      &:active
        background: rgba(239, 97, 100, .9)
    & > ul
      position: absolute
      left: 50%
      top: 50%
      transform: translate(-50%, -50%)
      display: flex
      width: 50%
      li
        flex: 1
        text-align: center
        color: rgba(255, 255, 255, .7)
        &.active
          color: #fff
</style>
