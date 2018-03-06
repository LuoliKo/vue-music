import axios from 'axios';

export function getSingerList (offset, limit) {
  let url = '/top/artists';
  let data = {
    offset: offset,
    limit: limit
  };
  return axios.get(url, {params: data}).then((res) => {
    return Promise.resolve(res.data);
  });
}

export function getSingerSongs (id) {
  let url = '/artists';
  let data = {
    id: id
  };
  return axios.get(url, {params: data}).then((res) => {
    return Promise.resolve(res.data);
  });
}

export function getSingerDesc (id) {
  let url = '/artist/desc';
  let data = {
    id: id
  };
  return axios.get(url, {params: data}).then((res) => {
    return Promise.resolve(res.data);
  });
}
