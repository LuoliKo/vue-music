<template>
  <div class="player" v-if="playList.length">
    <transition name="larger-fade">
      <div class="larger" v-show="isFullScreen">
        <div class="bg">
          <img width="100%" height="100%"
               v-lazy="(currentSong.al&&currentSong.al.picUrl)||(currentSong.album&&currentSong.album.artist.img1v1Url)">
        </div>
        <div class="header">
          <i class="iconfont back-btn icon-fanhui_zuo" @click.stop="setFullScreen"></i>
          <i class="iconfont share-btn icon-fenxiang"></i>
          <div class="name-artist">
            <v-marquee class="marquee" ref="titleMarquee">
              <span class="title">{{currentSong.name}}</span>
            </v-marquee>
            <v-marquee ref="artistMarquee">
              <p class="artist">
            <span v-for="(ar,index) in (currentSong.ar||currentSong.artists)">
              <span v-if="index!==0">/</span>
              {{ar.name}}
            </span>
              </p>
            </v-marquee>
          </div>
        </div>
        <div class="middle" @click="togglePage">
          <transition name="fade">
            <div v-show="currentPage">
              <div class="middle-adapter">
                <div class="cd">
                  <div class="pic" :class="isPlay?'play':'play pause'">
                    <img
                      v-lazy="(currentSong.al&&currentSong.al.picUrl)||(currentSong.album&&currentSong.album.artist.img1v1Url)"/>
                  </div>
                </div>
              </div>
              <div class="mini-lyric" v-html="playingLyric"></div>
            </div>
          </transition>
          <transition name="fade">
            <scroll v-show="!currentPage"
                    class="lyric-scroll"
                    :data="currentLyric && currentLyric.lines"
                    ref="lyricScroll">
              <div>
                <div v-if="currentLyric">
                  <p v-for="(item,index) in currentLyric.lines"
                     v-html="item.txt"
                     :class="{'playlingLyric': playingLine===index}"
                     ref="lyricLine"></p>
                </div>
              </div>
              <span class="nolyric" v-show="!currentLyric">没有歌词</span>
            </scroll>
          </transition>
        </div>
        <div class="bottom">
          <progress-bar :percent="percent"
                        :currentTime="nowTime"
                        :durationTime="currentSong.dt||currentSong.duration"
                        :loading="loading"
                        @percentChange="percentChange"></progress-bar>
          <div class="control-bar" :class="songReady?'enable':'disable'">
            <span>
              <i class="iconfont smaller text-right" :class="iconMode" @click="changeMode"></i>
            </span>
            <span>
              <i class="click-enable iconfont icon-icon-6 text-right" @click="pre"></i>
            </span>
            <span>
              <i class="click-enable iconfont text-center"
                 :class="isPlay?'icon-icon-7':'icon-icon-4'"
                 @click.stop="togglePlay"></i>
            </span>
            <span>
              <i class="click-enable iconfont icon-icon-5 text-left" @click="next"></i>
            </span>
            <span @click="toggleLike">
              <i class="iconfont smaller text-left" :class="isLike?'icon-xihuantianse':'icon-xihuan'"></i>
            </span>
          </div>
        </div>
      </div>
    </transition>
    <div class="mini" @click="setFullScreen">
      <div class="avatar">
        <img v-lazy="(currentSong.al&&currentSong.al.picUrl)||(currentSong.album&&currentSong.album.artist.img1v1Url)">
      </div>
      <div class="text">
        <span class="song-name" v-html="currentSong.name"></span>
        <p class="artist">
          <span v-for="(ar,index) in (currentSong.ar||currentSong.artists)">
            <span v-if="index!==0">/</span>
            {{ar.name}}
          </span>
        </p>
      </div>
      <progress-circle class="progress" :radius="37" :percent="percent">
        <span class="iconfont play-btn" @click.stop="togglePlay"
              :class="isPlay?'icon-bofangzanting':'icon-bofang'"></span>
      </progress-circle>
      <div class="play-list" @click.stop="openMenu">
        <span class="iconfont icon-liebiao"></span>
      </div>
    </div>
    <songs-menu ref="playerMenu"></songs-menu>
    <audio :src="songUrl" ref="audio"
           @play="onPlayStart"
           @canplay="onCanPlay"
           @waiting="onWaiting"
           @playing="onPlaying"
           @ended="songEnd"
           @timeupdate="currentTime"
           @error="error"></audio>
  </div>
</template>

<script>
  import {mapGetters, mapMutations, mapActions} from 'vuex';
  import {getSongUrl, getSongLyric} from 'api/song';
  import progressCircle from 'components/progress-circle/progress-circle';
  import progressBar from 'base/progress-bar/progress-bar';
  import Marquee from 'base/marquee/marquee';
  import {playerMixin} from 'common/js/mixin';
  import {playMode} from 'common/js/config';
  import Lyric from 'lyric-parser';
  import Scroll from 'base/scroll/scroll';
  import SongsMenu from 'components/songs-menu/songs-menu';
  import {likeSong, deleteLikeSong, addPlayHistory} from 'common/js/storage';
  import {findIndex, cloneObj} from 'common/js/util';

  export default {
    mixins: [playerMixin],
    data () {
      return {
        songUrl: null,
        songReady: false,
        nowTime: 0,
        percent: 0,
        loading: false,
        currentLyric: null,
        lyricReady: false,
        playingLine: 0,
        currentPage: true,
        isLike: false
      };
    },
    computed: {
      playingLyric () {
        if (this.isFullScreen && this.currentLyric && this.currentPage) {
          if (this.currentLyric.lines.length === 0) {
            return '没有歌词';
          }
          let currentLrc = this.currentLyric.lines[this.playingLine].txt;
          let nextLrc = this.playingLine === this.currentLyric.lines.length - 1 ? '' : this.currentLyric.lines[this.playingLine + 1].txt;
          return this.playingLine % 2 ? `<span>${nextLrc}</span><span class="current">${currentLrc}</span>` : `<span class="current">${currentLrc}</span><span>${nextLrc}</span>`;
        } else {
          return '没有歌词';
        }
      },
      ...mapGetters([
        'isFullScreen',
        'currentSong',
        'currentIndex',
        'isPlay',
        'playList',
        'playMode',
        'likeSongs',
        'playHistory'
      ])
    },
    methods: {
      toggleLike () {
        let _likeSongs = this.likeSongs.slice();
        if (this.isLike) {
          _likeSongs.splice(this.likeSongIndex, 1);
          this.setLikeSongs(_likeSongs);
          deleteLikeSong(this.currentSong);
          this.isLike = false;
        } else {
          let _currentSong = this.currentSong;
          _currentSong.privilege = {cp: 1};
          _likeSongs.unshift(_currentSong);
          this.setLikeSongs(_likeSongs);
          this.isLike = true;
          likeSong(_currentSong);
        }
      },
      openMenu () {
        this.$refs.playerMenu.open();
      },
      onPlayStart () {
        this.songReady = true;
      },
      onCanPlay () {
        let _audio = this.$refs.audio;
        if (!_audio) {
          return;
        }
        _audio.play();
      },
      pre () {
        if (!this.songReady) {
          return;
        }
        let index = 0;
        if (this.currentIndex === 0) {
          index = this.playList.length - 1;
        } else {
          index = this.currentIndex - 1;
        }
        this.selectInPlayList(index);
      },
      next () {
        if (!this.songReady) {
          return;
        }
        let index = 0;
        if (this.currentIndex === this.playList.length - 1) {
          index = 0;
        } else {
          index = this.currentIndex + 1;
        }
        this.selectInPlayList(index);
      },
      error () {
        this.next();
      },
      onWaiting () {
        this.loading = true;
      },
      onPlaying () {
        this.loading = false;
      },
      percentChange (percent) {
        const currentTime = (this.currentSong.dt || this.currentSong.duration) * percent / 1000;
        this.$refs.audio.currentTime = currentTime;
        this._lyricSeek();
      },
      currentTime (e) {
        if (this.songReady) {
          this.nowTime = e.target.currentTime;
          this.percent = e.target.currentTime * 1000 / (this.currentSong.dt || this.currentSong.duration);
        } else {
          this.nowTime = 0;
          this.percent = 0;
        }
      },
      songEnd () {
        if (this.playList.length === 1) {
          this._loop();
        } else {
          if (this.playMode === playMode.loop) {
            this._loop();
          } else {
            this.next();
          }
        }
      },
      setFullScreen () {
        this.setScreenState(!this.isFullScreen);
      },
      togglePlay () {
        if (!this.songReady) {
          return;
        }
        this.setPlayState(!this.isPlay);
      },
      togglePage () {
        this.currentPage = !this.currentPage;
        if (!this.currentPage) {
          this.$nextTick(() => {
            this._lyricScrollRefresh();
          });
        }
      },
      _loop () {
        this.$refs.audio.currentTime = 0;
        this.$refs.audio.play();
        this.setPlayingState(true);
      },
      _getLyric (id) {
        getSongLyric(id).then((res) => {
          if (!res.nolyric) {
            if (res.uncollected) {
              this.currentLyric = null;
              return;
            }
            this.currentLyric = new Lyric(res.lrc.lyric, this._lyricRun);
          } else {
            this.currentLyric = null;
          }
        }).then(() => {
          this.lyricReady = true;
        });
      },
      _lyricRun ({lineNum}) {
        this.playingLine = lineNum;
        let _lyricScroll = this.$refs.lyricScroll;
        if (lineNum > 6) {
          let lineEl = this.$refs.lyricLine[lineNum - 6];
          _lyricScroll && _lyricScroll.scrollToElement(lineEl, 1000);
        } else {
          _lyricScroll && _lyricScroll.scrollTo(0, 0, 1000);
        }
      },
      _playOrPause () {
        if (this.currentLyric && this.lyricReady) {
          if (this.songReady && this.isPlay && !this.loading) {
            this.currentLyric.seek(this.nowTime * 1000);
          } else {
            this.currentLyric.seek(this.nowTime * 1000);
            this.currentLyric.togglePlay();
          }
        }
      },
      _lyricSeek () {
        if (this.currentLyric && this.lyricReady) {
          this.currentLyric.seek(this.nowTime * 1000);
          if (!(this.songReady && this.isPlay && !this.loading)) {
            this.currentLyric.togglePlay();
          }
        }
      },
      _lyricScrollRefresh () {
        let _lyricScroll = this.$refs.lyricScroll;
        if (!_lyricScroll) {
          return;
        }
        _lyricScroll && _lyricScroll.refresh();
        if (this.playingLine > 6) {
          let lineEl = this.$refs.lyricLine[this.playingLine - 6];
          _lyricScroll.scrollToElement(lineEl, 1000);
        } else {
          _lyricScroll.scrollTo(0, 0, 1000);
        }
      },
      _checkLike () {
        this.likeSongIndex = findIndex(this.likeSongs, this.currentSong);
        if (this.likeSongIndex !== -1) {
          this.isLike = true;
        } else {
          this.isLike = false;
        }
      },
      _setPlayHistory (song) {
        let _song = cloneObj(song);
        let _playHistory = this.playHistory.slice();
        let index = findIndex(_playHistory, _song);
        if (index !== -1) {
          _playHistory.splice(index, 1);
        }
        while (_playHistory.length >= 50) {
          _playHistory.pop();
        }
        _song.privilege = {cp: 1};
        _playHistory.unshift(_song);
        this.setPlayHistory(_playHistory);
        addPlayHistory(_song);
      },
      ...mapMutations({
        setPlayState: 'SET_PLAYING_STATE',
        setScreenState: 'SET_SCREEN_STATE',
        setLikeSongs: 'SET_LIKE_SONGS',
        setPlayHistory: 'SET_PLAY_HISTORY'
      }),
      ...mapActions([
        'selectInPlayList'
      ])
    },
    watch: {
      currentSong (newVal, oldVal) {
        if (!newVal.id) {
          return;
        }
        if (newVal.id === oldVal.id) {
          return;
        }
        this.songReady = false;
        this.lyricReady = false;
        getSongUrl(newVal.id).then((res) => {
          this.songUrl = res.data[0].url;
        });
        this._getLyric(newVal.id);
        this._setPlayHistory(newVal);
      },
      isPlay (newVal) {
        this.$nextTick(() => {
          let audio = this.$refs.audio;
          newVal ? audio && audio.play() : audio && audio.pause();
          this._playOrPause();
        });
      },
      songReady () {
        this._playOrPause();
      },
      isFullScreen (newVal) {
        if (newVal) {
          this.$refs.titleMarquee.refresh();
          this.$refs.artistMarquee.refresh();
          this.$nextTick(() => {
            this._lyricScrollRefresh();
          });
          this._checkLike();
        }
      },
      loading () {
        this._playOrPause();
      },
      lyricReady (newVal) {
        if (this.currentLyric) {
          if (newVal) {
            this.playingLine = 0;
            this.currentLyric.play();
            this._lyricScrollRefresh();
            this._lyricSeek();
          } else {
            this.currentLyric.stop();
          }
        }
      }
    },
    components: {
      progressCircle,
      progressBar,
      'v-marquee': Marquee,
      Scroll,
      SongsMenu
    }
  };
</script>

<style lang="stylus">
  @import "~common/stylus/variable"

  .player
    position: relative
    width: 0
    height: 0
    z-index: 100
    .larger
      position: fixed
      top: 0
      left: 0
      right: 0
      bottom: 0
      z-index: 100
      background: #999
      .bg
        position: absolute
        left: 0
        right: 0
        top: 0
        bottom: 0
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .header
        position: relative
        display: block
        width: 100%
        height: 40px
        color: $color-background
        .iconfont
          position: absolute
          top: 50%
          transform: translate(0, -50%)
          font-size: 30px
          &.back-btn
            transform: translate(0, -50%) rotate(-90deg)
            left: 10px
          &.share-btn
            right: 10px
        .name-artist
          position: absolute
          top: 0
          left: 50%
          transform: translate(-50%, 0)
          width: 60%
          text-align: center
          font-size: $font-size-medium-x
          .marquee
            display: block
            width: 100%
            height: 40px
            line-height: 40px
            text-align: center
            .title
              display: inline-block
              white-space: nowrap
          .artist
            display: inline-block
            white-space: nowrap
            font-size: $font-size-medium
            color: rgba(255, 255, 255, .6)

      .middle
        position: absolute
        top: 80px
        bottom: 140px
        display: block
        width: 100%
        .nolyric
          position: absolute
          top: 50%
          left: 50%
          transform: translate(-50%, -50%)
          color: #fff
          font-size: $font-size-medium
        .lyric-scroll
          position: absolute
          top: 0
          left: 0
          right: 0
          bottom: 10px
          display: block
          overflow: hidden
          p
            margin: auto
            width: 80%;
            padding: 5px 0
            text-align: center
            box-sizing: border-box
            font-size: $font-size-medium
            color: rgba(255, 255, 255, .7)
            &.playlingLyric
              color: #fff
        .mini-lyric
          position: absolute
          bottom: 10px
          left: 0
          display: block
          width: 100%
          text-align: center
          color: rgba(255, 255, 255, .5)
          font-size: $font-size-medium
          .current
            color: #fff
          span
            display: block
            padding: 5px 0
        .middle-adapter
          position: relative
          display: block
          width: 100%
          height: 0
          padding-top: 80%
          .cd
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            border-radius: 50%
            background-image: linear-gradient(to top, #000, #222, #555, #222, #000)
            .pic
              position: absolute
              top: 50%
              left 50%
              display: block
              width: 60%
              height: 60%
              border: 7px solid rgba(255, 255, 255, .3)
              border-radius: 50%
              overflow: hidden
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              img
                width: 100%
                height: 100%

      .bottom
        position: absolute
        bottom: 10px
        display: block
        width: 100%
        height: 140px
        .progress
          position: absolute
          left: 50%
          bottom: 80px
          transform: translate(-50%, 0)
          width: 70%
          height: 20px
          .time
            position: absolute
            top: 50%
            color: #fff
            font-size: $font-size-small
            &.left
              left: 0
              transform: translate(-120%, -50%)
            &.right
              right: 0
              transform: translate(120%, -50%)
          .progress-background
            position: absolute
            top: 50%
            transform: translate(0, -50%)
            width: 100%
            height: 3px
            background: rgba(0, 0, 0, .5)
            .progress-bar
              position: absolute
              top: 0
              left: 0
              width: 0
              height: 3px
              background: $color-theme
              .dot
                position: absolute
                top: 50%
                right: -15px
                transform: translate(0, -50%)
                display: block
                width: 15px
                height: 15px
                border-radius: 50%
                background: #fff
        .control-bar
          position: absolute
          bottom: 20px
          display: flex
          width: 100%
          height: 40px
          span
            position: relative
            flex: 1
            i
              position: absolute
              top: 50%
              transform: translate(0, -50%)
              &.iconfont
                font-size: 35px
                color: rgba(255, 255, 255, 1)
                &.icon-xihuantianse
                  color: $color-theme
              &.smaller
                font-size: 25px
              &.text-right
                right: 0
              &.text-center
                left: 50%
                transform: translate(-50%, -50%)
                &.iconfont
                  font-size: 44px
              &.text-left
                left: 0
          &.disable
            .click-enable
              color: rgba(255, 255, 255, .4)

  .mini
    position: fixed
    bottom: 0
    left: 0
    display: block
    width: 100%
    height: 55px
    background: #f4f4f4
    .avatar
      position: absolute
      top: 50%
      left: 10px
      transform: translate(0, -50%)
      display: block
      width: 45px
      height: 45px
      border-radius: 50%
      overflow: hidden
      img
        width: 100%
        height: 100%
    .play-list
      position: absolute
      top: 50%
      right: 0
      width: 45px
      height: 55px
      transform: translate(0, -50%)
      font-size: 33px
      line-height: 55px
      text-align: center
      .iconfont
        font-size: 37px
    .text
      position: absolute
      left: 70px
      top: 50%
      right: 100px
      transform: translate(0, -50%)
      .song-name
        display: block
        margin-bottom: 2px
        font-size: $font-size-medium-x
        color: $color-text
        white-space: nowrap
        overflow: hidden
      .artist
        white-space: nowrap
        overflow: hidden
        font-size: $font-size-small
        color: $color-text-s
    .progress
      position: absolute
      top: 50%
      right: 50px
      transform: translate(0, -50%)
      font-size: 0
      .play-btn
        position: absolute
        top: 50%
        left: 50%
        transform: translate(-50%, -50%)
        color: $color-text
        font-size: 22px
        &.icon-bofangzanting
          top: 52%
          left: 51%
        &.icon-bofang
          top: 51.3%
          left: 55%

  .fade-enter-active, .fade-leave-active
    transition: all .3s

  .fade-enter, .fade-leave-to
    opacity: 0

  .larger-fade-enter-active, .larger-fade-leave-active
    transition: all .4s
    .header, .bottom, .middle
      transition: all .2s

  .larger-fade-enter, .larger-fade-leave-to
    opacity: 0
    .middle
      opacity: 0
      transform: scale(1.2)
    .header
      margin-top: -44px
    .bottom
      bottom: -50px !important

  @keyframes rotate
    0%
      transform: translate(-50%, -50%) rotate(0)
    100%
      transform: translate(-50%, -50%) rotate(360deg)
</style>
