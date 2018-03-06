<template>
  <div id="singer">
    <scroll class="singer-scroll" :data="singers" ref="scroll">
      <ul>
        <li class="item" v-for="(item,index) in singers" @click="selectItem(item)">
          <span class="num" :class="sortBgImg(index)" v-text="sortText(index)"></span>
          <div class="avatar">
            <img v-lazy="item.img1v1Url">
          </div>
          <span class="name">{{item.name}}<i v-if="item.trans">({{item.trans}})</i></span>
        </li>
      </ul>
      <loading class="loading" v-show="!singers.length">
        <span>加载中...</span>
      </loading>
    </scroll>
    <router-view @showInfo="showInfo"></router-view>
  </div>
</template>

<script>
  import Scroll from 'base/scroll/scroll';
  import Loading from 'base/loading/loading';
  import {getSingerList} from 'api/singer';
  import {mapMutations} from 'vuex';
  import {playListMixin} from 'common/js/mixin';

  export default {
    mixins: [playListMixin],
    data () {
      return {
        singers: []
      };
    },
    created () {
      this._getSingerList();
    },
    methods: {
      showInfo () {
        this.$emit('showInfo');
      },
      scrollRefresh (playList) {
        const bottom = playList.length > 0 ? '55px' : '';
        this.$refs.scroll.$el.style.bottom = bottom;
        this.$refs.scroll.refresh();
      },
      selectItem (singer) {
        this.$router.push({
          path: `/disc/singer/${singer.id}`
        });
        this.selectSheet(singer);
      },
      sortBgImg (index) {
        return `icon${index}`;
      },
      sortText (index) {
        let arr = [0, 1, 2];
        if (arr.indexOf(index) !== -1) {
          return '';
        } else {
          return index + 1;
        }
      },
      _getSingerList () {
        let offset = 0;
        let limit = 100;
        getSingerList(offset, limit).then((res) => {
          this.singers = res.artists;
        });
      },
      ...mapMutations({
        selectSheet: 'SELECT_SHEET'
      })
    },
    components: {
      Scroll,
      Loading
    }
  };
</script>

<style lang="stylus">
  @import "~common/stylus/mixin"
  @import "~common/stylus/variable"

  .singer-scroll
    position: absolute
    top: 46px
    left: 0
    right: 0
    bottom: 0
    overflow: hidden
    .loading
      position: absolute
      left: 50%
      top: 50%
      transform: translate(-50%, -50%)
    ul
      display: block
      padding-bottom: 5px
      .item
        position: relative
        display: block
        margin: 5px 0
        width: 100%
        height: 60px
        .num
          position: absolute
          left: 20px
          top: 50%
          transform: translate(0, -50%)
          display: block
          width: 30px
          height: 30px
          text-align: center
          line-height: 30px
          font-size: 18px
          color: $color-text-s
          font-weight: bold
          background-size: 100%
          &.icon0
            bg-image('first')
          &.icon1
            bg-image('second')
          &.icon2
            bg-image('third')
        .avatar
          position: absolute
          right: 10px
          top: 50%
          transform: translate(0, -50%)
          display: block
          width: 55px
          height: 55px
          border-radius: 50%
          overflow: hidden
          background: #eee
          img
            width: 100%
            height: 100%
        .name
          position: absolute
          left: 80px
          right: 85px
          top: 50%
          transform: translate(0, -50%)
          text-align: right
          i
            display: inline-block
            font-style: normal
</style>
