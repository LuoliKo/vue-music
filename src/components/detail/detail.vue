<template>
  <transition name="slide">
    <div id="detail">
      <div class="header">
        <i class="iconfont back icon-fanhui_zuo" @click="back"></i>
        <v-marquee class="wrapper">
          <span class="name">{{sheet.name}}</span>
        </v-marquee>
        <i @click="getMore" class="iconfont more icon-gengduo" ref="more"></i>
      </div>
      <div :class="coverClass?'cover-1':'cover-2'" :style="bgImg" ref="cover" @click="clickCover"></div>
      <div class="control-wrapper show" ref="control" v-show="songs.length">
        <i class="iconfont icon-icon-4" @click="playAll">
          <span>播放全部</span>
        </i>
        <i class="iconfont icon-shoucang" @click="collect" v-if="sheet.playCount">
          <span>收藏</span>
        </i>
        <i class="iconfont icon-changpian" @click="getSingerDiscs" v-if="sheet.img1v1Url">
          <span>专辑</span>
        </i>
        <i class="iconfont icon-fenxiang" @click="share">
          <span>分享</span>
        </i>
      </div>
      <song-list class="song-list" :songs="songs"
                 :privileges="privileges"
                 @scrollList="scrollList"
                 ref="songList"></song-list>
      <router-view></router-view>
    </div>
  </transition>
</template>

<script>
  import {mapGetters, mapActions, mapMutations} from 'vuex';
  import SongList from 'components/song-list/song-list';
  import {getSheetDetail} from 'api/sheetDetail';
  import {getSingerSongs} from 'api/singer';
  import {prefixStyle} from 'common/js/dom';
  import Marquee from 'base/marquee/marquee';
  import {collectSheet} from 'common/js/storage';
  import {findIndex} from 'common/js/util';

  const transform = prefixStyle('transform');

  export default {
    data () {
      return {
        songs: [],
        privileges: [],
        coverClass: false
      };
    },
    computed: {
      bgImg () {
        if (!this.isSingerPage) {
          return `background-image:url(${this.sheet['coverImgUrl']})`;
        } else {
          return `background-image:url(${this.sheet['img1v1Url']})`;
        }
      },
      ...mapGetters([
        'sheet',
        'sequenceList',
        'collectSheets'
      ])
    },
    created () {
      this.isSingerPage = location.href.indexOf('singer') !== -1;
      if (!this.sheet.id) {
        this.back();
        return;
      }
      this._getSheetDetail();
    },
    mounted () {
      this._initSongList();
      this._initControlWrapper();
    },
    methods: {
      share () {
        this.$layer.toast({
          content: '请手动复制地址，并发送您要分享的平台！so easy！'
        });
      },
      getMore () {
        if (this.sheet.playCount) {
          this.$layer.footer({btn: ['取消', '播放全部', '收藏', '分享']}).then((res) => {
            switch (res) {
              case 0:
                break;
              case 1:
                this.playAll();
                break;
              case 2:
                this.collect();
                break;
              case 3:
                this.share();
                break;
            }
          });
        } else if (this.sheet.img1v1Url) {
          this.$layer.footer({btn: ['取消', '播放全部', '专辑', '分享']}).then((res) => {
            switch (res) {
              case 0:
                break;
              case 1:
                this.playAll();
                break;
              case 2:
                this.$layer.toast({
                  content: '作者很懒！此功能没有添加！'
                });
                break;
              case 3:
                break;
            }
          });
        } else {
          this.$layer.toast({
            content: 'APP神经病了！'
          });
        }
      },
      collect () {
        let _collectSheets = this.collectSheets.slice();
        let index = findIndex(_collectSheets, this.sheet);
        if (index !== -1) {
          this.$layer.toast({
            content: '收藏歌单已存在'
          });
        } else {
          _collectSheets.unshift(this.sheet);
          this.setCollectSheets(_collectSheets);
          collectSheet(this.sheet);
          this.$layer.toast({
            content: '收藏成功'
          });
        }
      },
      playAll () {
        let _songs = this._filteSongs();
        if (JSON.stringify(_songs) === JSON.stringify(this.sequenceList)) {
          return;
        }
        this.selectSong({
          list: _songs,
          index: 0
        });
      },
      scrollList (scrollY) {
        if (scrollY === 55 - this.top) {
          this.coverClass = true;
        } else {
          this.coverClass = false;
        }
        this.$refs.control.style.top = `${this.top - 60 + scrollY}px`;
        if (this.top + scrollY <= 55 + 60) {
          this.$refs.control.style.display = 'none';
          this.$refs.more.style.display = 'block';
        } else {
          if (!this.songs.length) {
            return;
          }
          this.$refs.control.style.display = 'flex';
          this.$refs.more.style.display = 'none';
        }
        if (scrollY > 0) {
          let percent = scrollY / this.top;
          let scale = 1 + percent;
          this.$refs.cover.style[transform] = `scale(${scale})`;
        }
      },
      back () {
        this.$router.back();
      },
      clickCover () {
        this.$emit('showInfo');
      },
      getSingerDiscs () {
        this.$layer.toast({
          content: '作者很懒，该功能未添加！'
        });
      },
      _getSheetDetail () {
        let id = this.sheet.id;
        if (this.isSingerPage) {
          getSingerSongs(id).then((res) => {
            this.songs = res.hotSongs;
          });
        } else {
          getSheetDetail(id).then((res) => {
            this.songs = res.playlist.tracks;
            this.privileges = res.privileges;
          });
        }
      },
      _initSongList () {
        this.top = this.$refs.cover.offsetHeight;
        this.$refs.songList.$el.style.top = this.top + 'px';
      },
      _initControlWrapper () {
        this.$refs.control.style.top = this.top - 60 + 'px';
        this.$refs.more.style.display = 'none';
      },
      _filteSongs () {
        if (!this.songs.length) {
          return;
        }
        let newSongs = [];
        let index = 0;
        if (this.privileges.length) {
          for (let i = 0; i < this.privileges.length; i++) {
            if (this.privileges[i].cp) {
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
      ]),
      ...mapMutations({
        setCollectSheets: 'SET_COLLECT_SHEETS'
      })
    },
    components: {
      SongList,
      'v-marquee': Marquee
    }
  };
</script>

<style lang="stylus">
  @import "~common/stylus/variable.styl"

  #detail
    position: fixed
    top: 0
    left: 0
    right: 0
    bottom: 0
    z-index: 100
    background: #fff
    .header
      position: absolute
      z-index: 10
      display: block
      width: 100%
      height: 55px
      color: #fff
      background: rgba(221, 20, 24, 0)
      .iconfont
        position: absolute
        top: 50%
        transform: translate(0, -50%)
        font-size: 28px
        &.back
          left: 10px
        &.more
          right: 10px
      .wrapper
        position: absolute
        left: 50%
        top: 50%
        transform: translate(-50%, -50%)
        width: 50%
        .name
          display: inline-block
          white-space: nowrap
    .cover-1
      position: absolute
      top: 0
      left: 0
      z-index: 8
      width: 100%
      height: 55px
      padding-top: 0
      background-size cover
      transform-origin: top
      &::after
        content: ' '
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 55px
        padding-top: 0
        background: rgba(0, 0, 0, .5)
    .cover-2
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 0
      padding-top: 70%
      background-size cover
      transform-origin: top
      &::after
        content: ' '
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 0
        padding-top: 70%
        background: rgba(0, 0, 0, .5)
    .control-wrapper
      position: absolute
      z-index: 10
      display: flex
      width: 100%
      height: 0px
      .iconfont
        flex: 1
        text-align: center
        font-size: 30px
        color: #fff
        span
          display: block
          margin-top: 5px
          font-size: $font-size-medium
    .song-list
      position: absolute
      left: 0
      right: 0
      bottom: 0
      top: 0

  .slide-enter-active, .slide-leave-active
    transition: all .3s

  .slide-enter, .slide-leave-to
    transform: translate(100%, 0)

  .hide
    animation: hide .3s linear forwards

  .show
    animation: show .3s linear forwards

  @keyframes hide
    0%
      transform: scale(1.0)
    100%
      transform: scale(0)

  @keyframes show
    0%
      transform: scale(0)
    100%
      transform: scale(1.0)
</style>
