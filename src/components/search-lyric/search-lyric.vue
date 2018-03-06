<template>
  <search-list :data="lyrics" :count="count" @loadMore="loadMore" ref="list">
    <ul class="lyric-ul">
      <li v-for="item in lyrics" class="item">
        <h2 class="name" v-html="item.name"></h2>
        <p class="artist-album">
          <span v-for="(artist,index) in item.artists" class="artist">
            <span v-if="index!==0">/</span>
            {{artist.name}}
          </span>
          <span v-if="item.album.name">-</span>
          <span class="album" v-html="item.album.name"></span>
        </p>
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
        lyrics: [],
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
      this._getSearchLyrics();
    },
    methods: {
      loadMore () {
        if (this.moreLoading) {
          console.log('正在加载数据，请稍候再加载新数据');
          return;
        }
        if (this.lyrics.length >= this.count) {
          this.moreLoading = false;
          console.log('没有更多数据了');
        } else {
          this.moreLoading = true;
          getSearchData(this.queryString, 1006, this.lyrics.length, 10).then((res) => {
            if (res.result.songs) {
              this.lyrics = this.lyrics.concat(res.result.songs);
            } else {
              this.count = this.lyrics.length;
            }
          }).then(() => {
            this.moreLoading = false;
          });
        }
      },
      _getSearchLyrics () {
        if (!this.queryString) {
          console.log('请输入关键字');
        } else {
          getSearchData(this.queryString, 1006).then((res) => {
            this.count = res.result.songCount;
            this.lyrics = res.result.songs;
          });
        }
      }
    },
    watch: {
      queryString () {
        this.lyrics = [];
        this._getSearchLyrics();
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

  .lyric-ul
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
      position: relative
      display: block
      padding: 10px 5px
      width: 100%
      height: 55px
      box-sizing: border-box
      border-bottom: 1px solid rgba(177, 177, 177, .2)
      .name
        width: 90%
        margin-bottom: 6px
        white-space: nowrap
        overflow: hidden
        text-overflow: ellipsis
        font-size: $font-size-medium
        color: $color-text
      .artist-album
        width: 90%
        white-space: nowrap
        overflow: hidden
        text-overflow: ellipsis
        font-size: $font-size-small
        color: $color-text-s
      .more
        position: absolute
        right: 10px
        top: 50%
        transform: translate(0, -50%)
        color: $color-text-s
        &.iconfont
          font-size: $font-size-large
</style>
