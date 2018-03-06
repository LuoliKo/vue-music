<template>
  <transition name="slide">
    <div id="search" @touchstart="blur()">
      <div class="header">
        <i class="back iconfont icon-fanhui_zuo" @click="back"></i>
        <search-box ref="searchBox"
                    @queryContent="queryContent"
                    class="search-box"
                    placeholder="输入搜索的关键字">
        </search-box>
      </div>
      <scroll ref="scroll" class="wrapper" v-show="!isQuery" :data="hotKeys">
        <div>
          <h2 class="title">热门搜索</h2>
          <ul class="hot-keys">
            <li v-for="item in hotKeys" v-html="item.first" @click="selectQuery(item.first)"></li>
          </ul>
          <loading v-if="!hotKeys.length">
            <span>加载中...</span>
          </loading>
          <ul class="search-history">
            <li v-for="item in searchHistory" @click="selectQuery(item)">
              <i class="history iconfont icon-zuijinbofang"></i>
              <span class="key" v-html="item"></span>
              <i @click.stop="deleteSearchHistory(item)" class="close iconfont icon-guanbi"></i>
            </li>
          </ul>
        </div>
      </scroll>
      <search-result v-show="isQuery" :queryString="isQuery" @showInfo="showInfo"></search-result>
    </div>
  </transition>
</template>

<script>
  import SearchBox from 'base/search-box/search-box';
  import {getHotSearchKeys} from 'api/search';
  import SearchResult from 'components/search-result/search-result';
  import Loading from 'base/loading/loading';
  import Scroll from 'base/scroll/scroll';
  import {mapGetters, mapMutations} from 'vuex';
  import {deletegetSearchHistory, addSearchHistory} from 'common/js/storage';
  import {playListMixin} from 'common/js/mixin';

  export default {
    mixins: [playListMixin],
    data () {
      return {
        hotKeys: [],
        isQuery: ''
      };
    },
    computed: {
      ...mapGetters([
        'searchHistory'
      ])
    },
    created () {
      this._getHotSearchKeys();
    },
    methods: {
      scrollRefresh (playList) {
        const bottom = playList.length > 0 ? '55px' : '';
        this.$refs.scroll.$el.style.bottom = bottom;
        this.$refs.scroll.refresh();
      },
      deleteSearchHistory (key) {
        let _searchHistory = this.searchHistory.slice();
        let index = _searchHistory.indexOf(key);
        _searchHistory.splice(index, 1);
        this.setsearchHistory(_searchHistory);
        deletegetSearchHistory(key);
      },
      showInfo () {
        this.$emit('showInfo');
      },
      queryContent (queryContent) {
        if (queryContent) {
          let _searchHistory = this.searchHistory.slice();
          let index = _searchHistory.indexOf(queryContent.trim());
          if (index !== -1) {
            _searchHistory.splice(index, 1);
          }
          while (_searchHistory.length >= 5) {
            _searchHistory.pop();
          }
          _searchHistory.unshift(queryContent.trim());
          this.setsearchHistory(_searchHistory);
          addSearchHistory(queryContent.trim());
        }
        this.isQuery = queryContent.trim();
      },
      selectQuery (key) {
        this.$refs.searchBox.setQueryText(key);
        this.$router.replace('/search/song');
        this.$refs.searchBox.focus();
      },
      back () {
        this.$router.back();
      },
      blur () {
        this.$refs.searchBox.blur();
      },
      _getHotSearchKeys () {
        getHotSearchKeys().then((res) => {
          this.hotKeys = res.result.hots;
        });
      },
      ...mapMutations({
        setsearchHistory: 'SET_SEARCH_HISTORY'
      })
    },
    components: {
      SearchBox,
      SearchResult,
      Loading,
      Scroll
    }
  };
</script>

<style lang="stylus">
  @import "~common/stylus/variable"

  #search
    position: fixed
    top: 0
    left: 0
    right: 0
    bottom: 0
    z-index: 100
    background: $color-background
    & > .header
      position: relative
      display: block
      width: 100%
      height: 55px
      background: $color-theme
      .back
        position: absolute
        left: 5px
        top: 50%
        transform: translate(0, -50%)
        color: $color-background
        &.iconfont
          font-size: 28px
      .search-box
        position: absolute
        left: 45px
        top: 0
        right: 0
        bottom: 0
    .wrapper
      position: absolute
      top: 55px
      left: 0
      right: 0
      bottom: 0
      overflow: hidden
      .title
        margin-bottom: 10px
        padding-left: 10px
        padding-top: 15px
        font-size: $font-size-medium
        color: $color-text-s
      .hot-keys
        display: block
        width: 100%
        padding: 10px
        color: $color-text
        font-size: $font-size-medium
        box-sizing: border-box
        li
          display: inline-block
          margin-bottom: 10px
          margin-right: 5px
          padding: 5px 10px
          border: 1px solid $color-text-ss
          border-radius: 18px
      .search-history
        li
          display: flex
          width: 100%
          padding: 0 5px
          box-sizing: border-box
          height: 45px
          line-height: 45px
          .history
            flex: 0 0 45px
            text-align: center
            &.iconfont
              font-size: 20px
          .key
            flex-grow: 1
            padding-left: 5px
            overflow: hidden
            font-size: $font-size-medium
            border-bottom: 1px solid rgba(177, 177, 177, .2)
          .close
            flex: 0 0 45px
            text-align: center
            color: $color-text-ss
            border-bottom: 1px solid rgba(177, 177, 177, .2)
            .iconfont
              font-size: 20px

  .slide-enter-active, .slide-leave-active
    transition: all .3s

  .slide-enter, .slide-leave-to
    transform: translate(100%, 0)
</style>
