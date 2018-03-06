<template>
  <div>
    <scroll ref="scroll"
            class="sheet"
            :data="playlist"
            :pullup="pullup"
            @scrollToEnd="getMore">
      <ul>
        <li class="item" @click.stop="selectItem(item)" v-for="item in playlist">
          <div class="cover">
            <img v-lazy="item.coverImgUrl">
          </div>
          <div class="right">
            <h1 class="name" v-html="item.name"></h1>
            <p>
              <span class="small creator"><i class="iconfont icon-icon-10"></i>{{item.creator.nickname}}</span>
              <span class="small playcount"><i class="iconfont icon-erji"></i>{{item.playCount}}</span>
            </p>
            <p>
              <span class="desc"><i class="tag">{{item.tags[0]}}</i>{{item.description}}</span>
            </p>
          </div>
        </li>
        <loading v-show="playlist.length" class="load-more">
          <span class="text">加载中...</span>
        </loading>
        <span v-show="!more">再也没有了...</span>
      </ul>
      <loading v-show="!playlist.length" class="loading">
        <span class="text">加载中...</span>
      </loading>
    </scroll>
    <router-view @showInfo="showInfo"></router-view>
  </div>
</template>

<script>
  import Scroll from 'base/scroll/scroll';
  import {getSheet} from 'api/disc';
  import Loading from 'base/loading/loading';
  import {mapMutations} from 'vuex';
  import {playListMixin} from 'common/js/mixin';

  export default {
    mixins: [playListMixin],
    data () {
      return {
        playlist: [],
        pullup: true,
        isLoading: false,
        more: true
      };
    },
    created () {
      this._getSheet(20, 0, 'hot');
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
      selectItem (sheet) {
        this.$router.push({
          path: `/disc/sheet/${sheet.id}`
        });
        this.selectSheet(sheet);
      },
      getMore () {
        if (this.isLoading) {
          console.log('当前数据还没有在家完成，请稍候再加载新数据.');
          return;
        }
        this.isLoading = true;

        console.log('上拉加载更多...');
        let offset = this.playlist.length;
        getSheet(10, offset, 'hot').then((res) => {
          this.isLoading = false;
          this.playlist = this.playlist.concat(res.playlists);
          if (!res.more) {
            this.more = false;
          }
        });
      },
      _getSheet (limit, offset, order) {
        getSheet(limit, offset, order).then((res) => {
          this.playlist = res.playlists;
          if (!res.more) {
            this.more = false;
          }
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
  @import "~common/stylus/variable.styl"

  .sheet
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
      .load-more
        padding: 10px 0
      .item
        display: flex
        margin-top: 2px
        width: 100%
        height: 100px
        border-bottom: 1px solid rgba(177, 177, 177, .2)
        .cover
          flex: 0 0 100px
          height: 100px
          vertical-align: top
          img
            width: 100%
            height: 100%
        .right
          flex-grow: 1
          overflow: hidden
          padding: 10px
          p
            width: 90%
            margin-bottom: 10px
          .name
            display: block
            padding-top: 10px
            padding-bottom: 5px
            white-space: nowrap
            text-overflow: ellipsis
            overflow: hidden
            color: $color-text
            font-size: $font-size-medium-x
          .small
            padding-right: 20px
            color: $color-text-s
            font-size: $font-size-small-s
            .iconfont
              font-size: $font-size-small-s
              padding-right: 5px
          .desc
            display: block
            width: 100%
            white-space: nowrap
            text-overflow: ellipsis
            overflow: hidden
            color: $color-text-s
            font-size: $font-size-small
            .tag
              display: inline-block
              padding: 0 5px
              margin-right: 5px
              border: 1px solid $color-theme
              font-style: normal
              font-size: 8px !important
              color: $color-theme
</style>
