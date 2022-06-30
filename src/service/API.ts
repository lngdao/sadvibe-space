import axios, { Method } from 'axios';
import { BASE_URL } from '../config';

type TParams = {
  api: string;
  method: Method;
  beforeSend?: () => void;
  onSuccess: (res: any) => void;
  onError?: (err: any) => void;
  params?: any;
  payload?: any;
};

export const callAPI = (prs: TParams) => {
  const {
    api,
    method,
    onSuccess,
    onError,
    beforeSend,
    params = {},
    payload,
  } = prs;

  !!beforeSend && beforeSend();

  return axios({
    url: BASE_URL + api,
    method,
    params,
    data: payload,
  })
    .then((res) => {
      if (res.data.status != 1)
        return Promise.reject(new Error('Co loi xay ra'));
      return Promise.resolve(onSuccess(res.data));
    })
    .catch((err) => {
      Promise.reject(!!onError && onError(err));
    });
};
