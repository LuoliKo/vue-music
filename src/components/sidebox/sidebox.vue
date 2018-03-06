<template>
  <transition name="fade">
    <div id="sideBox" v-show="isShow" @click="toClose">
      <div class="desc" @click.stop>
        <div class="logo">
          <img src="./logo.png">
        </div>
        <h1 class="title">疯狂音乐</h1>
        <p>一个使用vuejs开发的移动端webapp音乐播放器。</p>
        <P>支持音乐歌单，各种排行榜，歌手，支持免登录注册收藏歌曲，可以关键字搜索歌手歌曲...</P>
        <p>技术栈：vue2.0 vuex axios vue-router vue-cli NeteaseCloudMusicApi...</p>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    props: {
      isShow: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      toClose () {
        this.$emit('close');
      }
    }
  }
  ;
</script>

<style lang="stylus">
  @import "~common/stylus/variable"

  #sideBox
    position: fixed
    top: 0
    right: 0
    left: 0
    bottom: 0
    z-index: 1000
    background: rgba(0, 0, 0, .7)
    &.fade-enter-active, &.fade-leave-active
      transition: all .3s
    &.fade-enter, &.fade-leave-to
      background: rgba(0, 0, 0, 0)
      .desc
        transform: translate(-100%, 0)
    .desc
      display: block
      width: 80%
      height: 100%
      background: #fff
      transition: all .3s
      text-align: center
      color: $color-text
      .logo
        display: block
        width: 100%
        padding-top: 20px
        img
          width: 80%
          height: auto
      .title
        margin-bottom: 20px
        font-size: $font-size-large
      p
        display: block
        margin: auto
        width: 80%
        padding: 10px 0
        line-height: 20px
        font-size: $font-size-medium
</style>
