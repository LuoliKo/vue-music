<template>
  <v-menu @close="close" v-show="isShow">
    <div class="main-box">
      <div class="controler">
        <div class="playmode" @click="changeMode()">
          <i class="iconfont" :class="iconMode"></i>
          <span>{{modeText}}</span>
          <span>({{sequenceList.length}})</span>
        </div>
        <div class="trash" @click.stop="deleteAll()">
          <i class="iconfont icon-shanchu"></i>
        </div>
      </div>
      <scroll ref="scroll" class="playing-songs" :data="sequenceList">
        <ul>
          <li v-for="(item,index) in sequenceList" @click="selectItem(index)">
            <p class="text">
              <span v-if="index === isCurrentSong" class="sound iconfont icon-yinliang"></span>
              <span class="name" v-html="item.name"></span>
              -
              <span v-for="(ar,index) in item.ar||item.artists" class="artist">
                <span v-if="index!==0">/</span>
                {{ar.name}}
              </span>
            </p>
            <span class="delete" @click.stop="deleteItem(item)">
              <i class="iconfont icon-guanbi"></i>
            </span>
          </li>
        </ul>
      </scroll>
    </div>
  </v-menu>
</template>

<script>
  import Menu from 'base/menu/menu';
  import Scroll from 'base/scroll/scroll';
  import {mapGetters, mapMutations, mapActions} from 'vuex';
  import {findIndex} from 'common/js/util';
  import {playerMixin} from 'common/js/mixin';

  export default {
    mixins: [playerMixin],
    data () {
      return {
        isShow: false
      };
    },
    computed: {
      isCurrentSong () {
        let index = findIndex(this.sequenceList, this.currentSong);
        return index;
      },
      ...mapGetters([
        'sequenceList',
        'playList',
        'currentSong',
        'playMode'
      ])
    },
    methods: {
      deleteItem (song) {
        this.deleteSong(song);
      },
      selectItem (index) {
        let _index = findIndex(this.playList, this.sequenceList[index]);
        this.setCurrentIndex(_index);
      },
      close () {
        this.isShow = false;
      },
      open () {
        this.isShow = true;
        this.$nextTick(() => {
          this.$refs.scroll.refresh();
        });
      },
      ...mapMutations({
        setCurrentIndex: 'SET_CURRENT_INDEX'
      }),
      ...mapActions([
        'deleteSong',
        'deleteAll'
      ])
    },
    components: {
      'v-menu': Menu,
      Scroll
    }
  };
</script>

<style lang="stylus">
  @import "~common/stylus/variable"

  .main-box
    position: relative
    padding-bottom: 100%
    .controler
      position: relative
      width: 100%
      height: 50px
      border-bottom: 1px solid rgba(177, 177, 177, .3)
      .iconfont
        font-size: 18px
      & > div
        position: absolute
        padding: 0 5px
        height: 100%
        line-height: 50px
        &:active
          background: #ccc
      .playmode
        left: 0
        padding-left: 30px
        i
          position: absolute
          left 7px
          top: 50%
          transform: translate(0, -50%)
      .trash
        right: 0
        padding: 0 15px
    .playing-songs
      position: absolute
      top: 50px
      bottom: 0
      left: 50%
      transform: translate(-50%, 0)
      width: 98%
      overflow: hidden
      li
        position: relative
        width: 100%
        height: 45px
        border-bottom: 1px solid rgba(177, 177, 177, .3)
        .text
          position: absolute
          top: 50%
          left: 5px
          width: 90%
          transform: translate(0, -50%)
          white-space: nowrap
          overflow: hidden
          text-overflow ellipsis
          .sound
            color: $color-theme
          .name
            font-size: $font-size-medium
            color: $color-text
          .artist
            font-size: $font-size-small
            color: $color-text-s
        .delete
          position: absolute
          right: 0
          top: 50%
          transform: translate(0, -50%)
          height: 45px
          width: 45px
          line-height: 45px
          text-align: center
          color: $color-text-s
          &:active
            background: #eee
          .iconfont
            font-size: $font-size-medium
</style>
