<template>
  <div class="search-result">
    <ul class="nav">
      <router-link tag="li" to="/search/song" replace>单曲</router-link>
      <router-link tag="li" to="/search/sheet" replace>歌单</router-link>
      <router-link tag="li" to="/search/singer" replace>歌手</router-link>
      <router-link tag="li" to="/search/lyric" replace>歌词</router-link>
    </ul>
    <keep-alive>
      <router-view :queryString="queryString" @showInfo="showInfo"></router-view>
    </keep-alive>
  </div>
</template>

<script>
  export default {
    props: {
      queryString: {
        type: String,
        default: ''
      }
    },
    methods: {
      showInfo () {
        this.$emit('showInfo');
      }
    },
    watch: {
      queryString (newVal, oldVal) {
        if (newVal.trim() && !oldVal.trim()) {
          this.$router.replace('/search/song');
        }
      }
    }
  };
</script>

<style lang="stylus">
  @import "~common/stylus/variable"

  .search-result
    position: absolute
    top: 55px
    left: 0
    right: 0
    bottom: 0
    .nav
      display: flex
      width: 100%
      li
        display: inline-block
        flex: 1
        padding: 10px 0
        border-bottom: 2px solid #fff
        text-align: center
        font-size: $font-size-medium
        color: $color-text
        &.active
          border-bottom: 2px solid $color-theme
    .result-list
      position: absolute
      left: 0
      top: 93px
      right: 0
      bottom: 0
      overflow: hidden
</style>
