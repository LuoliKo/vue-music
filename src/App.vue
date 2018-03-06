<template>
  <div id="app">
    <m-header @showSideBox="showSideBox"></m-header>
    <side-box :isShow="isShow" @close="closeSideBox"></side-box>
    <keep-alive>
      <router-view @showInfo="showInfo"/>
    </keep-alive>
    <player></player>
    <sheet-info v-if="sheetInfo" @closeInfo="closeInfo"></sheet-info>
    <more-menu></more-menu>
  </div>
</template>

<script>
  import Header from 'components/header/header';
  import Player from 'components/player/player';
  import sideBox from 'components/sidebox/sidebox';
  import SheetInfo from 'components/sheet-info/sheet-info';
  import MoreMenu from 'components/more-menu/more-menu';
  import {initStorage, getLikeSongs, getCollectSheets, getPlayHistory, getSearchHistory} from 'common/js/storage';
  import {mapMutations} from 'vuex';

  export default {
    name: 'app',
    data () {
      return {
        isShow: false,
        sheetInfo: false
      };
    },
    created () {
      initStorage();
      this.setLikeSongs(getLikeSongs());
      this.setCollectSheets(getCollectSheets());
      this.setPlayHistory(getPlayHistory());
      this.setsearchHistory(getSearchHistory());
    },
    methods: {
      showSideBox () {
        this.isShow = true;
      },
      closeSideBox () {
        this.isShow = false;
      },
      showInfo () {
        this.sheetInfo = true;
      },
      closeInfo () {
        this.sheetInfo = false;
      },
      ...mapMutations({
        setLikeSongs: 'SET_LIKE_SONGS',
        setCollectSheets: 'SET_COLLECT_SHEETS',
        setPlayHistory: 'SET_PLAY_HISTORY',
        setsearchHistory: 'SET_SEARCH_HISTORY'
      })
    },
    components: {
      'm-header': Header,
      Player,
      sideBox,
      SheetInfo,
      MoreMenu
    }
  };
</script>

<style>
</style>
