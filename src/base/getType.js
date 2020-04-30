/**
 * 型判定のための関数
 * @param  {number|string|object|Array|null|undefined|bool|NaN} object
 * @return {string}
 * @todo Number.isNan not working in IE.
 */
export default function getType(object) {
  let type = Object.prototype.toString.call(object).slice(8, -1).toLowerCase();
  if (type === 'number' && Number.isNaN(object))type = 'NaN';
  return type;
}
