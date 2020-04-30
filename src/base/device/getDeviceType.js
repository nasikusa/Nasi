import { ua } from '../../statics';

/**
 * スマホかタブレットかその他かを判別する
 * @return {String} sp|tab|other
 */
export default function getDeviceType() {
  let result;
  if (/iphone|ipod|^(?=.*android)(?=.*mobile)/.test(ua)) {
    result = 'sp';
  } else if (/ipad|android/.test(ua)) {
    result = 'tab';
  } else {
    result = 'other';
  }
  return result;
}
