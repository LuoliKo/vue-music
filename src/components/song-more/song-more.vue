<template>
  <div>
    <ul class="song-more" v-if="moreMenu.classify==='song'">
      <li @click="nextToPlay">
        <div class="icon">
          <i class="iconfont icon-icon-4"></i>
        </div>
        <div class="right">
          <p class="text">下一首播放</p>
        </div>
      </li>
      <li @click="addLikeSong" v-if="!moreMenu.collected">
        <div class="icon">
          <i class="iconfont icon-xiai"></i>
        </div>
        <div class="right">
          <p class="text">喜欢</p>
        </div>
      </li>
      <li @click="deleteLikeSong" v-if="moreMenu.collected">
        <div class="icon">
          <i class="iconfont icon-shanchu"></i>
        </div>
        <div class="right">
          <p class="text">我已经不喜欢你了</p>
        </div>
      </li>
      <li @click="share">
        <div class="icon">
          <i class="iconfont icon-fenxiang"></i>
        </div>
        <div class="right">
          <p class="text">分享</p>
        </div>
      </li>
      <li @click="toSingerPage">
        <div class="icon">
          <i class="iconfont icon-geshou"></i>
        </div>
        <div class="right">
          <p class="text">歌手：
            <span v-for="(ar,index) in moreMenu.ar || moreMenu.artists">
                <span v-if="index!==0">/</span>
                {{ar.name}}
              </span>
          </p>
        </div>
      </li>
    </ul>
    <ul class="song-more" v-if="moreMenu.classify==='sheet'">
      <li @click="share">
        <div class="icon">
          <i class="iconfont icon-fenxiang"></i>
        </div>
        <div class="right">
          <p class="text">分享</p>
        </div>
      </li>
      <li @click="deleteCollectSheet" v-if="moreMenu.collected">
        <div class="icon">
          <i class="iconfont icon-shanchu"></i>
        </div>
        <div class="right">
          <p class="text">休了</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import {mapGetters, mapActions, mapMutations} from 'vuex';
  import {findIndex} from 'common/js/util';
  import {likeSong, deleteLikeSong, deleteCollectSheet} from 'common/js/storage';

  export default {
    computed: {
      ...mapGetters([
        'moreMenu',
        'likeSongs',
        'collectSheets'
      ])
    },
    methods: {
      share () {
        this.$layer.toast({
          content: '请手动复制地址，并发送您要分享的平台！so easy！'
        });
        this.$emit('close');
      },
      deleteCollectSheet () {
        let _collectSheets = this.collectSheets.slice();
        let _currentSheet = this.moreMenu;
        let index = findIndex(_collectSheets, _currentSheet);
        if (index !== -1) {
          this.$layer.dialog({
            content: '你确定你要休了我吗？',
            btn: ['取消', '确定']
          }).then((res) => {
            if (res) {
              _collectSheets.splice(index, 1);
              this.setCollectSheets(_collectSheets);
              deleteCollectSheet(_currentSheet);
              this.$layer.toast({
                content: '哇！你这喜新厌旧，三心两意的家伙！骗子！滚蛋！死扑街！'
              });
              this.$emit('close');
            }
          });
        } else {
          this.$layer.toast({
            content: '这是一个bug，‘我是神经病了~~’'
          });
        }
      },
      deleteLikeSong () {
        let _likeSongs = this.likeSongs.slice();
        let _currentSong = this.moreMenu;
        let index = findIndex(_likeSongs, _currentSong);
        if (index !== -1) {
          this.$layer.dialog({
            content: '你确定你不喜欢我了吗？',
            btn: ['取消', '确定']
          }).then((res) => {
            if (res) {
              _likeSongs.splice(index, 1);
              this.setLikeSongs(_likeSongs);
              deleteLikeSong(_currentSong);
              this.$layer.toast({
                content: '哇！你这喜新厌旧，三心两意的家伙！骗子！滚蛋！死扑街！'
              });
              this.$emit('close');
            }
          });
        } else {
          this.$layer.toast({
            content: '这是一个bug，‘我是神经病了~~’'
          });
        }
      },
      addLikeSong () {
        let _likeSongs = this.likeSongs.slice();
        let _currentSong = this.moreMenu;
        let index = findIndex(this.likeSongs, _currentSong);
        if (index !== -1) {
          this.$layer.toast({
            content: '此歌曲早已收藏了！'
          });
        } else {
          _currentSong.privilege = {cp: 1};
          _likeSongs.unshift(_currentSong);
          this.setLikeSongs(_likeSongs);
          likeSong(_currentSong);
          this.$layer.toast({
            content: '收藏成功！'
          });
          this.$emit('close');
        }
      },
      nextToPlay () {
        this.insertSong({
          song: this.moreMenu,
          isNext: true
        });
        this.$emit('nextToPlay');
      },
      toSingerPage () {
        let ar = this.moreMenu.ar || this.moreMenu.artists;
        let route = this.$route;
        if (ar.length === 1) {
          let id = ar[0].id;
          if (route.params.id && (route.params.id.toString() === id.toString())) {
            this.$layer.toast({
              content: '已是当前歌手'
            });
            return;
          }
          let path = route.path;
          let isSearchPage = path.match(/\/search\/song|\/collection\/song/);
          path = isSearchPage ? isSearchPage[0] : path.match(/^\/\w+\/\w+(\/\d+)?/)[0];
          this.$router.push({
            path: `${path}/${id}`
          });
          this.$emit('close');
        } else {
          this.$emit('selectSingers');
        }
      },
      ...mapActions([
        'insertSong'
      ]),
      ...mapMutations({
        setLikeSongs: 'SET_LIKE_SONGS',
        setCollectSheets: 'SET_COLLECT_SHEETS'
      })
    }
  };
</script>

<style lang="stylus">
  @import "~common/stylus/variable"

  ul.song-more
    width: 100%
    padding: 0 10px 0 5px
    box-sizing: border-box
    & > li
      display: flex
      width: 100%
      height: 45px
      line-height: 45px
      .icon
        flex: 0, 0 45px
        height: 45px
        padding: 0 10px
        color: $color-theme
        .iconfont
          font-size: 25px
          font-weight: 500
      .right
        flex-grow: 1
        overflow hidden
        font-size: $font-size-medium
        border-bottom: 1px solid rgba(177, 177, 177, .3)
        .text
          display: block
          padding-left: 3px
          width: 90%
          white-space nowrap
          text-overflow ellipsis
          overflow: hidden

  ::-webkit-scrollbar
    width: 0
</style>
