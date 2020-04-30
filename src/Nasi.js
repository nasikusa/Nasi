/* globals window */
import * as statics from './statics';
import getType from './base/getType';
import getDeviceType from './base/device/getDeviceType';
import getMobileMacineInfo from './base/device/getMobileMacineInfo';
import getBrowserInfo from './base/device/getBrowserInfo';
import getGPUInfo from './base/device/getGPUInfo';
import getDeviceInfo from './base/device/getDeviceInfo';
import { createInstance } from './create/createInstance';

(() => {
  const Nasi = {};

  // variables
  Nasi.ua = statics.ua;
  Nasi.name = statics.name;

  // methods
  Nasi.getType = getType;
  Nasi.getDeviceType = getDeviceType;
  Nasi.getMobileMacineInfo = getMobileMacineInfo;
  Nasi.getBrowserInfo = getBrowserInfo;
  Nasi.getGPUInfo = getGPUInfo;
  Nasi.getDeviceInfo = getDeviceInfo;
  Nasi.createInstance = createInstance;

  window.Nasi = Nasi;
})();
