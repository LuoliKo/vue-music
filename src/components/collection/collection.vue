<template>
  <div id="collection">
    <nav class="collection-nav">
      <ul>
        <router-link tag="li" to="/collection/song">
          喜欢歌曲
        </router-link>
        <router-link tag="li" to="/collection/sheet">
          收藏歌单
        </router-link>
        <router-link tag="li" to="/collection/history">
          播放历史
        </router-link>
      </ul>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {};
</script>

<style lang="stylus">
  @import "~common/stylus/variable.styl"
  #collection
    .collection-nav
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
          &.active
            border-bottom: 2px solid $color-theme
          &:active
            background: #ccc
</style>
