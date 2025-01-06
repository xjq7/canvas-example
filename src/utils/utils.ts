/**
 *
 *
 * @export
 * @param {number} min
 * @param {number} max
 * @param {boolean} [float=false]
 * @return {*}  {number}
 */
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

/**
 *
 *
 * @export
 * @param {object} obj1
 * @param {object} obj2
 * @return {*}
 */
export function shadowEqual(obj1: object, obj2: object) {
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object') {
    return obj1 === obj2;
  }
  if (Object.keys(obj1).length !== Object.keys(obj2).length) {
    return false;
  }
  for (const key in obj1) {
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }
  return true;
}
