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

export function getRandomInRange(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function openInNewTab(url: string) {
  window.open(url, '_blank')!.focus();
}
