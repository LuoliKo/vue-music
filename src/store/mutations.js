import * as types from './mutation-types';

const mutations = {
  [types.SELECT_SHEET] (state, sheet) {
    state.sheet = sheet;
  },
  [types.SET_PLAYING_STATE] (state, flag) {
    state.isPlay = flag;
  },
  [types.SET_SCREEN_STATE] (state, flag) {
    state.isFullScreen = flag;
  },
  [types.SET_PLAYLIST] (state, list) {
    state.playList = list;
  },
  [types.SET_SEQUENCE_LIST] (state, list) {
    state.sequenceList = list;
  },
  [types.SET_PLAY_MODE] (state, mode) {
    state.playMode = mode;
  },
  [types.SET_CURRENT_INDEX] (state, index) {
    state.currentIndex = index;
  },
  [types.SET_MORE_MENU] (state, obj) {
    state.moreMenu = obj;
  },
  [types.SET_LIKE_SONGS] (state, list) {
    state.likeSongs = list;
  },
  [types.SET_COLLECT_SHEETS] (state, list) {
    state.collectSheets = list;
  },
  [types.SET_PLAY_HISTORY] (state, list) {
    state.playHistory = list;
  },
  [types.SET_SEARCH_HISTORY] (state, list) {
    state.searchHistory = list;
  }
};

export default mutations;
