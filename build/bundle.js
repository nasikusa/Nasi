!function(e){var t={};function n(r){if(t[r])return t[r].exports;var i=t[r]={i:r,l:!1,exports:{}};return e[r].call(i.exports,i,i.exports,n),i.l=!0,i.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)n.d(r,i,function(t){return e[t]}.bind(null,i));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){"use strict";n.r(t);const r=navigator.userAgent.toLowerCase();function i(e){let t=Object.prototype.toString.call(e).slice(8,-1).toLowerCase();return"number"===t&&Number.isNaN(e)&&(t="NaN"),t}function o(){let e;return e=/iphone|ipod|^(?=.*android)(?=.*mobile)/.test(r)?"sp":/ipad|android/.test(r)?"tab":"other"}function c(){let e;return e=-1!==r.indexOf("iphone")?"iphone":-1!==r.indexOf("ipad")?"ipad":-1!==r.indexOf("android")?-1!==r.indexOf("mobile")?"android_sp":"android_tab":"other"}function s(){let e;return e=-1!==r.indexOf("msie")||-1!==r.indexOf("trident")?"ie":-1!==r.indexOf("edge")?"edge":-1!==r.indexOf("chrome")?"chrome":-1!==r.indexOf("safari")?"safari":-1!==r.indexOf("firefox")?"firefox":-1!==r.indexOf("opera")?"opera":"other"}function u(e){let t,n,r;t=null!=t?e:document.createElement("canvas");try{const e=(n=t.getContext("experimental-webgl")).getExtension("WEBGL_debug_renderer_info");r=e?n.getParameter(e.UNMASKED_RENDERER_WEBGL):""}catch(e){n=null,r=""}const i={};if(i.originalText=r,i.text=r.toLowerCase(),i.compactText=i.text.replace(/\s+/g,""),i.spec=2,-1!==i.text.indexOf("intel")){const e=i.text.match(/[0-9]{3,4}/);if(e){const t=[540,550,580,640,655,650,5200,6200],n=[530,620,630,5600,6e3],r=[520,615,5100,6100],o=[460,510,515,610,615,4600,5e3,5500];[400,405,500,505,600,605,4e3,4200,4400].includes(Number(e[0]))?i.spec=0:o.includes(Number(e[0]))?i.spec=1:r.includes(Number(e[0]))?i.spec=2:n.includes(Number(e[0]))?i.spec=3:t.includes(Number(e[0]))?i.spec=4:i.spec=2,i.version=Number(e[0])}}if(-1!==i.text.indexOf("geforce")){const e=i.text.match(/[0-9]{3,4}/);if(e){i.version=Number(e[0]),i.isGeforceTi=i.text.indexOf("ti")>-1;const t=[],n=[910],r=[710,820],o=[];[].includes(Number(e[0]))?i.spec=0:o.includes(Number(e[0]))?i.spec=1:r.includes(Number(e[0]))?i.spec=2:n.includes(Number(e[0]))?i.spec=3:(t.includes(Number(e[0])),i.spec=4)}}if(-1!==i.text.indexOf("radeon")){const e=i.text.match(/[0-9]{3,4}/);if(e){const t=[],n=[7770,250],r=[7750],o=[240];[].includes(Number(e[0]))?i.spec=0:o.includes(Number(e[0]))?i.spec=1:r.includes(Number(e[0]))?i.spec=2:n.includes(Number(e[0]))?i.spec=3:(t.includes(Number(e[0])),i.spec=4),i.version=Number(e[0])}}return-1!==i.text.indexOf("adreno")&&(i.spec=2),-1!==i.text.indexOf("powervr")&&(i.spec=2),-1!==i.text.indexOf("mali")&&(i.spec=2),null!=i.spec&&(4===i.spec?i.performance="high":i.spec<=3&&i.spec>=1?i.performance="middle":0===i.spec?i.performance="low":i.performance="unknown"),i.isIntel=i.text.indexOf("intel")>-1,i.isNvidia=i.text.indexOf("nvidia")>-1,i}function f(){const e={};return e.type=o(),e.macine=c(),e.browser=s(),e.gpu=u(),e}function l(e,t,n,r){const i=Object.keys(e),o={};for(let n=0,r=i.length;n<r;n++)t.indexOf(i[n])>-1&&(o[i[n]]=e[i[n]],i.splice(n,1));let c=new THREE[r](o);for(let t=0,n=i.length;t<n;t++){const n=Nasi.getType(c[i[t]]);if("function"===n){"array"===Nasi.getType(e[i[t]])?c[i[t]].apply(this,e[i[t]]):c[i[t]](e[i[t]])}else if("object"===n){const n=Object.keys(c[i[t]]);for(let r=0,o=n.length;r<o;r++)c[i[t]][n[r]]=e[i[t]][n[r]]}else null!=n&&(c[i[t]]=e[i[t]])}}(()=>{const e={};e.ua=r,e.name="Nasi",e.getType=i,e.getDeviceType=o,e.getMobileMacineInfo=c,e.getBrowserInfo=s,e.getGPUInfo=u,e.getDeviceInfo=f,e.createInstance=l,window.Nasi=e})()}]);