<template>
  <nav id="nav">
    <ul>
      <router-link tag="li" to="/disc/sheet">
        歌单
      </router-link>
      <router-link tag="li" to="/disc/rank">
        排行榜
      </router-link>
      <router-link tag="li" to="/disc/singer">
        歌手
      </router-link>
    </ul>
  </nav>
</template>

<script>
  export default {};
</script>

<style lang="stylus">
  @import "~common/stylus/variable.styl"

  #nav
    background: $color-background
    ul
      display: flex
      margin: auto
      width: 60%
      text-align: center
      li
        flex: 1
        padding 15px 0
        font-size: $font-size-medium
        color: $color-text
        border-bottom: 2px solid #fff
        &:active
          background: #ccc
        &.active
          border-bottom: 2px solid $color-theme
</style>
