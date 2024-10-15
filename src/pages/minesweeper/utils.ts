export function create2dimensionArr(x: number, y: number, defaultValue?: any) {
  const arr = new Array(x);
  for (let i = 0; i < y; i++) arr[i] = new Array(y).fill(defaultValue);
  return arr;
}
