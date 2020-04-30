/* globals document */
/**
 * GPUの種類を調べる
 * @param {HTMLElement} element canvasを指定
 * @return {Object}
 * @see 安定しないフレームレートに効果的！WebGLのカクつき対策まとめ(Three.js編) https://ics.media/entry/12930
 * @see ノートパソコンGPUのベンチマークと性能比較 https://btopc-minikan.com/note-gpu-hikaku.html
 * @see GPUベンチマークと性能比較（デスクトップ） https://btopc-minikan.com/gpu-hikaku.html
 * @see WebGL_STATS_WEBGL_debug_renderer_info http://webglstats.com/webgl/extension/WEBGL_debug_renderer_info
 * @see WEBGL_debug_renderer_info_extension_survey_results http://codeflow.org/entries/2016/feb/10/webgl_debug_renderer_info-extension-survey-results/
 * @see Snapdragon・MediaTek・Kirin・Exynos_スマートフォン向けSoC(CPU)の種類と性能比較表、ベンチマーク https://phablet.jp/?p=16254#Snapdragon
 * @see ノート向けCPUの内蔵GPU、インテル_HD_グラフィックス http://www.pasonisan.com/pc-gpu/i-gpu-notepc.html
 * @see Intel_HD_Graphics(Wikipedia) https://ja.wikipedia.org/wiki/Intel_HD_Graphics#Kaby_Lake_R,_Coffee/Whiskey_Lake_-_UHD/Iris_Plus_Graphics_610%EF%BD%9E655
 * @todo gpuデータを取得する関数が非対応のときにエラーを吐くかもしれない(safariやモバイルはまだ見てないです)(99%は行けるらしい)
 * @todo まだデバイス情報が不完全
 */
export default function saveGPUInfo(element) {
  let canvas;
  if (canvas != null) {
    canvas = element;
  } else {
    canvas = document.createElement('canvas');
  }
  let gl;
  let renderer;
  try {
    gl = canvas.getContext('experimental-webgl');
    const ext = gl.getExtension('WEBGL_debug_renderer_info');

    if (!ext) {
      renderer = '';
    } else {
      renderer = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL);
    }
  } catch (e) {
    gl = null;
    renderer = '';
  }

  /**
   * GPUInfoのショートハンド
   * @type {Object}
   * @param {number} spec gpuの性能 0 ~ 4 (0が最高)
   * @param {string} text gpuのデータを小文字にしたもの
   * @param {string} compactText textの空白をすべて消したもの
   */
  const info = {};
  info.originalText = renderer;
  info.text = renderer.toLowerCase();
  info.compactText = info.text.replace(/\s+/g, '');
  info.spec = 2;

  if (info.text.indexOf('intel') !== -1) {
    const number = info.text.match(/[0-9]{3,4}/);
    if (number) {
      // #todo 5300 , なし ,
      // #todo uhd,irisなどでも区別したい?

      // 1000 ~
      const high = [540, 550, 580, 640, 655, 650, 5200, 6200];
      // 850 ~ 999
      const highmiddle = [530, 620, 630, 5600, 6000];
      // 650 ~ 849
      const middle = [520, 615, 5100, 6100];
      // 500 ~ 649
      const middlelow = [460, 510, 515, 610, 615, 4600, 5000, 5500];
      // 0~ 499
      const low = [400, 405, 500, 505, 600, 605, 4000, 4200, 4400];

      if (low.includes(Number(number[0]))) {
        info.spec = 0;
      } else if (middlelow.includes(Number(number[0]))) {
        info.spec = 1;
      } else if (middle.includes(Number(number[0]))) {
        info.spec = 2;
      } else if (highmiddle.includes(Number(number[0]))) {
        info.spec = 3;
      } else if (high.includes(Number(number[0]))) {
        info.spec = 4;
      } else {
        info.spec = 2;
      }

      info.version = Number(number[0]);
    }
  }

  if (info.text.indexOf('geforce') !== -1) {
    const number = info.text.match(/[0-9]{3,4}/);
    if (number) {
      // geforceは基本的に性能が高いのでほぼ1000以上

      info.version = Number(number[0]);

      // #todo titanで反応しそう。。
      info.isGeforceTi = (info.text.indexOf('ti') > -1);

      // 1000 ~
      const high = [];
      // 850 ~ 999
      const highmiddle = [910];
      // 650 ~ 849
      const middle = [710, 820];
      // 500 ~ 649
      const middlelow = [];
      // 0~ 499
      const low = [];

      if (low.includes(Number(number[0]))) {
        info.spec = 0;
      } else if (middlelow.includes(Number(number[0]))) {
        info.spec = 1;
      } else if (middle.includes(Number(number[0]))) {
        info.spec = 2;
      } else if (highmiddle.includes(Number(number[0]))) {
        info.spec = 3;
      } else if (high.includes(Number(number[0]))) {
        info.spec = 4;
      } else {
        info.spec = 4;
      }
    }
  }

  if (info.text.indexOf('radeon') !== -1) {
    const number = info.text.match(/[0-9]{3,4}/);
    if (number) {
      // geforceは基本的に性能が高いのでほぼ1000以上

      // 1000 ~
      const high = [];
      // 850 ~ 999
      const highmiddle = [7770, 250];
      // 650 ~ 849
      const middle = [7750];
      // 500 ~ 649
      const middlelow = [240];
      // 0~ 499
      const low = [];

      if (low.includes(Number(number[0]))) {
        info.spec = 0;
      } else if (middlelow.includes(Number(number[0]))) {
        info.spec = 1;
      } else if (middle.includes(Number(number[0]))) {
        info.spec = 2;
      } else if (highmiddle.includes(Number(number[0]))) {
        info.spec = 3;
      } else if (high.includes(Number(number[0]))) {
        info.spec = 4;
      } else {
        info.spec = 4;
      }
      info.version = Number(number[0]);
    }
  }

  if (info.text.indexOf('adreno') !== -1) {
    // #hint temp
    info.spec = 2;
  }

  // #todo power vrでも反応するのかどうか?
  if (info.text.indexOf('powervr') !== -1) {
    // #hint temp
    info.spec = 2;
  }
  if (info.text.indexOf('mali') !== -1) {
    // #hint temp
    info.spec = 2;
  }

  if (info.spec != null) {
    if (info.spec === 4) {
      info.performance = 'high';
    } else if (info.spec <= 3 && info.spec >= 1) {
      info.performance = 'middle';
    } else if (info.spec === 0) {
      info.performance = 'low';
    } else {
      info.performance = 'unknown';
    }
  }

  info.isIntel = (info.text.indexOf('intel') > -1);
  info.isNvidia = (info.text.indexOf('nvidia') > -1);

  return info;

  // rendeerにintelが含まれている場合は、オンボードのGPU。
  // NVIDIA
  // ex) ANGLE (NVIDIA GeForce GTX 750 Ti Direct3D11 vs_5_0 ps_5_0)
  // ex) ANGLE (NVIDIA GeForce GTX 950 Direct3D9Ex vs_3_0 ps_3_0)
  // ex) ANGLE (NVIDIA GeForce GTX 960 Direct3D11 vs_5_0 ps_5_0)

  // Intel
  // ex) ANGLE (Intel(R) HD Graphics 520 Direct3D11 vs_5_0 ps_5_0)
  // ex) ANGLE (Intel(R) HD Graphics Family Direct3D9Ex vs_3_0 ps_3_0)
  // ex) Intel(R) HD Graphics 4600
  // ex) ANGLE (Intel(R) HD Graphics 4600 Direct3D11 vs_5_0 ps_5_0)
  // ex) ANGLE (Intel(R) HD Graphics Family Direct3D11 vs_5_0 ps_5_0)
  // ex) ANGLE (Intel(R) HD Graphics 4600 Direct3D11 vs_5_0 ps_5_0)
  // ex) ANGLE (Intel(R) HD Graphics Family Direct3D11 vs_5_0 ps_5_0)
  // ex) ANGLE (Intel(R) HD Graphics 5300 Direct3D11 vs_5_0 ps_5_0)
  // ex) ANGLE (Intel(R) HD Graphics 4000 Direct3D11 vs_5_0 ps_5_0)
  // ex) Intel(R) HD Graphics 4400
  // ex) ANGLE (Intel(R) HD Graphics 4000 Direct3D11 vs_5_0 ps_5_0)
  // ex) ANGLE (Intel(R) HD Graphics 4600 Direct3D11 vs_5_0 ps_5_0)

  // PowerVR
  // ex) PowerVR SGX 544MP

  // Adreno
  // ex) Adreno (TM) 405
  // ex) Adreno (TM) 330

  // Radeon
  // ex) ANGLE (ATI Radeon HD 3450 Direct3D9Ex vs_3_0 ps_3_0)
  // ex) AMD Radeon R9 M295X OpenGL Engine

  // Other
  // ex) Microsoft Basic Render Driver
  // ex) Microsoft Basic Render Driver
  // ex) GK20A/AXI
}
