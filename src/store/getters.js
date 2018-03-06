export const sheet = state => state.sheet;

export const isPlay = state => state.isPlay;

export const isFullScreen = state => state.isFullScreen;

export const playList = state => state.playList;

export const sequenceList = state => state.sequenceList;

export const playMode = state => state.playMode;

export const currentIndex = state => state.currentIndex;

export const currentSong = (state) => {
  return state.playList[state.currentIndex] || {error: 0};
};

export const moreMenu = state => state.moreMenu;

export const likeSongs = state => state.likeSongs;

export const collectSheets = state => state.collectSheets;

export const playHistory = state => state.playHistory;

export const searchHistory = state => state.searchHistory;
