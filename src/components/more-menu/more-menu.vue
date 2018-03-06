<template>
  <v-menu @close="close" v-if="moreMenu" @click="close">
    <div class="more-menu" v-show="!isShow">
      <h2 class="name">
        <span class="label" v-if="moreMenu.classify==='song'">歌曲：</span>
        <span class="label" v-if="moreMenu.classify==='sheet'">歌单：</span>
        <span v-html="moreMenu.name"></span>
      </h2>
      <song-more @nextToPlay="close" @close="close" @selectSingers="selectSingers"></song-more>
    </div>
    <transition name="fade">
      <v-dialog class="select-box" v-show="isShow" @click.stop>
        <ul>
          <li v-for="(item,index) in moreMenu.ar||moreMenu.artists" @click="toSingerPage(index)">
            <div class="avatar">
              <i class="iconfont icon-geshou"></i>
            </div>
            <div class="text">
              {{item.name}}
            </div>
          </li>
        </ul>
      </v-dialog>
    </transition>
  </v-menu>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex';
  import Menu from 'base/menu/menu';
  import SongMore from 'components/song-more/song-more';
  import Dialog from 'base/dialog/dialog';

  export default {
    data () {
      return {
        isShow: false
      };
    },
    computed: {
      ...mapGetters([
        'moreMenu'
      ])
    },
    methods: {
      close () {
        this.setMoreMenu(null);
        this.isShow = false;
      },
      selectSingers () {
        this.isShow = true;
      },
      toSingerPage (index) {
        let ar = this.moreMenu.ar || this.moreMenu.artists;
        let id = ar[index].id;
        if (this.$route.params.id && (this.$route.params.id.toString() === id.toString())) {
          this.$layer.toast({
            content: '已是当前歌手'
          });
          return;
        }
        let path = this.$route.path;
        let isSearchPage = path.match(/\/search\/song|\/collection\/song/);
        path = isSearchPage ? isSearchPage[0] : path.match(/^\/\w+\/\w+(\/\d+)?/)[0];
        if (id === 0) {
          console.log('没有该歌手信息');
          return;
        }
        this.$router.push({
          path: `${path}/${id}`
        });
        this.close();
      },
      ...mapMutations({
        setMoreMenu: 'SET_MORE_MENU'
      })
    },
    components: {
      'v-menu': Menu,
      SongMore,
      'v-dialog': Dialog
    }
  };
</script>

<style lang="stylus">
  @import "~common/stylus/variable"

  .more-menu
    padding-top: 10px
    .name
      display: block
      width: 100%
      padding: 10px 5px
      box-sizing: border-box
      color: $color-text
      font-size: $font-size-medium
      white-space: nowrap
      overflow: hidden
      text-overflow ellipsis
      .label
        color: $color-text-s

  .select-box
    max-height: 50%
    width: 80%
    box-sizing: border-box
    font-size: $font-size-medium
    color: $color-text
    overflow-y: scroll
    &.fade-enter-active, &.fade-leave-active
      transiton: all .3s
    &.fade-enter, &.fade-leave-to
      opacity: 0
    ul
      display: block
      width: 100%
      padding: 10px
      box-sizing: border-box
      & > li
        display: flex
        width: 100%
        height: 45px
        line-height: 45px
        .avatar
          display: inline-block
          flex: 0 0 43px
          height: 43px
          text-align: center
          .iconfont
            font-size: 26px
            color: $color-theme
        .text
          flex-grow: 1
          overflow: hidden
          border-bottom: 1px solid rgba(177, 177, 177, .3)
        &:last-child
          .text
            border-bottom: 0
</style>
