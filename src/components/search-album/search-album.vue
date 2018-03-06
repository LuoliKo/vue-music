<template>
  <search-list :data="albums" :count="count" @loadMore="loadMore" ref="list">
    <ul class="singer-ul">
      <li v-for="item in albums" class="item">
        <div class="avatar">
          <img v-lazy="item.picUrl">
        </div>
        <div class="right">
          <h2 class="name" v-html="item.name"></h2>
        </div>
      </li>
      <loading v-show="moreLoading" class="more-loading">
        <span class="text">正在加载...</span>
      </loading>
    </ul>
  </search-list>
</template>

<script>
  import SearchList from 'components/search-list/search-list';
  import {getSearchData} from 'api/search';
  import Loading from 'base/loading/loading';

  export default {
    data () {
      return {
        albums: [],
        moreLoading: false,
        count: 1
      };
    },
    props: {
      queryString: {
        type: String,
        default: ''
      }
    },
    created () {
      this._getSearchAlbums();
    },
    methods: {
      loadMore () {
        if (this.moreLoading) {
          console.log('正在加载数据，请稍候再加载新数据');
          return;
        }
        if (this.albums.length >= this.count) {
          this.moreLoading = false;
          console.log('没有更多数据了');
        } else {
          this.moreLoading = true;
          getSearchData(this.queryString, 10, this.albums.length, 10).then((res) => {
            if (res.result.albums) {
              this.albums = this.albums.concat(res.result.albums);
            } else {
              this.count = this.albums.length;
            }
          }).then(() => {
            this.moreLoading = false;
          });
        }
      },
      _getSearchAlbums () {
        if (!this.queryString) {
          console.log('请输入关键字');
        } else {
          getSearchData(this.queryString, 10).then((res) => {
            this.count = res.result.albumCount;
            this.albums = res.result.albums;
          });
        }
      }
    },
    watch: {
      queryString () {
        this.albums = [];
        this._getSearchAlbums();
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
  .singer-ul
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
        position: relative
        flex-grow: 1
        margin-left: 5px
        padding: 10px 0
        box-sizing: border-box
        overflow: hidden
        border-bottom: 1px solid rgba(177, 177, 177, .2)
        .name
          position: absolute
          left: 5px
          top: 50%
          transform: translate(0, -50%)
          width: 100%
          white-space: nowrap
          text-overflow ellipsis
          overflow: hidden
          font-size: $font-size-medium-x
          color: $color-text
</style>
