import axios from 'axios';

export function getSheet (limit, offset, order) {
  const url = '/top/playlist';

  const data = {
    limit: limit,
    offset: offset,
    order: order
  };

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data);
  });
}
