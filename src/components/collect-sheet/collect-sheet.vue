<template>
  <div class="collect-sheet">
    <scroll class="sheet-list" ref="scroll" :data="collectSheets" v-if="collectSheets.length">
      <ul class="sheet-ul">
        <li v-for="item in collectSheets" class="item" @click="selectItem(item)">
          <div class="avatar">
            <img v-lazy="item.coverImgUrl">
          </div>
          <div class="right">
            <h2 class="name" v-html="item.name"></h2>
            <p class="count">
              <span class="song-count">{{item.trackCount}}首</span>
              <span class="play-count" v-text="playCount(item.playCount)"></span>
            </p>
          </div>
          <div class="more" @click.stop="getMore(item)">
            <i class="iconfont icon-gengduo"></i>
          </div>
        </li>
      </ul>
    </scroll>
    <fail-png class="nothing" v-if="!collectSheets.length">
      <span>大人！您的宝库依旧空空如也~</span>
    </fail-png>
    <router-view></router-view>
  </div>
</template>

<script>
  import Scroll from 'base/scroll/scroll';
  import FailPng from 'base/failpng/failpng';
  import Loading from 'base/loading/loading';
  import {mapGetters, mapMutations} from 'vuex';
  import {moreMenuMixin, playListMixin} from 'common/js/mixin';

  export default {
    mixins: [moreMenuMixin, playListMixin],
    computed: {
      ...mapGetters([
        'collectSheets'
      ])
    },
    methods: {
      scrollRefresh (playList) {
        if (!this.$refs.scroll) {
          return;
        }
        const bottom = playList.length > 0 ? '55px' : '';
        this.$refs.scroll.$el.style.bottom = bottom;
        this.$refs.scroll.refresh();
      },
      selectItem (sheet) {
        this.$router.push({
          path: `/collection/sheet/${sheet.id}`
        });
        this.selectSheet(sheet);
      },
      playCount (count) {
        if (count > 10000) {
          let _count = count / 10000;
          _count = _count.toFixed(1);
          let isZero = _count.split('.')[1] === '0';
          if (isZero) {
            _count = parseInt(_count).toFixed(0);
          }
          return `播放${_count}万次`;
        } else {
          return `播放${count}次`;
        }
      },
      getMore (sheet) {
        this.setMoreMenu(sheet, 'sheet', true);
      },
      ...mapMutations({
        selectSheet: 'SELECT_SHEET',
        setCollectSheets: 'SET_COLLECT_SHEETS'
      })
    },
    components: {
      Scroll,
      FailPng,
      Loading
    }
  };
</script>

<style lang="stylus">
  @import "~common/stylus/variable"

  .sheet-list
    position: absolute
    top: 101px
    left: 0
    right: 0
    bottom: 0
    background: #fff
    overflow: hidden
    .sheet-ul
      display: block
      padding: 0 2px
      width 100%
      box-sizing: border-box
      .item
        position: relative
        display: flex
        padding: 0 3px
        width: 100%
        height: 60px
        box-sizing: border-box
        .more
          position: absolute
          right: 0
          top: 50%
          transform: translate(0, -50%)
          width: 45px
          height: 45px
          border-radius: 50%
          color: $color-text-s
          &:active
            background: #ccc
          .iconfont
            position: absolute
            left: 50%
            top: 50%
            transform: translate(-50%, -50%)
            font-size: $font-size-large
        .avatar
          flex: 0 0 50px
          height: 50px
          margin-top: 5px
          img
            width: 100%
            height: 100%
        .right
          flex-grow: 1
          margin-left: 5px
          padding: 10px 0
          box-sizing: border-box
          overflow: hidden
          border-bottom: 1px solid rgba(177, 177, 177, .2)
          .name
            margin-bottom: 8px
            width: 90%
            white-space: nowrap
            text-overflow ellipsis
            overflow: hidden
            font-size: $font-size-medium-x
            color: $color-text
          .count
            width: 100%
            white-space: nowrap
            text-overflow ellipsis
            overflow: hidden
            font-size: $font-size-small
            color: $color-text-s
            span
              padding-right: 5px

  .nothing
    margin: auto
    padding-top: 50px
    width: 50%
</style>
