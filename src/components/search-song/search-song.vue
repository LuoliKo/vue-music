<template>
  <search-list :data="songs" :count="count" @loadMore="loadMore" ref="list">
    <ul class="song-ul">
      <li v-for="item in songs" class="item" @click="addSong(item)">
        <h2 class="name" v-html="item.name"></h2>
        <p class="artist-album">
          <span v-for="(artist,index) in item.artists" class="artist">
            <span v-if="index!==0">/</span>
            {{artist.name}}
          </span>
          <span v-if="item.album.name">-</span>
          <span class="album" v-html="item.album.name"></span>
        </p>
        <div class="more" @click.stop="getMore(item)">
          <i class="iconfont icon-gengduo"></i>
        </div>
      </li>
      <loading v-show="moreLoading" class="more-loading">
        <span class="text">正在加载...</span>
      </loading>
    </ul>
    <router-view></router-view>
  </search-list>
</template>

<script>
  import SearchList from 'components/search-list/search-list';
  import {getSearchData} from 'api/search';
  import Loading from 'base/loading/loading';
  import {mapActions} from 'vuex';
  import {getSongUrl} from 'api/song';
  import {moreMenuMixin} from 'common/js/mixin';

  export default {
    mixins: [moreMenuMixin],
    data () {
      return {
        songs: [],
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
      this._getSearchSongs();
    },
    methods: {
      getMore (song) {
        this.setMoreMenu(song);
      },
      addSong (song) {
        getSongUrl(song.id).then((res) => {
          if (!res.data[0].url) {
            this.$layer.toast({
              content: '由于版权等问题，此歌曲不能播放!'
            });
          } else {
            this.insertSong({song: song});
          }
        });
      },
      loadMore () {
        if (this.moreLoading) {
          console.log('正在加载数据，请稍候再加载新数据');
          return;
        }
        if (this.songs.length >= this.count) {
          this.moreLoading = false;
          console.log('没有更多数据了');
        } else {
          this.moreLoading = true;
          getSearchData(this.queryString, 1, this.songs.length, 10).then((res) => {
            if (res.result.songs) {
              this.songs = this.songs.concat(res.result.songs);
            } else {
              this.count = this.songs.length;
            }
          }).then(() => {
            this.moreLoading = false;
          });
        }
      },
      _getSearchSongs () {
        if (!this.queryString) {
          console.log('请输入关键字');
        } else {
          getSearchData(this.queryString, 1).then((res) => {
            this.count = res.result.songCount;
            this.songs = res.result.songs;
          });
        }
      },
      ...mapActions([
        'insertSong'
      ])
    },
    watch: {
      queryString () {
        this.songs = [];
        this._getSearchSongs();
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

  .song-ul
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
</style>
