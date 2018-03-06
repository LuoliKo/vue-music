<template>
  <div>
    <search-list :data="sheets" :count="count" @loadMore="loadMore" ref="list">
      <ul class="sheet-ul">
        <li v-for="item in sheets" class="item" @click="selectItem(item)">
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
        </li>
        <loading v-show="moreLoading" class="more-loading">
          <span class="text">正在加载...</span>
        </loading>
      </ul>
    </search-list>
    <router-view @showInfo="showInfo"></router-view>
  </div>
</template>

<script>
  import SearchList from 'components/search-list/search-list';
  import {getSearchData} from 'api/search';
  import Loading from 'base/loading/loading';
  import {mapMutations} from 'vuex';

  export default {
    data () {
      return {
        count: 1,
        sheets: [],
        moreLoading: false
      };
    },
    props: {
      queryString: {
        type: String,
        default: ''
      }
    },
    created () {
      this._getSearchSheets();
    },
    methods: {
      showInfo () {
        this.$emit('showInfo');
      },
      selectItem (sheet) {
        this.$router.push({
          path: `/search/sheet/${sheet.id}`
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
      loadMore () {
        if (this.moreLoading) {
          console.log('正在加载数据，请稍候再加载新数据');
          return;
        }
        if (this.sheets.length >= this.count) {
          this.moreLoading = false;
          console.log('没有更多数据了');
        } else {
          this.moreLoading = true;
          getSearchData(this.queryString, 1000, this.sheets.length, 10).then((res) => {
            if (res.result.playlists) {
              this.sheets = this.sheets.concat(res.result.playlists);
            } else {
              this.count = this.sheets.length;
            }
          }).then(() => {
            this.moreLoading = false;
          });
        }
      },
      _getSearchSheets () {
        if (!this.queryString) {
          console.log('请输入关键字');
        } else {
          getSearchData(this.queryString, 1000).then((res) => {
            this.count = res.result.playlistCount;
            this.sheets = res.result.playlists;
          });
        }
      },
      ...mapMutations({
        selectSheet: 'SELECT_SHEET'
      })
    },
    watch: {
      queryString () {
        this.sheets = [];
        this._getSearchSheets();
      },
      moreLoading () {
        this.$nextTick(() => {
          this.$refs.list.refresh();
        });
      }
    },
    components: {
      SearchList,
      Loading
    }
  };
</script>

<style lang="stylus">
  @import "~common/stylus/variable"
  .sheet-ul
    display: block
    padding: 0 2px
    width 100%
    box-sizing: border-box
    .more-loading
      padding: 10px 0
      .text
        font-size: $font-size-medium
        color: $color-text
    .item
      display: flex
      padding: 0 3px
      width: 100%
      height: 60px
      box-sizing: border-box
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
          width: 100%
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
</style>
