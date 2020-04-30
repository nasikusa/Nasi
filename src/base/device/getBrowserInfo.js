import { ua } from '../../statics';

/**
 * 現在のブラウザを判定してscopeの変数に格納する
 * @return {void}
 * @todo Androidブラウザ
 */
export default function getBrowserInfo() {
  let result;
  if (ua.indexOf('msie') !== -1 || ua.indexOf('trident') !== -1) {
    result = 'ie';
  } else if (ua.indexOf('edge') !== -1) {
    result = 'edge';
  } else if (ua.indexOf('chrome') !== -1) {
    result = 'chrome';
  } else if (ua.indexOf('safari') !== -1) {
    result = 'safari';
  } else if (ua.indexOf('firefox') !== -1) {
    result = 'firefox';
  } else if (ua.indexOf('opera') !== -1) {
    result = 'opera';
  } else {
    result = 'other';
  }
  return result;
}
