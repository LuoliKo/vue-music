<template>
  <div class="collect-song">
    <div class="controller" v-if="playHistory.length">
      <div class="btn" @click="playAll">
        <i class="iconfont icon-icon-4"></i>
        <span>播放全部</span>
      </div>
      <div class="btn" @click="clear">
        <i class="iconfont icon-shanchu"></i>
        <span>清空列表</span>
      </div>
    </div>
    <song-list v-if="playHistory.length" class="song-list" :songs="playHistory"></song-list>
    <fail-png class="nothing" v-if="!playHistory.length">
      <span>大人！您的宝库依旧空空如也~</span>
    </fail-png>
    <router-view></router-view>
  </div>
</template>

<script>
  import SongList from 'components/song-list/song-list';
  import FailPng from 'base/failpng/failpng';
  import {mapGetters, mapMutations, mapActions} from 'vuex';
  import {clearPlayHistory} from 'common/js/storage';

  export default {
    computed: {
      ...mapGetters([
        'playHistory'
      ])
    },
    methods: {
      playAll () {
        if (!this.playHistory.length) {
          return;
        }
        this.selectSong({list: this.playHistory, index: 0});
      },
      clear () {
        this.$layer.dialog({
          content: '确定清空列表吗？',
          btn: ['取消', '确定']
        }).then((res) => {
          if (res) {
            clearPlayHistory();
            this.setPlayHistory([]);
          }
        });
      },
      ...mapMutations({
        setPlayHistory: 'SET_PLAY_HISTORY'
      }),
      ...mapActions([
        'selectSong'
      ])
    },
    components: {
      SongList,
      FailPng
    }
  };
</script>

<style lang="stylus">
  @import "~common/stylus/variable"

  .collect-song
    position: absolute
    top: 101px
    left: 0
    right: 0
    bottom: 0
    background: #fff
    .controller
      padding: 10px
      box-sizing: border-box
      text-align: center
      .btn
        display: inline-block
        height: 33px
        padding: 0 15px
        border-radius: 5px
        background: #ccc
        line-height: 33px
        .iconfont
          font-size: $font-size-large
          color: $color-theme
        span
          font-size: $font-size-medium-x
    & > .song-list
      position: absolute
      top: 53px
      left: 0
      right: 0
      bottom: 0
      overflow: hidden
    .nothing
      margin: auto
      padding-top: 50px
      width: 50%
</style>
