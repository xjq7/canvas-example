export function randomValue(
  min: number,
  max: number,
  float: boolean = false
): number {
  let val = Math.random() * (max - min) + min;
  if (!float) {
    val = Math.round(val);
  }
  return val;
}
