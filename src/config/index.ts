export const BASE_URL =
  process.env.NODE_ENV == 'development'
    ? process.env.REACT_APP_BASE_URL_DEV
    : process.env.REACT_APP_BASE_URL_PROD;

export const solidColorParamsList = <const> [
  '#2D2D2D',
  '#51557E',
  '#839AA8',
  '#A5BECC',
  '#EF9F9F',
  '#6D8B74',
  '#EEEEEE',
  '#F1D18A',
  '#999B84',
  '#E6C4C0'
];
