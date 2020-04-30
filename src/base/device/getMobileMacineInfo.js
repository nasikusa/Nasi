import { ua } from '../../statics';

/**
 *
 * @return {String}
 */
export default function saveMobileMacineInfo() {
  let result;
  if (ua.indexOf('iphone') !== -1) {
    result = 'iphone';
  } else if (ua.indexOf('ipad') !== -1) {
    result = 'ipad';
  } else if (ua.indexOf('android') !== -1) {
    if (ua.indexOf('mobile') !== -1) {
      result = 'android_sp';
    } else {
      result = 'android_tab';
    }
  } else {
    result = 'other';
  }

  return result;
}
