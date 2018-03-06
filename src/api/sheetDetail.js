import axios from 'axios';

export function getSheetDetail (id) {
  const url = '/playlist/detail';

  const data = {
    id: id
  };

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data);
  });
}
