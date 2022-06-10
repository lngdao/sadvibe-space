export const toHHMMSS = (time: string) => {
  const sec_num = parseInt(time, 10);
  const hours = Math.floor(sec_num / 3600);
  const minutes = Math.floor((sec_num - hours * 3600) / 60);
  const seconds = sec_num - hours * 3600 - minutes * 60;

  let secondStr: string = `${seconds}`;

  if (seconds < 10) {
    secondStr = '0' + seconds;
  }

  return (hours > 0 ? hours + ':' : '') + minutes + ':' + secondStr;
};
