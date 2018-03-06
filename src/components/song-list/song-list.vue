<template>
  <div id="songList" ref="songList">
    <loading v-show="!songs.length" class="loading">
      <span>加载中...</span>
    </loading>
    <scroll ref="scroll" class="scroll"
            :data="songs"
            :probe-type="probeType"
            :listenScroll="listenScroll"
            @scroll="scroll">
      <ul ref="list">
        <li v-for="(item,index) in songs"
            class="item"
            :class="{'fee':isfee(index)}"
            @click="selectItem(index)">
          <div class="number" :class="[songSort(index),{'current-song':index===isCurrentSong}]">
            <span class="num">{{index + 1}}</span>
            <span class="sound iconfont icon-yinliang"></span>
          </div>
          <div class="right">
            <span class="name" v-html="item.name"></span>
            <p>
            <span class="singer" v-for="(ar,index) in item.ar||item.artists">
              <span v-if="index!==0">/</span>
              {{ar.name}}
            </span>
              <span class="other">-&nbsp;{{(item.al && item.al.name) || item.album.name}}</span>
            </p>
          </div>
          <div class="more" @click.stop="getMore(item)">
            <i class="iconfont icon-gengduo"></i>
          </div>
        </li>
      </ul>
    </scroll>
  </div>
</template>

<script>
  import Scroll from 'base/scroll/scroll';
  import Loading from 'base/loading/loading';
  import {mapActions, mapGetters} from 'vuex';
  import {playListMixin, moreMenuMixin} from 'common/js/mixin';
  import {findIndex} from 'common/js/util';

  export default {
    mixins: [playListMixin, moreMenuMixin],
    props: {
      songs: {
        type: Array,
        default: () => {
          return [];
        }
      },
      privileges: {
        type: Array,
        default: () => {
          return [];
        }
      }
    },
    computed: {
      isCurrentSong () {
        let index = findIndex(this.songs, this.currentSong);
        return index;
      },
      ...mapGetters([
        'currentSong'
      ])
    },
    created () {
      let url = location.href;
      this.isRank = url.indexOf('rank');
      this.probeType = 3;
      this.listenScroll = true;
    },
    methods: {
      getMore (song) {
        let isCollected = this.$route.path.match(/collection\/song/);
        if (!isCollected) {
          this.setMoreMenu(song);
        } else {
          this.setMoreMenu(song, 'song', true);
        }
      },
      isfee (index) {
        let isfee = (this.privileges.length && !this.privileges[index].cp) ||
          (this.songs[index].privilege && !this.songs[index].privilege.cp);
        if (isfee) {
          return true;
        } else {
          return false;
        }
      },
      scrollRefresh (playList) {
        const bottom = playList.length > 0 ? '55px' : '';
        this.$refs.scroll.$el.style.bottom = bottom;
        this.$refs.scroll.refresh();
      },
      selectItem (index) {
        if ((this.privileges.length && !this.privileges[index].cp) ||
          (this.songs[index].privilege && !this.songs[index].privilege.cp)) {
          return;
        }
        let _songs = this._filteSongs();
        let _index = findIndex(_songs, this.songs[index]);
        this.selectSong({
          list: _songs,
          index: _index
        });
      },
      songSort (index) {
        if (this.isRank !== -1) {
          return `icon${index}`;
        } else {
          return '';
        }
      },
      scroll (pos) {
        let scrollY = 0;
        this.offsetTop = Number(this.$refs.songList.style.top.split('px')[0]);
        if (this.offsetTop + pos.y <= 55) {
          scrollY = 55 - this.offsetTop;
        } else {
          scrollY = pos.y;
        }
        this.$emit('scrollList', scrollY);
      },
      _filteSongs () {
        if (!this.songs.length) {
          return;
        }
        let newSongs = [];
        let index = 0;
        if (this.privileges.length) {
          for (let i = 0; i < this.privileges.length; i++) {
            if (this.privileges[i].cp && this.songs[i]) {
              newSongs[index] = this.songs[i];
              index++;
            }
          }
        } else {
          for (let i = 0; i < this.songs.length; i++) {
            if (this.songs[i].privilege.cp) {
              newSongs[index] = this.songs[i];
              index++;
            }
          }
        }
        return newSongs;
      },
      ...mapActions([
        'selectSong'
      ])
    },
    components: {
      Scroll,
      Loading
    }
  };
</script>

<style lang="stylus">
  @import "~common/stylus/variable.styl"
  @import "~common/stylus/mixin"

  #songList
    .loading
      position: absolute
      top: 50%
      left: 50%
      z-index: 3
      transform: translate(-50%, -50%)
      span
        font-size: $font-size-medium
        color: $color-text-s
    .scroll
      position: absolute
      top: 0
      left: 0
      right: 0
      bottom: 0
      z-index: 3
      ul
        background: #fff
        .item
          position: relative
          display: flex
          width: 100%;
          height: 55px
          background: #fff
          &.fee
            & *
              color: #bbb !important
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
              font-size: $font-size-large-x
          .number
            position: relative
            flex: 0 0 55px
            height: 55px
            color: $color-text-s
            background-size: 55%
            background-repeat: no-repeat
            background-position center
            &.current-song
              background-size: 0
              .num
                display: none !important
              .sound
                display: block !important
            .sound
              position: absolute
              top: 50%
              left: 50%
              transform: translate(-50%, -50%)
              display: none
              color: $color-theme
            &.icon0
              bg-image('first')
              span
                display: none
            &.icon1
              bg-image('second')
              span
                display: none
            &.icon2
              bg-image('third')
              span
                display: none
            span
              position: absolute
              top: 50%
              left: 50%
              transform: translate(-50%, -50%)
              font-size: $font-size-large
              font-weight: bold
          .right
            flex-grow: 1
            overflow: hidden
            padding-top: 10px
            border-bottom: 1px solid rgba(177, 177, 177, .3)
            p
              width: 87%
              white-space nowrap
              overflow: hidden
              text-overflow: ellipsis
            span
              &.name
                display: block
                width: 80%
                margin-bottom: 7px
                overflow: hidden
                white-space: nowrap
                text-overflow: ellipsis
                font-size: $font-size-medium-x
                color: $color-text
              &.singer, &.other
                font-size: $font-size-small
                color: $color-text-s

</style>
