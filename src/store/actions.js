import * as types from './mutation-types';
import {playMode} from 'common/js/config';
import {findIndex} from 'common/js/util';

export const selectSong = function ({commit, state}, {list, index}) {
  if (JSON.stringify(list) === JSON.stringify(state.sequenceList)) {
    index = state.playList.findIndex((item) => {
      return item.id === list[index].id;
    });
    commit(types.SET_CURRENT_INDEX, index);
  } else {
    commit(types.SET_SEQUENCE_LIST, list);
    commit(types.SET_PLAYLIST, list);
    commit(types.SET_PLAY_MODE, playMode.sequence);
    commit(types.SET_CURRENT_INDEX, index);
    commit(types.SET_PLAYING_STATE, true);
  }
};

export const insertSong = function ({commit, state}, {song, isNext}) {
  let playList = state.playList.slice();
  let sequenceList = state.sequenceList.slice();
  let currentIndex = state.currentIndex;
  let currentSong = playList[currentIndex];
  let fpIndex = findIndex(playList, song);
  currentIndex++;
  playList.splice(currentIndex, 0, song);
  if (fpIndex !== -1) {
    if (currentIndex > fpIndex) {
      playList.splice(fpIndex, 1);
      currentIndex--;
    } else {
      playList.splice(fpIndex + 1, 1);
    }
  }
  let currentSIndex = findIndex(sequenceList, currentSong) + 1;
  let fsIndex = findIndex(sequenceList, song);
  sequenceList.splice(currentSIndex, 0, song);

  if (fsIndex !== -1) {
    if (currentSIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1);
    } else {
      sequenceList.splice(fsIndex + 1, 1);
    }
  }
  // 如果添加为下一首，currentIndex--
  if (isNext && playList.length !== 1) {
    currentIndex--;
  }

  commit(types.SET_PLAYLIST, playList);
  commit(types.SET_SEQUENCE_LIST, sequenceList);
  commit(types.SET_CURRENT_INDEX, currentIndex);
  commit(types.SET_PLAYING_STATE, true);
};

export const deleteSong = function ({commit, state}, song) {
  let _sequenceList = state.sequenceList.slice();
  let _playList = state.playList.slice();
  let _currentIndex = state.currentIndex;
  let plIndex = findIndex(state.playList, song);
  let slIndex = findIndex(state.sequenceList, song);
  if (plIndex === -1 || slIndex === -1) {
    return;
  }
  if (plIndex < _currentIndex) {
    _currentIndex--;
  }
  if (plIndex === _playList.length - 1 && plIndex === _currentIndex) {
    _currentIndex = 0;
  }
  if (_playList.length === 1) {
    _currentIndex = -1;
    commit(types.SET_PLAYING_STATE, false);
  }
  _sequenceList.splice(slIndex, 1);
  _playList.splice(plIndex, 1);
  commit(types.SET_PLAYLIST, _playList);
  commit(types.SET_SEQUENCE_LIST, _sequenceList);
  commit(types.SET_CURRENT_INDEX, _currentIndex);
};

export const deleteAll = function ({commit}) {
  commit(types.SET_PLAYLIST, []);
  commit(types.SET_SEQUENCE_LIST, []);
  commit(types.SET_CURRENT_INDEX, -1);
  commit(types.SET_PLAYING_STATE, false);
};

export const selectInPlayList = function ({state, commit}, index) {
  let _song = state.sequenceList[index];
  let plIndex = findIndex(state.playList, _song);
  commit(types.SET_CURRENT_INDEX, plIndex);
  commit(types.SET_PLAYING_STATE, true);
};
