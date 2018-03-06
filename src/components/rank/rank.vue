<template>
  <div id="rank">
    <scroll class="rank-scroll" :data="toplist" ref="scroll">
      <ul>
        <li class="item" v-for="(item,index) in toplist" @click="selectItem(item)">
          <div class="cover">
            <img v-lazy="item.coverImgUrl">
          </div>
          <div class="right">
            <h1 class="name" v-html="item.name"></h1>
            <span class="update">{{item.updateFrequency}}</span>
            <p class="tags">
              <span v-for="tag in item.tags">{{tag}}</span>
            </p>
          </div>
        </li>
      </ul>
      <loading class="loading" v-show="!toplist.length">
        <span>加载中...</span>
      </loading>
    </scroll>
    <router-view @showInfo="showInfo"></router-view>
  </div>
</template>

<script>
  import Scroll from 'base/scroll/scroll';
  import Loading from 'base/loading/loading';
  import {getTopList} from 'api/rank';
  import {mapMutations} from 'vuex';
  import {playListMixin} from 'common/js/mixin';

  export default {
    mixins: [playListMixin],
    data () {
      return {
        toplist: []
      };
    },
    created () {
      this._getTopList();
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
      selectItem (item) {
        this.$router.push({
          path: `/disc/rank/${item.id}`
        });
        this.selectSheet(item);
      },
      _getTopList () {
        getTopList().then((res) => {
          this.toplist = res.list;
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
  @import "~common/stylus/variable"

  .rank-scroll
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
          .name
            display: block
            padding-top: 10px
            padding-bottom: 10px
            white-space: nowrap
            text-overflow: ellipsis
            overflow: hidden
            color: $color-text
            font-size: $font-size-large
          .update
            display: block
            margin-bottom: 10px
            color: $color-text-s
            font-size: $font-size-small-s
          .tags
            span
              display: inline-block
              padding-right: 5px
              font-size: $font-size-small
              color: $color-text-s
</style>
