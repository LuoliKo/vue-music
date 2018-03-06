import {findIndex} from './util';

function getStorage (key) {
  return JSON.parse(window.localStorage.getItem(key));
}

function setStorage (key, json) {
  window.localStorage.setItem(key, JSON.stringify(json));
}

function getListByKey (key) {
  let list = getStorage(key);
  if (!list) {
    setStorage(key, []);
    return [];
  } else if (!list.length) {
    return [];
  } else {
    return list;
  }
}

function addItem (key, item) {
  let list = getListByKey(key);
  list.unshift(item);
  setStorage(key, list);
}

function clear (key) {
  setStorage(key, []);
}

function deleteItem (key, item) {
  let list = getListByKey(key);
  let index = item.id ? findIndex(list, item) : list.indexOf(item);
  if (index !== -1) {
    list.splice(index, 1);
    setStorage(key, list);
  }
}

export function initStorage () {
  getStorage('likeSongs') || setStorage('likeSongs', []);
  getStorage('collectSheets') || setStorage('collectSheets', []);
  getStorage('playHistory') || setStorage('playHistory', []);
  getStorage('searchHistory') || setStorage('searchHistory', []);
}

// 喜欢歌曲
export function getLikeSongs () {
  return getListByKey('likeSongs');
}

export function likeSong (song) {
  addItem('likeSongs', song);
}

export function deleteLikeSong (song) {
  deleteItem('likeSongs', song);
}

export function clearLikeSongs () {
  clear('likeSongs');
}

// 收藏歌单
export function getCollectSheets () {
  return getListByKey('collectSheets');
}

export function collectSheet (sheet) {
  addItem('collectSheets', sheet);
}

export function deleteCollectSheet (sheet) {
  deleteItem('collectSheets', sheet);
}

export function clearCollectSheets () {
  clear('collectSheets');
}

// 播放历史
export function getPlayHistory () {
  return getListByKey('playHistory');
}

export function addPlayHistory (song) {
  let _playHistory = getPlayHistory();
  let index = findIndex(_playHistory, song);
  if (index !== -1) {
    _playHistory.splice(index, 1);
  }
  while (_playHistory.length >= 50) {
    _playHistory.pop();
  }
  setStorage('playHistory', _playHistory);
  addItem('playHistory', song);
}

export function deletePlayHistory (song) {
  deleteItem('playHistory', song);
}

export function clearPlayHistory () {
  clear('playHistory');
}

// 搜索历史
export function getSearchHistory () {
  return getListByKey('searchHistory');
}

export function addSearchHistory (key) {
  let _searchHistory = getSearchHistory();
  let index = _searchHistory.indexOf(key);
  if (index !== -1) {
    _searchHistory.splice(index, 1);
  }
  while (_searchHistory.length >= 5) {
    _searchHistory.pop();
  }
  setStorage('searchHistory', _searchHistory);
  addItem('searchHistory', key);
}

export function deletegetSearchHistory (key) {
  deleteItem('searchHistory', key);
}

export function cleargetSearchHistory () {
  clear('searchHistory');
}
