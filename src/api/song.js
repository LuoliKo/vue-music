import axios from 'axios';

export function getSongUrl (id) {
  let url = '/music/url';
  let data = {
    id: id
  };
  return axios.get(url, {params: data}).then((res) => {
    return Promise.resolve(res.data);
  });
}

export function getSongLyric (id) {
  let url = '/lyric';
  let data = {
    id: id
  };
  return axios.get(url, {params: data}).then((res) => {
    return Promise.resolve(res.data);
  });
}
