import getDeviceType from './getDeviceType';
import getMobileMacineInfo from './getMobileMacineInfo';
import getBrowserInfo from './getBrowserInfo';
import getGPUInfo from './getGPUInfo';

export default function getDeviceInfo() {
  const result = {};
  result.type = getDeviceType();
  result.macine = getMobileMacineInfo();
  result.browser = getBrowserInfo();
  result.gpu = getGPUInfo();
  return result;
}
