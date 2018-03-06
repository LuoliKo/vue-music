import axios from 'axios';

export function getHotSearchKeys () {
  let url = '/search/hot';
  return axios.get(url).then((res) => {
    return Promise.resolve(res.data);
  });
}

export function getSearchData (keywords, type, offset = 0, limit = 30) {
  let url = '/search';
  let data = {
    keywords: keywords,
    type: type,
    offset: offset,
    limit: limit
  };
  return axios.get(url, {params: data}).then((res) => {
    return Promise.resolve(res.data);
  });
}
