<template>
  <transition name="fade">
    <div class="sheet-info" @click="close">
      <div class="bg">
        <img :src="avatar">
      </div>
      <scroll class="scroll" :data="introduction">
        <div class="info">
          <div class="avatar">
            <img v-lazy="avatar">
          </div>
          <h1 class="name" v-html="sheet.name"></h1>
          <div class="desc">
            <p v-html="description"></p>
          </div>
          <p v-if="!isSingerPage&&sheet.description" class="tags">
            <span>标签：</span>
            <span v-for="item in sheet.tags">{{item}}</span>
          </p>
        </div>
      </scroll>
      <span @click="close" class="iconfont icon-guanbi close"></span>
    </div>
  </transition>
</template>

<script>
  import {mapGetters} from 'vuex';
  import Scroll from 'base/scroll/scroll';
  import {getSingerDesc} from 'api/singer';

  export default {
    data () {
      return {
        introduction: null,
        briefDesc: null,
        isSingerPage: false
      };
    },
    computed: {
      avatar () {
        if (!this.isSingerPage) {
          return this.sheet['coverImgUrl'];
        } else {
          return this.sheet['img1v1Url'];
        }
      },
      description () {
        if (!this.isSingerPage) {
          return this.sheet.description ? this.sheet.description.replace(/\n/g, '<br>') : '找不到歌单介绍啦~';
        } else {
          return this.briefDesc;
        }
      },
      ...mapGetters([
        'sheet'
      ])
    },
    created () {
      this.isSingerPage = location.href.indexOf('singer') !== -1;
      if (this.isSingerPage) {
        this._getArtistDesc();
      }
    },
    methods: {
      close () {
        this.$emit('closeInfo');
      },
      _getArtistDesc () {
        let id = this.sheet.id;
        getSingerDesc(id).then((res) => {
          this.introduction = res.introduction;
          this.briefDesc = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + res.briefDesc.replace(/\n/g, '<br>');
          ;
        });
      }
    },
    components: {
      Scroll
    }
  };
</script>

<style lang="stylus">
  @import "~common/stylus/variable"

  .sheet-info
    position: fixed
    top: 0
    bottom: 0
    left: 0
    right: 0
    z-index: 1000
    background: #888
    .bg
      position: fixed
      top: 0
      left: 0
      right: 0
      bottom: 0
      z-index: -1
      opacity: 0.5
      filter: blur(20px)
      img
        width: 100%
        height: 100%
    .close
      position: fixed
      bottom: 10px
      left: 50%
      transform: translate(-50%, 0)
      width: 40px
      height: 40px
      background: rgba(0, 0, 0, .2)
      color: #555
      border-radius: 50%
      text-align: center
      line-height: 40px
      &.iconfont
        color: #fff
        font-size: 25px
    .scroll
      position: fixed
      top: 30px
      right: 0
      left: 0
      bottom: 60px
      overflow: hidden
      .info
        .avatar
          display: block
          margin: auto
          width: 60%
          img
            width: 100%
            height: 100%
        .name
          display: block
          width: 60%
          margin: auto
          color: rgba(255, 255, 255, .8)
          font-size: 16px
          line-height: 20px
          text-align: center
        .desc
          display: block
          width: 80%
          margin: 20px auto
          color: rgba(255, 255, 255, .8)
          font-size: $font-size-medium
          line-height: 20px
          text-align: left
        .tags
          display: block
          margin: auto
          width: 80%
          span
            display: inline-block
            padding: 5px
            color: rgba(255, 255, 255, .8)
            font-size: $font-size-medium
            line-height: 20px
            text-align: left

  .fade-enter-active, .fade-leave-active
    transition: all 0.3s

  .fade-enter, .fade-leave-to
    opacity: 0
</style>
