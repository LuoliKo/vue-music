import axios from 'axios';

export function getTopList () {
  let url = '/toplist';
  return axios.get(url).then((res) => {
    return Promise.resolve(res.data);
  });
}
