export function create2dimensionArr(x: number, y: number, defaultValue?: any) {
  const arr = new Array(x);
  for (let i = 0; i < y; i++) arr[i] = new Array(y).fill(defaultValue);
  return arr;
}

export function getTextColor(num: number) {
  const colors = [
    '#0000FF',
    '#008000',
    '#FF0000',
    '#00008B',
    '#8B0000',
    '#FFA500',
    '#000000',
    ' #808080',
  ];
  return colors[num - 1];
}

export function getDelayTime(step: number) {
  return Math.log(step) * 0.08;
}

