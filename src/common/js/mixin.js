import {mapGetters, mapMutations} from 'vuex';
import {playMode} from './config';
import {shuffle} from './util';

export const playListMixin = {
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
  mounted () {
    this.scrollRefresh(this.playList);
  },
  activated () {
    this.scrollRefresh(this.playList);
  },
  watch: {
    playList (newVal) {
      this.scrollRefresh(newVal);
    }
  },
  methods: {
    scrollRefresh () {
      throw new Error('component must implement handlePlaylist method');
    }
  }
};

export const playerMixin = {
  computed: {
    modeText () {
      return this.playMode === playMode.sequence ? '循环播放' : this.playMode === playMode.loop ? '单曲循环' : '随机播放';
    },
    iconMode () {
      return this.playMode === playMode.sequence ? 'icon-xunhuanbofang' : this.playMode === playMode.loop ? 'icon-danquxunhuan' : 'icon-suiji2';
    },
    ...mapGetters([
      'sequenceList',
      'playList',
      'currentSong',
      'playMode'
    ])
  },
  methods: {
    changeMode () {
      const mode = (this.playMode + 1) % 3;
      this.setPlayMode(mode);
      let list = null;
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList);
      } else {
        list = this.sequenceList;
      }
      this.resetCurrentIndex(list);
      this.setPlaylist(list);
    },
    resetCurrentIndex (list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id;
      });
      this.setCurrentIndex(index);
    },
    ...mapMutations({
      setPlayMode: 'SET_PLAY_MODE',
      setPlaylist: 'SET_PLAYLIST',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayingState: 'SET_PLAYING_STATE'
    })
  }
};

export const moreMenuMixin = {
  methods: {
    getMore () {
      throw new Error('component must implement handlePlaylist method');
    },
    setMoreMenu (song, classify = 'song', collected = false) {
      song.classify = classify;
      song.collected = collected;
      this.mSetMoreMenu(song);
    },
    ...mapMutations({
      mSetMoreMenu: 'SET_MORE_MENU'
    })
  }
};
