import {playMode} from 'common/js/config';

const state = {
  sheet: {},
  isPlay: false,
  isFullScreen: false,
  playList: [],
  sequenceList: [],
  playMode: playMode.sequence,
  currentIndex: -1,
  moreMenu: null,
  likeSongs: [],
  collectSheets: [],
  playHistory: [],
  searchHistory: []
};

export default state;
