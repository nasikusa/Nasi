/*globals Nasikusa,jQuery */

export default class NasikusaBase {

    constructor(_s) {

        let scope = this;

        /**
         * THREE.Clockのdeltaの値が入ります。
         * @type {number}
         */
        scope.delta;
        /**
         * 全体の設定 - 引数として設定したオブジェクトを格納する
         * @type {Object}
         */
        scope.setting = _s;
        /**
         * 糖衣 : 全体の設定 - 引数として設定したオブジェクトを格納する
         * @type {Object}
         */
        scope.s = _s;

        if (scope.isu(Nasikusa.data)) {

            /**
             * Nasikusa自体の共用オブジェクト
             * @type {Object}
             */
            Nasikusa.data = {};

            /**
             * Nasikusa.dataのエイリアス
             * @type {Object}
             */
            Nasikusa.d = Nasikusa.data;

            scope.initGeneralSetting();
            scope.saveDeviceInfo();
            scope.saveMobileMacineInfo();
            scope.saveBrowserInfo();
            scope.isReadyLibs();
            // #todo グラデーションの数が多くなってきたので、必要なもののみ使う仕組みが必要
            scope.initGradationPresets();

            window.addEventListener("scroll", scope.onScrollGeneral.bind(scope));

        }


    }

    /**
     * 最初にもらった全体の引数のチェックを行う
     * @return {bool} 成功すればtrueを返す
     * @todo いろいろと足りてない
     */
    validateSetting() {

        var scope = this;

        var s = scope.setting;

        if (s.fps == null) console.error("fpsオプションの入力は必須です");
        if (s.renderArea == null) console.error("renderAreaオプションの入力は必須です");

        try {

            // throw new Error("e");

        } catch (e) {

            console.warn("設定のテンプレートはこちらです ( date : 20181014 )");
            console.warn({
                fps: null,
                renderArea: "free",
                renderer: {
                    clearColor: 0xffffff,
                    enableAlpha: true,
                    alpha: 0.0,
                    enableAA: true,
                    gammaOutput: false,
                },
                model: {
                    enabled: true,
                    loader: "gltf",
                    path: "/assets/model/practice/mop2.glb",
                    material: "basic",
                    materialSetting: {
                        enabled: true,
                        color: 0xffffff,
                        side: "FrontSide",
                        transparent: true,
                        opacity: 1.0,
                        polygonOffset: false,
                    },
                },
                modelCamera: {
                    enabled: false,
                    number: 0,
                    disableModelCameraAspect: true,
                    positionAdjustment: {
                        x: 0,
                        y: 0,
                        z: 0,
                    },
                },
                modelMotion: {
                    enabled: false,
                    timescale: 1.0,
                },
                modelMorph: {
                    enabled: false,
                },
                enableRandomColor: true,
                randomColor: [{
                    enabled: true,
                    color: ["#335a59", "#418b8c", "#e8e5dc"],
                    domain: [0, 0.5, 1],
                    mode: "rgb",
                    padding: 0,
                    gamma: 1,
                    enableBezier: false,
                    enableDomain: true,
                    enablePadding: true,
                    enableGamma: true,
                    enableClasses: false,
                    classes: 4,
                    enableSetRGB: [true, true, true],
                    enableSetCMYK: [true, true, true, true],
                    enableSetHSL: [true, true, true],
                    setrgb: ["+0.0", "+0.0", "+0.0"],
                    sethsl: ["+0.0", "+0.0", "+0.0"],
                    setcmyk: ["+0.0", "+0.0", "+0.0", "+0.0"],
                    enableMix: false,
                    enableBlend: false,
                    mix: ["#ffffff", 0.5, "rgb"],
                    blend: ["#ffffff", "overlay"],
                    setDisableList: [],
                    customClasses: [],
                }, ],
                size: {
                    type: "fixedAspect",
                    width: 100,
                    height: 100,
                    aspect: 1,
                },
                camera: {
                    type: "perspective",
                    position: {
                        x: 0,
                        y: 3.17,
                        z: 0,
                    },
                    rotation: {
                        enabled: false,
                        x: 0,
                        y: 0,
                        z: 0,
                    },
                    lookAt: {
                        enabled: true,
                        x: 0,
                        y: 0,
                        z: 0,
                    },
                    fov: 35,
                    near: 0.1,
                    far: 100,
                    orthoZoom: 10,
                    perspectiveZoom: 1,
                },
                controls: {
                    enabled: false,
                    type: "orbit",
                    orbitSetting: {
                        listener: "DOM",
                        preset: "",
                        maxAzimuthAngle: Infinity,
                        minAzimuthAngle: -Infinity,
                        minPolarAngle: 0,
                        maxPolarAngle: Math.PI,
                        enableDamping: false,
                        dampingFactor: 1.0,
                        enablePan: true,
                        enableRotate: true,
                        rotateSpeed: 1.0,
                        enableZoom: true,
                        screenSpacePanning: true,
                        autoRotate: false,
                        autoRotateSpeed: 2.0,
                        target: [0, 0, 0],
                    },
                },
                ev: {
                    beforeRender: false,
                    afterRender: true,
                    show: {
                        breakPoint: 0.5,
                        breakPointType: "ratio",
                        breakTarget: "window",
                    },
                    click: {
                        clickArea: "DOM",
                    },
                    hover: {
                        hoverArea: "DOM",
                    },
                },
                backImage: {
                    enabled: false,
                    type: "css",
                    src: "./back.jpg",
                    size: "cover",
                },
                console: {
                    enabled: true,
                    all: false,
                    model: true,
                    setting: false,
                    scope: true,
                    rect: true,
                    animation: true,
                    morph: true,
                    loadTime: false,
                    camera: true,
                },
                datgui: {
                    enabled: true,
                    effect: true,
                    position: false,
                    preset: 1,
                },
                effect: false,
                effectName: [{
                    name: "BrightnessContrastShader",
                    enabled: false,
                    uniforms: [{
                        name: "brightness",
                        param: 0.04,
                    }, {
                        name: "contrast",
                        param: -0.01,
                    }],
                }, {
                    name: "HueSaturationShader",
                    enabled: false,
                    uniforms: [{
                        name: "hue",
                        param: 0.00,
                    }, {
                        name: "saturation",
                        param: 0.27,
                    }],
                }, {
                    name: "LevelShader",
                    enabled: false,
                    uniforms: [{
                        name: "minInput",
                        param: 0.06,
                    }, {
                        name: "gamma",
                        param: 2.01,
                    }, {
                        name: "maxInput",
                        param: 0.93,
                    }],
                }, {
                    name: "CopyShader",
                    enabled: true,
                    uniforms: [],
                }],
            });

        }

        return true;

    }

    /**
     * init関数の初期化
     * @return {void}
     */
    updateNullSetting() {
        var scope = this;

        /**
         * 設定用のオブジェクトを格納しておく変数(文字数を減らすためにs一文字にしてます)
         * @type {Object}
         */
        var s = scope.setting;

        //レンダラー
        s.renderer = s.renderer || {};
        //シーン
        s.scene = s.scene || {};
        s.scene.fog = s.scene.fog || {};
        // カメラ
        s.camera = s.camera || {};
        s.camera.position = s.camera.position || {};
        s.camera.rotation = s.camera.rotation || {};
        s.camera.lookAt = s.camera.lookAt || {};
        // コントロール
        s.controls = s.controls || {};
        // モデルカメラ
        s.modelCamera = s.modelCamera || {};
        s.modelCamera.positionAdjustment = s.modelCamera.positionAdjustment || {};
        //モデルモーション
        s.modelMotion = s.modelMotion || {};
        // サイズ
        s.size = s.size || {};
        // 背景画像
        s.backImage = s.backImage || {};
        //イベント
        s.event = s.event || {};
        s.event.show = s.event.show || {};
        // モデル
        s.model = s.model || {};
        s.model.materialSetting = s.model.materialSetting || {};
        s.model.randomColor = s.model.randomColor || {};
        // ランダムカラー
        s.randomColor = s.randomColor || {};
        // コンソール設定
        s.console = s.console || {};
        // datgui
        s.datgui = s.datgui || {};
        // ar
        s.ar = s.ar || {};
        // テキスト
        s.text = s.text || {};

        // temp
        s.nameme = s.nameme || {};

    }

    /**
     * Nasikusa.jsの全体の設定をここで行う
     *
     */
    initGeneralSetting() {

        Nasikusa.data.scroll = {};

    }

    onScrollGeneral() {

        Nasikusa.data.scroll.top = window.pageYOffset || document.documentElement.scrollTop;

    }

    /**
     * 他ライブラリがあるかどうかを確認するメソッド
     * @return {void}
     */
    isReadyLibs() {

        Nasikusa.data.isReadyLibs = {};
        let opt = Nasikusa.data.isReadyLibs;

        opt.jQuery = (typeof jQuery !== "undefined") ? true : false;
        opt.TweenMax = (typeof TweenMax !== "undefined") ? true : false;
        opt.TweenLite = (typeof TweenLite !== "undefined" && typeof TweenMax === "undefined") ? true : false;
        opt.TimelineMax = (typeof TimelineMax !== "undefined") ? true : false;
        opt.TimelineLite = (typeof TimelineLite !== "undefined" && typeof TimelineMax === "undefined") ? true : false;
        opt.Tween = (typeof TWEEN !== "undefined") ? true : false;
        opt.chroma = (typeof chroma !== "undefined") ? true : false;
        opt.Granim = (typeof Granim !== "undefined") ? true : false;

    }

    /**
     * Tweenアニメーションのライブラリを取得する
     * @return {string}
     */
    getTweenLibName() {

        let opt = Nasikusa.data.isReadyLib;

        if (opt.TweenMax) {
            return "TweenMax";
        } else if (opt.TweenLite) {
            return "TweenLite";
        } else if (opt.Tween) {
            return "Tween";
        } else {
            return "none";
        }

    }

    /**
     * chroma.jsの準備が出来ているか?
     * @return {bool}
     */
    isReadyChroma() {

        return (Nasikusa.data.isReadyLibs.chroma) ? true : false;

    }

    /**
     * Granim.jsの準備が出来ているか?
     * @return {bool}
     */
    isReadyGranim() {

        return (Nasikusa.data.isReadyLibs.Granim) ? true : false;

    }

    /**
     * jQueryの準備が出来ているか
     * @return {bool}
     */
    isReadyjQuery() {

        return (Nasikusa.data.isReadyLibs.jQuery) ? true : false;

    }


    /**
     * スマホかタブレットかその他かを判別する
     * @return {void} [description]
     * @hint タッチイベント or マウスイベントとか、コントローラー側の挙動の管理、deviceOrientationとか
     */
    saveDeviceInfo() {

        var ua = navigator.userAgent.toLowerCase();
        if (ua.indexOf("iphone") > 0 || ua.indexOf("ipod") > 0 || ua.indexOf("android") > 0 && ua.indexOf("mobile") > 0) {
            Nasikusa.data.devie = "sp";
        } else if (ua.indexOf("ipad") > 0 || ua.indexOf("android") > 0) {
            Nasikusa.data.device = "tab";
        } else {
            Nasikusa.data.device = "other";
        }

    }

    /**
     * モバイルのデバイスの機種を判別してscopeの変数に格納する
     * @return {void} [description]
     */
    saveMobileMacineInfo() {

        var ua = window.navigator.userAgent.toLowerCase();

        if (ua.indexOf("iphone") !== -1) {
            Nasikusa.data.mobileMacine = "iphone";
        } else if (ua.indexOf("ipad") !== -1) {
            Nasikusa.data.mobileMacine = "ipad";
        } else if (ua.indexOf("android") !== -1) {
            if (ua.indexOf("mobile") !== -1) {
                Nasikusa.data.mobileMacine = "android_sp";
            } else {
                Nasikusa.data.mobileMacine = "android_tab";
            }
        } else {
            Nasikusa.data.mobileMacine = "other";
        }

    }

    /**
     * 端末がiPhoneかiPadであるかどうか
     * @return {bool}
     */
    isMobileAppleDevice() {
        return (["iphone", "ipad"].includes(Nasikusa.data.mobileMacine)) ? true : false;
    }

    /**
     * 端末がiPhoneであるかどうか
     * @return {bool}
     */
    isiPhone() {
        return (Nasikusa.data.mobileMacine === "iphone") ? true : false;
    }

    /**
     * 端末がAndroid(タブレットorスマホ)であるかどうか
     * @param {string} type (bot|sp|tab)
     * @return {bool}
     */
    isAndroid(type = "both") {

        if (type === "both") {

            return (["android_sp", "android_tab"].includes(Nasikusa.data.mobileMacine)) ? true : false;

        } else if (type === "sp") {

            return Nasikusa.data.mobileMacine === "android_sp";

        } else if (type === "tab") {

            return Nasikusa.data.mobileMacine === "android_tab";

        }

    }

    /**
     * 現在のブラウザを判定してscopeの変数に格納する
     * @return {void}
     * @todo Androidブラウザ
     */
    saveBrowserInfo() {

        var ua = window.navigator.userAgent.toLowerCase();

        if (ua.indexOf("msie") !== -1 || ua.indexOf("trident") !== -1) {

            Nasikusa.data.browser = "ie";

        } else if (ua.indexOf("edge") !== -1) {

            Nasikusa.data.browser = "edge";

        } else if (ua.indexOf("chrome") !== -1) {

            Nasikusa.data.browser = "chrome";

        } else if (ua.indexOf("safari") !== -1) {

            Nasikusa.data.browser = "safari";

        } else if (ua.indexOf("firefox") !== -1) {

            Nasikusa.data.browser = "firefox";

        } else if (ua.indexOf("opera") !== -1) {

            Nasikusa.data.browser = "opera";

        } else {

            Nasikusa.data.browser = "other";

        }

    }

    /**
     * ブラウザがIEであるかどうか
     *
     */
    isIE() {

        return (Nasikusa.data.browser === "ie") ? true : false;

    }

    /**
     * IEのバージョンが10以下であるかどうか
     * @return {bool}
     */
    isOlderThanIE11() {

        let scope = this;
        let ua = window.navigator.userAgent.toLowerCase();

        if (scope.isIE) {

            if (ua.indexOf("trident") !== -1) {
                return false;
            }

            return true;

        } else {
            return false;
        }

    }

    /**
     * 使用ブラウザがIE11であるかどうか
     * @return {bool}
     */
    isIE11() {
        let ua = window.navigator.userAgent.toLowerCase();
        if (ua.indexOf("trident") !== -1) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * GPUの種類を調べる
     * @return {void}
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
    saveGPUInfo() {

        const CANVAS = this.canvasElement;

        let gl;
        let renderer;
        try {
            gl = CANVAS.getContext("experimental-webgl");

            //ドライバー情報を取得
            const ext = gl.getExtension("WEBGL_debug_renderer_info");

            if (!ext) {
                renderer = "";
            } else {
                renderer = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL);
            }
        } catch (e) {
            // WebGL未対応の場合
            gl = null;
            renderer = "";
        }
        // ドライバの種類を出力
        Nasikusa.data.GPUInfo = {};

        /**
         * GPUInfoのショートハンド
         * @type {Object}
         * @param {number} spec gpuの性能 0 ~ 4 (0が最高)
         * @param {string} text gpuのデータを小文字にしたもの
         * @param {string} compactText textの空白をすべて消したもの
         */
        let info = Nasikusa.data.GPUInfo;
        info.originalText = renderer;
        info.text = renderer.toLowerCase();
        info.compactText = Nasikusa.data.GPUInfo.text.replace(/\s+/g, "");
        info.spec = 2;

        // #todo 対応したいgpu(主にスマホ)
        // adreno,mali,powervr(iphone7 before),a11bionic?(apple,iphonex,8)

        if (info.text.indexOf("intel") !== -1) {

            let number = info.text.match(/[0-9]{3,4}/);
            if (number) {

                // #todo 5300 , なし ,
                // #todo uhd,irisなどでも区別したい?

                // 1000 ~
                let high = [540, 550, 580, 640, 655, 650, 5200, 6200];
                // 850 ~ 999
                let highmiddle = [530, 620, 630, 5600, 6000];
                // 650 ~ 849
                let middle = [520, 615, 5100, 6100];
                // 500 ~ 649
                let middlelow = [460, 510, 515, 610, 615, 4600, 5000, 5500];
                // 0~ 499
                let low = [400, 405, 500, 505, 600, 605, 4000, 4200, 4400];

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

        if (info.text.indexOf("geforce") !== -1) {

            let number = info.text.match(/[0-9]{3,4}/);
            if (number) {

                // geforceは基本的に性能が高いのでほぼ1000以上

                info.version = Number(number[0]);

                // #todo titanで反応しそう。。
                info.isGeforceTi = (info.text.indexOf("ti") > -1) ? true : false;

                // 1000 ~
                let high = [];
                // 850 ~ 999
                let highmiddle = [910];
                // 650 ~ 849
                let middle = [710, 820];
                // 500 ~ 649
                let middlelow = [];
                // 0~ 499
                let low = [];

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

        if (info.text.indexOf("radeon") !== -1) {

            let number = info.text.match(/[0-9]{3,4}/);
            if (number) {

                // geforceは基本的に性能が高いのでほぼ1000以上

                // 1000 ~
                let high = [];
                // 850 ~ 999
                let highmiddle = [7770, 250];
                // 650 ~ 849
                let middle = [7750];
                // 500 ~ 649
                let middlelow = [240];
                // 0~ 499
                let low = [];

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

        if (info.text.indexOf("adreno") !== -1) {
            // #hint temp
            info.spec = 2;
        }

        // #todo power vrでも反応するのかどうか?
        if (info.text.indexOf("powervr") !== -1) {
            // #hint temp
            info.spec = 2;
        }
        if (info.text.indexOf("mali") !== -1) {
            // #hint temp
            info.spec = 2;
        }

        if (this.isd(info.spec)) {

            // 4
            info.isLow = (info.spec === 4) ? true : false;
            // 3
            info.isMiddleLow = (info.spec === 3) ? true : false;
            // 1 ~ 3
            info.isMiddleArea = (info.spec <= 3 && info.spec >= 1) ? true : false;
            // ~ 2
            info.isUpperMiddle = (info.spec <= 2) ? true : false;
            // 3 ~
            info.isLowerMiddleLow = (info.spec >= 3) ? true : false;

            if (info.spec === 0) {
                info.performance = "high";
            } else if (info.spec <= 3 && info.spec >= 1) {
                info.performance = "middle";
            } else if (info.spec === 4) {
                info.performance = "low";
            } else {
                info.performance = "unknown";
            }

        }

        info.isIntel = (info.text.indexOf("intel") > -1) ? true : false;
        info.isNvidia = (info.text.indexOf("nvidia") > -1) ? true : false;


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


    /**
     * 様々な分布のランダムの値を生成する
     * @param  {string} type  random(r|simple|0) | add(a|1) | multiply(m|2) | pow2(p2|3) | pow3(p3|4) | pow4(p4|5) | normal(n|6) | sqrt(s|7)
     * @param  {object} _s 設定用のオブジェクト
     * @return {number}
     * @see JavaScript開発に役立つ重要なランダムの数式まとめ1ページ目 https://ics.media/entry/11292
     * @see JavaScript開発に役立つ重要なランダムの数式まとめ2ページ目 https://ics.media/entry/11292/2
     *
     * _sについての詳細
     * @type {Object} _s
     * @param {bool} _s.invert(_s.i)  ランダム値を反転させるか
     * @param {number} _s.console(_s.c)  コンソールに値を表示させるか
     * @param {number} _s.min(_s.n)  ランダム値の最小値
     * @param {number} _s.max(_s.x)  ランダム値の最大値
     * @param {bool} _s.recalculate(_s.r)  最低値より小さかったり最大値よりも大きかった場合に、再度計算するか
     * @param {number} _s.minusMode(_s.m)  マイナスの値も出力できるようにする( 0 : -1から1の間 , 1 : -0.5から0.5の間 , 2 : -1から0の間 )
     *
     */
    random(type, _s) {

        var scope = this;

        // ランダム値が入る
        var rand;
        // 結果が入る
        var res;
        // ランダムのタイプ
        var randomType;

        if (_s == null) {
            _s = {};
        }

        // エイリアス|ショートカット
        if (_s.n != null && _s.min == null) _s.min = _s.n;
        if (_s.x != null && _s.max == null) _s.max = _s.x;
        if (_s.c != null && _s.console == null) _s.console = _s.c;
        if (_s.i != null && _s.invert == null) _s.invert = _s.i;
        if (_s.r != null && _s.recalculate == null) _s.recalculate = _s.r;
        if (_s.m != null && _s.minusMode == null) _s.minusMode = _s.m;

        randomType = type;
        // @desc タイプのショートカット
        if (type === "r" || type === "simple" || randomType === 0) randomType = "random";
        if (type === "a" || type === 1) randomType = "add";
        if (type === "m" || type === 2) randomType = "multiply";
        if (type === "p2" || type === 3) randomType = "pow2";
        if (type === "p3" || type === 4) randomType = "pow3";
        if (type === "p4" || type === 5) randomType = "pow4";
        if (type === "s" || type === 6) randomType = "sqrt";
        if (type === "n" || type === 7) randomType = "normal";

        var r;
        switch (randomType) {
            case "add":
                rand = (Math.random() + Math.random()) / 2;
                break;
            case "multiply":
                rand = Math.random() * Math.random();
                break;
            case "pow2":
                r = Math.random();
                rand = r * r;
                break;
            case "pow3":
                r = Math.random();
                rand = r * r * r;
                break;
            case "pow4":
                r = Math.random();
                rand = r * r * r * r;
                break;
            case "sqrt":
                rand = Math.sqrt(Math.random());
                break;
            case "normal":
                var value;
                while (true) {
                    value = this.calcNormal();
                    if (0 <= value && value < 1) {
                        break;
                    }
                }
                rand = value;
                break;
            case "random":
                rand = Math.random();
                break;
            default:
                rand = Math.random();
                break;
        }

        res = rand;

        if (_s.invert != null && _s.invert === true) res = (1 - res);
        if (_s.recalculate == null || _s.recalculate === false) {
            if (_s.min != null) res = Math.max(res, _s.min);
            if (_s.max != null) res = Math.min(res, _s.max);
        } else {

            /**
             * 再計算用の設定オブジェクト。もともとの設定オブジェクトをハードコピーしている。
             * @type {Object}
             * @see ES6のObject.assignがシャローコピーなのでディープコピーする方法を考える https://kuroeveryday.blogspot.com/2017/05/deep-clone-object-in-javascript.html
             */
            var setObject = JSON.parse(JSON.stringify(_s));
            // @desc 設定の追加。検証用の場合は再計算させない(ループしすぎるので)
            setObject.recalculate = false;
            // @desc 設定の追加。検証用の場合はコンソールに表示させない。
            setObject.console = false;
            // @desc マイナスモードを禁止する(mもnullにしないと置換されてしまうので注意)
            setObject.minusMode = null;
            setObject.m = null;

            if (_s.min != null && _s.max != null) {

                // @hint >=の=が必須
                while (res >= _s.max || res <= _s.min) {
                    res = scope.random.call(scope, randomType, setObject);
                }
            } else if (_s.min != null) {
                while (res <= _s.min) {
                    res = scope.random.call(scope, randomType, setObject);
                }
            } else if (_s.max != null) {
                while (res >= _s.max) {
                    res = scope.random.call(scope, randomType, setObject);
                }
            }

        }

        if (_s.minusMode != null) {

            if (_s.minusMode === 0 || _s.minusMode === "-1to1") {
                res = (2 * res) - 1;
            } else if (_s.minusMode === 1 || _s.minusMode === "-0.5to0.5") {
                res = (res) - 0.5;
            } else if (_s.minusMode === 2 || _s.minusMode === "-1to0") {
                res = -res;
            }

        }

        if (_s.console != null && _s.console === true) console.log(res);

        return res;

    }

    /**
     * random関数のエイリアス
     * @return {number}
     */
    r(type, _s) {
        return this.random(type, _s);
    }


    calcNormal() {
        var r1 = Math.random();
        var r2 = Math.random();
        var value = Math.sqrt(-2.0 * Math.log(r1)) * Math.sin(2.0 * Math.PI * r2);
        value = (value + 3) / 6;
        return value;
    }

    /**
     * 型判定のための関数
     * @param  {number|string|object|Array|null|undefined|bool|NaN} object
     * @return {string}
     * @see JavaScriptの型などの判定いろいろ https://qiita.com/amamamaou/items/ef0b797156b324bb4ef3
     * @see JavaScriptの「型」の判定について https://qiita.com/south37/items/c8d20a069fcbfe4fce85
     * @todo isNaN function is not working in IE11.
     */
    getType(object) {

        var toString = Object.prototype.toString;
        var type = toString.call(object).slice(8, -1).toLowerCase();
        if (type === "number") {

            if (Number.isNaN(object)) {
                return "NaN";
            }
        }
        return type;

    }

    /**
     * isu関数のエイリアスです。undefinedであるかどうかの判定。
     * @param  {any}  object
     * @return {bool}
     */
    isUndefined(object) {

        return this.isu(object);

    }

    /**
     * isd関数のエイリアスです。undefinedであるかどうかの判定。
     * @param  {any}  object
     * @return {bool}
     */
    isDefined(object) {

        return this.isd(object);

    }

    /**
     * 対象がundefinedであるかどうか判定する
     * @param  {Object|Array|bool etc} object
     * @return {bool}
     *
     * @see どの場面でどのundefined判定を使うか https://qiita.com/ukyo/items/8b8382a5ee4baa6123e7
     */
    isu(object) {
        return object === undefined || object === null;
    }

    /**
     * 対象がundefinedであるかどうか判定する
     * @param  {Object|Array|bool etc} object
     * @return {bool}
     */
    isd(object) {
        return object !== undefined && object !== null;
    }

    /**
     * trueであるかどうかを取得する
     * @param  {any} val
     * @return {bool}
     */
    ist(val) {
        return val === true;
    }

    isTrue(val) {
        return val === true;
    }

    /**
     * falseであるかどうかを取得する
     * @param  {any} val
     * @return {bool}
     */
    isf(val) {
        return val === false;
    }

    isFalse(val) {
        return val === false;
    }

    /**
     * 配列からランダムな要素を取得する。複数の場合は同じ要素の可能性もある。
     * @param  {Array} array
     * @param {number} num ほしい個数を選択する( default : 1 )
     * @param {bool} isDelete 取得したあとに配列の値を削除するか?
     * @param {bool} isForceMaxDelete 配列の数がnumより小さくてもエラーを起こさず、配列の数分だけ値を取得するか?
     * @return {any} numが2以上の場合は確定で配列
     */
    getRandomItemFromArray(array, num = 1, isDelete = false, isForceMaxDelete = false, isVirtualDelete = false) {

        var scope = this;

        if (scope.ist(isVirtualDelete)) {
            var virtualDeleteArray = [];
        }

        if (num === 1) {
            let n = Math.floor(Math.random() * array.length);
            let res = array[n];
            if (scope.ist(isDelete) && scope.isf(isVirtualDelete)) {
                array.splice(n, 1);
            } else if (scope.ist(isDelete) && scope.ist(isVirtualDelete)) {
                virtualDeleteArray.push(n);
            }
            return res;
        } else {

            var resArray = [];


            if (isDelete === true && array.length < num && isForceMaxDelete === false) {
                console.error("getRandomItemFromArray関数の配列の長さが足りません。isDeleteをfalseにするか、array or num の数を減らしてください。");
                return;
            } else if (isForceMaxDelete === true && isDelete === true) {
                num = array.length;
            }

            for (let i = 0; i < num; i++) {

                let n = Math.floor(Math.random() * array.length);
                if (scope.ist(isVirtualDelete)) {
                    while (virtualDeleteArray.includes(n)) {
                        n = Math.floor(Math.random() * array.length);
                    }
                }

                resArray.push(array[n]);
                if (scope.ist(isDelete) && scope.isf(isVirtualDelete)) {
                    array.splice(n, 1);
                } else if (scope.ist(isDelete) && scope.ist(isVirtualDelete)) {
                    virtualDeleteArray.push(n);
                }

            }
            return resArray;
        }
    }

    /**
     * 配列をシャッフルして返す
     * @param  {Array} array
     * @return {Array}
     */
    getShuffledArray(array) {

        for (let i = array.length - 1; i > 0; i--) {
            let r = Math.floor(Math.random() * (i + 1));
            let tmp = array[i];
            array[i] = array[r];
            array[r] = tmp;
        }

        return array;

    }

    /**
     * 重複を含む配列の管理を行う関数
     * @param  {Array} array
     * @param  {string} type
     * @return {Array}
     * @see 配列の重複をはじく、もしくは重複を取り出す https://qiita.com/cocottejs/items/7afe6d5f27ee7c36c61f
     * @todo 若干バギー(返す配列のデータがおかしくなる)
     */
    manageArrayDuplication(array, type) {

        let resArray = [];

        switch (type) {
            case "WithoutDuplication":
                resArray = array.filter(function(x, i, self) {
                    return self.indexOf(x) === i;
                });
                break;
            case "Duplication":
                resArray = array.filter(function(x, i, self) {
                    return self.indexOf(x) !== self.lastIndexOf(x);
                });
                break;
            case "Remove":
                resArray = array.filter(function(x, i, self) {
                    return self.indexOf(x) === i && i !== self.lastIndexOf(x);
                });
                break;
        }

        return resArray;

    }

    /**
     * 配列をシャッフルして、要素を取得する
     * @param {Array} array
     * @return {Array|string}
     *
     * _sについての詳細
     * @param {number} num ほしい個数 ( %,-,/も可能 )
     * @param {bool} isSingleBool 1つのときにstringとして返すか
     * @param {bool} isShuffle シャッフルするか
     * @param {number} offset オフセット
     *
     */
    getArray(array, _s) {

        let scope = this;

        if (scope.ist(_s.isShuffle)) {

            for (let i = array.length - 1; i > 0; i--) {
                let r = Math.floor(Math.random() * (i + 1));
                let tmp = array[i];
                array[i] = array[r];
                array[r] = tmp;
            }

        }

        let resArray = [];
        if (scope.isd(_s.num)) {

            // #hint string型の場合は_s.numに数字に変換した値を入れる
            if (scope.getType(_s.num) === "string") {

                if (_s.num.charAt(_s.num.length - 1) === "%") {
                    _s.num = Math.floor(array.length * (_s.num.slice(0, _s.num.length - 1) / 100));
                } else if (_s.num.charAt(0) === "-") {
                    _s.num = array.length - Number(_s.num.slice(1, _s.num.length));
                } else if (_s.num.charAt(0) === "/") {
                    _s.num = Math.floor(array.length / Number(_s.num.slice(1, _s.num.length)));
                }

            }

            for (let i = 0; i < _s.num; i++) {
                let offsetNum = 0;
                if (scope.isd(_s.offset)) {
                    offsetNum = _s.offset;
                }
                resArray.push(array[i + offsetNum]);
            }

        } else {
            resArray = array;
        }

        if (resArray.length === 1 && scope.ist(_s.isSingleBool)) {
            return resArray[0];
        } else {
            return resArray;
        }

    }

    /**
     * 塊の配列を返す
     * @param {number} num (%,/,-も可能) 一つの配列の長さ
     * @param {bool} separateRest 余りを別配列にするか ( デフォルトはfalse )
     * @param {bool} isShuffle シャッフルするか
     * @return {Array}
     */
    getChunkedArray(array, _s) {

        var scope = this;

        var resArray = [];

        if (scope.ist(_s.isShuffle)) {

            for (let i = array.length - 1; i > 0; i--) {
                let r = Math.floor(Math.random() * (i + 1));
                let tmp = array[i];
                array[i] = array[r];
                array[r] = tmp;
            }

        }

        // #hint string型の場合は_s.numに数字に変換した値を入れる
        if (scope.getType(_s.num) === "string") {
            if (_s.num.charAt(_s.num.length - 1) === "%") {
                _s.num = Math.floor(array.length * (_s.num.slice(0, _s.num.length - 1) / 100));
            } else if (_s.num.charAt(0) === "-") {
                _s.num = array.length - Number(_s.num.slice(1, _s.num.length));
            } else if (_s.num.charAt(0) === "/") {
                _s.num = Math.floor(array.length / Number(_s.num.slice(1, _s.num.length)));
            }
        }

        let restNum = array.length % _s.num;
        let chunkNum = (array.length - restNum) / _s.num;
        if (_s.separateRest && restNum !== 0) {
            chunkNum++;
        }
        for (let i = 0; i < chunkNum; i++) {

            let arrayLength;
            if (i === chunkNum - 1) {
                if (_s.separateRest && restNum !== 0) {
                    arrayLength = restNum;
                } else {
                    arrayLength = _s.num + restNum;
                }
            } else {
                arrayLength = _s.num;
            }

            resArray.push(scope.getArray(array, {
                num: arrayLength,
                offset: i * _s.num,
            }));

        }

        return resArray;


    }

    /**
     * いろいろな種類の書き方の数字文字を計算する
     * @param  {[type]} num [description]
     * @return {[type]}     [description]
     * @todo 四捨五入、切り捨て、切り上げ
     */
    getCalcStrNum(num, length) {

        if (this.getType(num) === "string") {

            if (num.charAt(num.length - 1) === "%") {
                num = Math.floor(length * (num.slice(0, num.length - 1) / 100));
            } else if (num.charAt(0) === "-") {
                num = length - Number(num.slice(1, num.length));
            } else if (num.charAt(0) === "/") {
                num = Math.floor(length / Number(num.slice(1, num.length)));
            }

        }

        return num;

    }

    isNum(n) {

        return !isNaN(parseFloat(n)) && isFinite(n);

    }

    /**
     *
     * @param  {Array} array
     * @return {Object|number}
     * @todo まだ未完成
     */
    getMathInfo(array, type = "all") {

        if (!Array.isArray(array)) {
            console.error("getMathInfo関数にarrayでない対象が入っています");
            return;
        }

        /**
         * 結果が格納されるオブジェクト
         * @type {Object}
         */
        let resObj = {
            sum: 0,
            min: array[0],
            max: array[0],
            average: 0,
            intAverage: 0,
            median: 0,
        };

        for (let i = 0, l = array.length; i < l; i++) {

            resObj.sum += array[i];

            if (type === "all" || type === "min") {
                resObj.min = Math.min(resObj.min, array[i]);
            }
            if (type === "all" || type === "max") {
                resObj.max = Math.max(resObj.max, array[i]);
            }


        }

        if (type === "average" || type === "all") resObj.average = resObj.sum / array.length;
        if (type === "intAverage" || type === "all") resObj.intAverage = Math.floor(resObj.average);

        switch (type) {
            case "all":
                return resObj;
            case "sum":
                return resObj.sum;
            case "min":
                return resObj.min;
            case "max":
                return resObj.max;
            case "average":
                return resObj.average;
            case "intAverage":
                return resObj.intAverage;
            case "median":
                return resObj.median;
        }

    }

    /**
     * RGBからHSLに変換する
     * @return {Array}
     * @param {Array}
     */
    rgb2hsl(rgb, type) {

        var scope = this;

        var r = rgb[0] / 255;
        var g = rgb[1] / 255;
        var b = rgb[2] / 255;

        var max = Math.max(r, g, b);
        var min = Math.min(r, g, b);
        var diff = max - min;

        var h = 0;
        var l = (max + min) / 2;
        var s = diff / (1 - (Math.abs(max + min - 1)));


        switch (min) {
            case max:
                h = 0;
                break;
            case r:
                h = (60 * ((b - g) / diff)) + 180;
                break;
            case g:
                h = (60 * ((r - b) / diff)) + 300;
                break;
            case b:
                h = (60 * ((g - r) / diff)) + 60;
                break;
        }

        if (scope.isUndefined(type)) {
            return [h, s, l];
        } else if (type === "h") {
            return h;
        } else if (type === "s") {
            return s;
        } else if (type === "l") {
            return l;
        }

    }

    /**
     * HSLをRGBに変換する
     * @param  {Array} hsl
     * @return {Array}
     *
     * hslについての詳細
     * @type {Array} hsl
     * @param {number} hsl[0] 0~1
     * @param {number} hsl[1] 0~1
     * @param {number} hsl[2] 0~1
     */
    hsl2rgb(hsl) {

        var h = hsl[0];
        var s = hsl[1];
        var l = hsl[2];

        var max = l + (s * (1 - Math.abs((2 * l) - 1)) / 2);
        var min = l - (s * (1 - Math.abs((2 * l) - 1)) / 2);

        var rgb;
        var i = parseInt(h / 60);

        switch (i) {
            case 0:
            case 6:
                rgb = [max, min + (max - min) * (h / 60), min];
                break;

            case 1:
                rgb = [min + (max - min) * (120 - h / 60), max, min];
                break;

            case 2:
                rgb = [min, max, min + (max - min) * (h - 120 / 60)];
                break;

            case 3:
                rgb = [min, min + (max - min) * (240 - h / 60), max];
                break;

            case 4:
                rgb = [min + (max - min) * (h - 240 / 60), min, max];
                break;

            case 5:
                rgb = [max, min, min + (max - min) * (360 - h / 60)];
                break;
        }

        return rgb.map(function(value) {
            return value * 255;
        });

    }

    /**
     * クリップボードにコピーする (dat.gui.jsとのセットで主に使用)
     * @param  {string} string コピーする文字
     * @return {bool}        コピーできたかどうか
     */
    execCopy(string) {
        var t = document.createElement("div");

        t.appendChild(document.createElement("pre")).textContent = string;

        var s = t.style;
        s.position = "fixed";
        s.left = "-100%";

        document.body.appendChild(t);
        document.getSelection().selectAllChildren(t);

        var result = document.execCommand("copy");

        document.body.removeChild(t);
        return result;
    }

    /**
     * コンソールに情報を表示する
     * @return {bool} コンソール表示が成功したかどうかを bool で返す。
     */
    consoleInfo() {

        var scope = this;

        if (scope.setting.console.enabled) {

            var cs = scope.setting.console;

            // rect
            if (cs.rect || cs.all) {
                scope.canvasRect = scope.setting.renderArea.getBoundingClientRect();
                console.log(scope.canvasRect);
            }
            // 設定
            if (cs.setting || cs.all) {
                console.log(scope.setting);
            }
            // シーン
            if (cs.scene || cs.all) {
                console.log(scope.scene);
            }
            // scope ( this )
            if (cs.scope || cs.all) {
                console.log(scope);
            }
            // カメラ
            if (cs.camera || cs.all) {
                console.log(scope.camera);
            }
            // モデルカメラ
            if (cs.modelCamera || cs.all) {
                if (scope.setting.model.loader === "gltf" && scope.gltf.cameras.length > 0) {
                    console.log(scope.gltf.cameras);
                }
                if (scope.setting.model.loader === "fbx" && scope.fbx.animations.length > 0) {
                    // console.log( scope.fbx.animations );
                }
            }
            // モデル
            if (cs.model || cs.all) {
                if (scope.model != null) {
                    console.log(scope.model);
                }
            }
            // アニメーション
            if (cs.animation || cs.all) {
                if (scope.setting.model.loader === "gltf" && scope.gltf.animations.length > 0) {
                    console.log(scope.gltf.animations);
                }
                if (scope.setting.model.loader === "fbx" && scope.fbx.animations.length > 0) {
                    console.log(scope.fbx.animations);
                }
            }
            // morph
            if (cs.morph || cs.all) {

            }

            return true;

        }

        return false;

    }

    /**
     * JSON API を使用して簡単なディープコピーを行う
     * @return {Object} clone
     * @param {string} type ( json | forin | extend | history )
     * @see [JavaScript]色々なディープコピー https://qiita.com/knhr__/items/d7de463bf9013d5d3dc0
     * @todo isNan function is not working in IE11
     */
    static createClone(obj, type) {


        function getType() {
            var toString = Object.prototype.toString;
            var type = toString.call(obj).slice(8, -1).toLowerCase();
            if (type === "number") {
                if (Number.isNaN(obj)) {
                    return "NaN";
                }
            }
            return type;
        }
        let clone;
        if (type === "json") {

            clone = JSON.parse(JSON.stringify(obj));

        } else if (type === "forin") {

            clone = {};
            for (var name in obj) {
                if (getType(obj[name]) === "object") {
                    clone[name] = NasikusaBase.createClone(obj[name]);
                } else {
                    clone[name] = obj[name];
                }
            }
        } else if (type === "extend") {

            if (Nasikusa.data.isReadyLibs.jQuery) {

                clone = jQuery.extend(true, {}, obj);

            } else {

                console.error("createClone extend require jquery");

            }

        } else if (type === "history") {

            const currentState = window.history.state;
            window.history.replaceState(obj, null);

            clone = window.history.state;
            window.history.replaceState(currentState, null);

        }

        return clone;


    }


    initGradationPresets() {

        var scope = this;

        // すでにある場合は処理を行わない
        if (scope.gradationPresets != null) return;

        // var xhr = new XMLHttpRequest();
        // xhr.open("GET","https://dl.dropbox.com/s/dfiffkgzsvajodt/gradationPresets1.json?dl=0");
        // xhr.responseType = "json";
        // xhr.send();
        //
        // xhr.addEventListener("load" , (ev) => {
        //     scope.gradationPresets = xhr.response;
        // } );


        scope.gradationPresets = [{
                name: "monochrome1",
                id: 0,
                color: ["#ffffff", "#000000"],
            },
            {
                name: "white",
                id: 1,
                color: ["#ffffff", "#ffffff", "#ffffff"],
            },
            {
                name: "white",
                id: 2,
                color: ["#000000", "#000000", "#000000"],
            },
            {
                name: "wood",
                id: 3,
                tag: ["natural"],
                color: ["#dde7dc", "#ffffff", "#e0d7d2"],
                padding: 0.16,
            },
            {
                name: "autumn",
                id: 4,
                tag: ["natural"],
                color: ["#e8cb7f", "#ffffff", "#e9d1c4", "#ffffff", "#b9888c"],
            },
            {
                name: "sea",
                id: 5,
                color: ["#335a59", "#418b8c", "#e8e5dc"],
            },
            {
                name: "sea",
                id: 6,
                color: ["#478b8c", "#23585e", "#334746"],
            },
            {
                name: "calm",
                id: 7,
                color: ["#978f8d", "#c8cece", "#f9ffff"],
            },
            {
                name: "dawn",
                id: 8,
                color: ["#e0b885", "#ad7278", "#524884", "#3f3840"],
            },
            {
                name: "ruins",
                id: 9,
                color: ["#755761", "#5b4144", "#644e63"],
            },
            {
                name: "fire",
                id: 10,
                color: ["#402220", "#93463e", "#eb714a", "#f7af41"],
                mode: "hsl",
            },
            {
                name: "ruins",
                id: 11,
                color: ["#602e15", "#975030", "#4f2916", "#2c1716"],
            },
            {
                name: "ruins",
                id: 12,
                color: ["#b8c4c4", "#949c9e", "#dcdace", "#c7ccc6"],
            },
            {
                name: "ruins",
                id: 13,
                color: ["#7d8180", "#777b7a", "#969f9c", "#87908d"],
            },
            {
                name: "calm",
                id: 14,
                color: ["#c3c8cb", "#ffffff", "#bca595"],
            },
            {
                name: "skin",
                id: 15,
                color: ["#f7d6cd", "#f7e6df", "#e7c1b8"],
            },
            {
                name: "calm",
                id: 16,
                color: ["#a1a8d2", "#ffffff", "#c3c8cb", "#ffffff", "#c4b2a4"],
            },
            {
                name: "autumn",
                id: 17,
                color: ["#f1e4cf", "#8d4f03", "#632100", "#bc8d3d", "#982600"],
            },
            {
                name: "dia",
                id: 18,
                color: ["#e4e5e7", "#ffffff", "#f7f1f3", "#ffffff", "#e9e6f7", "#ffffff"],
            },
            {
                name: "noname",
                id: 19,
                color: ["#fe849d", "#182a5c", "#171a2b"],
            },
            {
                name: "sea",
                id: 20,
                color: ["#a1f7f6", "#132354", "#181b2c", "#164164"],
            },
            {
                name: "birth",
                id: 21,
                color: ["#a5ebff", "#ffffff", "#ffb9b7", "#ffffff", "#a295dd", "#ffffff", "#e7feca", "#ffffff", "#ff6c98"],
            },
            {
                name: "skin",
                id: 22,
                color: ["#faebf2", "#efd1cf", "#e7c7ca", "#f0dde1"],
            },
            {
                name: "natural",
                id: 23,
                color: ["#69c7b5", "#fbe9d5", "#d1dcbc", "#fbe9d5", "#dbd6b6"],
            },
            {
                name: "noname",
                id: 24,
                color: ["#7dafd2", "#ffffff", "#1c377c", "#ffffff", "#e8acc6", "#ffffff", "#5c8fce", "#ffffff", "#d57497"],
            },
            {
                name: "noname",
                id: 25,
                color: ["#f9e2f4", "#cdd1ea", "#b2dcf4", "#ffffff", "#fad7f7", "#ffffff", "#89c8e9"],
            },
            {
                name: "noname",
                id: 26,
                color: ["#637cbc", "#fff3e3", "#fec5d4"],
            },
            {
                name: "noname",
                id: 27,
                color: ["#bd85ac", "#fae8d2", "#ebe9da", "#e0d1ce", "#fdb3aa"],
            },
            {
                name: "noname",
                id: 28,
                color: ["#418ff2", "#ffffff", "#fddde2", "#ffffff", "#79c3e8"],
            },
            {
                name: "noname",
                id: 29,
                color: ["#226173", "#ff8b68", "#f1f1bb", "#9b9494"],
            },
            {
                name: "noname",
                id: 30,
                color: ["#6b7e8d", "#d9b1ba", "#fff8f0", "#ffffff"],
            },
            {
                name: "noname",
                id: 31,
                color: ["#135667", "#33a9cd", "#c4ddc7", "#fcecae"],
            },
            {
                name: "noname",
                id: 32,
                color: ["#ffd139", "#e58030", "#125a8a", "#002b5e"],
            },
            {
                name: "morning1",
                id: 33,
                color: ["#98bdcf", "#ffe2e2", "#ffffff"],
            },
            {
                name: "forest1",
                id: 34,
                color: ["#30641b", "#459b72", "#fbffc2"],
            },
            {
                name: "noname",
                id: 35,
                color: ["#ff966a", "#1a7075", "#192769"],
            },
            {
                name: "dark1",
                id: 36,
                color: ["#c0e2f2", "#2c2c61", "#070d39"],
            },
            {
                name: "forest2",
                id: 37,
                color: ["#2b6e5a", "#9cb677", "#0b2d07"],
            },
            {
                name: "morning1",
                id: 38,
                tag: ["flesh"],
                color: ["#c2d9ff", "#ffffff", "#ffddf5"],
            },
            {
                name: "wa1",
                id: 39,
                color: ["#13133e", "#ffeaea"],
                padding: -0.25,
                gamma: 0.6,
                mode: "lab",
            },
            {
                name: "noname",
                id: 40,
                color: ["#e5cbca", "#f4e9e7", "#d7bbb8", "#d0aea4", "#a1979f", "#ebdbde"],
            },
            {
                name: "noname",
                id: 41,
                color: ["#075988", "#8b6e70", "#baa87a", "#05313e", "#6b867f", "#1b2f64"],
            },
            {
                name: "noname",
                id: 42,
                color: ["#179ad2", "#003c94", "#0e2f8e", "#feedf5"],
                mode: "lch",
            },
            {
                name: "noname",
                id: 43,
                color: ["#826f73", "#ba867b", "#dba074", "#ab9371", "#474838", "#062e36"],
            },
            {
                name: "noname",
                id: 44,
                color: ["#0e0f0a", "#a1a1a1"],
            },
            {
                name: "noname",
                id: 45,
                color: ["#0c193c", "#59a8d1", "#5447a1", "#182559", "#f9cba9", "#e88597", "#a85a81", "#6dd1d3", "#801527"],
            },
            {
                name: "noname",
                id: 46,
                color: ["#f4c1a6", "#f38d9b", "#b5759a", "#695b8c"],
            },
            {
                name: "noname",
                id: 47,
                color: ["#09102d", "#156caf", "#5fb1d6", "#19265a", "#0c1439", "#113070", "#4df3dd", "#3f7ab2", "#514da4", "#1375b4"],
            },
            {
                name: "ruins",
                id: 48,
                color: ["#babebd", "#5b6468", "#777e77", "#8c9393", "#697a69"],
            },
            {
                name: "multi",
                id: 49,
                color: ["#335a59", "#418b8c", "#e8e5dc"],
                setRGB: ["+40.57", "-19.7", "-10.76"],
                mix: ["#ffebeb", 0.1, "rgb"],
                blend: ["#e8c9c4", "overlay"],
            },
            {
                id: 50,
                name: "multi",
                color: ["#ffd0b8", "#ff95a3", "#bb789f", "#564b70"],
                domain: [0.0, 0.25, 0.5, 1.0],
                mode: "hsl",
                setRGB: ["+25.67", null, null],
                setHSL: ["+16.72", "*0.8", "+0.03"],
                mix: ["#ffffff", 0.14, "rgb"],
                blend: ["#649b97", "lighten"],
            },
            {
                id: 51,
                enabled: true,
                color: ["#e0b885", "#ad7278", "#524884", "#3f3840"],
                domain: [0, 0.53, 0.67, 1],
                mode: "rgb",
                padding: 0,
                gamma: 1,
                enableBezier: false,
                enableDomain: true,
                enablePadding: true,
                enableGamma: true,
                enableClasses: false,
                classes: 4,
                enableSetRGB: [true, false, true],
                enableSetCMYK: [true, true, true, true],
                enableSetHSL: [true, true, true],
                setrgb: ["+34.49", "+5.76", "+0"],
                setcmyk: ["-0.14", "+0", "-0.17", "-0.2"],
                sethsl: ["+0.0", "+0.0", "+0"],
                enableMix: true,
                enableBlend: true,
                customClasses: [],
                mix: ["#ffffff", 0.08, "rgb"],
                blend: ["#7cbb96", "overlay"],
                setDisableList: [],
            },
            {
                id: 52,
                enabled: true,
                color: ["#402220", "#93463e", "#eb714a", "#f7af41"],
                domain: [0, 0.3333333333333333, 0.6666666666666666, 1],
                mode: "rgb",
                padding: 0,
                gamma: 1,
                enableBezier: false,
                enableDomain: true,
                enablePadding: true,
                enableGamma: true,
                enableClasses: false,
                classes: 4,
                enableSetRGB: [true, true, true],
                enableSetCMYK: [true, true, true, true],
                enableSetHSL: [true, true, true],
                setrgb: ["+58.43", "+34.49", "+36.88"],
                sethsl: ["+0", "+0", "+0.12"],
                setcmyk: ["+0", "+0", "+0", "+0"],
                enableMix: true,
                enableBlend: true,
                mix: ["#ffffff", 0.05, "rgb"],
                blend: ["#cbd4b4", "overlay"],
                setDisableList: [],
                customClasses: [],
            },
            {
                id: 53,
                enabled: true,
                color: ["#09102d", "#156caf", "#5fb1d6", "#19265a", "#0c1439", "#113070", "#4df3dd", "#3f7ab2", "#514da4", "#1375b4"],
                domain: [0, 0.1111111111111111, 0.2222222222222222, 0.3333333333333333, 0.4444444444444444, 0.5555555555555556, 0.6666666666666666, 0.7777777777777778, 0.8888888888888888, 1],
                mode: "rgb",
                padding: 0,
                gamma: 1,
                enableBezier: false,
                enableDomain: true,
                enablePadding: true,
                enableGamma: true,
                enableClasses: false,
                classes: 4,
                enableSetRGB: [true, true, true],
                enableSetCMYK: [true, true, true, true],
                enableSetHSL: [true, true, true],
                setrgb: ["+0", "-0", "-0"],
                sethsl: ["+9.14", "-0", "+0.14"],
                setcmyk: ["-0.8", "-0", "+0.18", "+0"],
                enableMix: true,
                enableBlend: false,
                mix: ["#ffffff", 0.45, "rgb"],
                blend: ["#d7a9a9", "overlay"],
            },
            {
                id: 54,
                name: "sea",
                color: ["#0d123a", "#55a7b2", "#e9dfd6"],
            },
            {
                id: 55,
                name: "sun",
                color: ["#2a0304", "#5c1616", "#99371a", "#d76d19", "#f8931d", "#ffaf1a", "#ffc11c", "#ffe46f"],
            },
            {
                id: 56,
                name: "sun",
                color: ["#ffe46f", "#ffaf1a", "#d86e1a", "#792719"],
            },
            {
                id: 57,
                name: "devil",
                color: ["#8b4b3f", "#383735"],
            },
            {
                id: 58,
                name: "devil",
                color: ["#8b4b3f", "#383735", "#617260"],
            },
            {
                id: 59,
                enabled: true,
                color: ["#30641b", "#459b72", "#fbffc2"],
                domain: [0, 0.5, 1],
                mode: "rgb",
                padding: 0,
                gamma: 1,
                enableBezier: false,
                enableDomain: true,
                enablePadding: true,
                enableGamma: true,
                enableClasses: false,
                classes: 4,
                enableSetRGB: [true, true, true],
                setrgb: ["+75.19", "+0", "+0"],
            },
            {
                id: 60,
                enabled: true,
                color: ["#30641b", "#459b72", "#fbffc2"],
                domain: [0, 0.5, 1],
                mode: "rgb",
                padding: 0,
                gamma: 1,
                enableBezier: false,
                enableDomain: true,
                enablePadding: true,
                enableGamma: true,
                enableClasses: false,
                classes: 4,
                enableSetRGB: [true, true, true],
                setrgb: ["+91.92", "+0", "+0"],
            },
            {
                id: 61,
                enabled: true,
                color: ["#335a59", "#418b8c", "#e8e5dc"],
                domain: [0, 0.5, 1],
                mode: "rgb",
                padding: 0,
                gamma: 1,
                enableBezier: false,
                enableDomain: true,
                enablePadding: true,
                enableGamma: true,
                enableClasses: false,
                classes: 4,
                enableSetRGB: [true, true, true],
                enableSetCMYK: [true, true, true, true],
                enableSetHSL: [true, false, true],
                setrgb: ["+0", "+0", "-0"],
                sethsl: ["+32.79", "-0", "+0"],
                setcmyk: ["+0", "+0.14", "+0.0", "+0.0"],
                enableMix: false,
                enableBlend: false,
                mix: ["#ffffff", 0.2, "rgb"],
                blend: ["#ffffff", "overlay"],
            },
            {
                id: 62,
                color: ["#854a44", "#b75d42", "#e1aaad", "#d2aba6", "#a13c34", "#7b3f3f"],
                mode: "rgb",
            },
            {
                id: 63,
                color: ["#112218", "#778f6b", "#b8d38e", "#f0be75", "#d38a61", "#f3e976", "#5e95b4"],
                mode: "rgb",
            },
            {
                id: 64,
                color: ["#649cb3", "#c1e2f1", "#f2f3f7"],
                mode: "rgb",
            },
            {
                id: 65,
                color: ["#fbfcf7", "#e3cfc4", "#947e70", "#5e543b", "#333935"],
                mode: "rgb",
            },
            {
                id: 66,
                color: ["#fbfcf7", "#e3cfc4", "#947e70", "#5e543b"],
                mode: "rgb",
            },
            {
                id: 67,
                color: ["#272f42", "#8f3149", "#742e48", "#272f42"],
                mode: "rgb",
            },
            {
                id: 68,
                enabled: true,
                color: ["#102735", "#102735", "#102735", "#e29142", "#ba7440", "#eeb973", "#102735", "#193344", "#112732", "#152b36"],
                mode: "rgb",
            },
            {
                id: 69,
                enabled: true,
                color: ["#0d0e20", "#242b62", "#505994", "#dbcccf", "#ffffff"],
                mode: "rgb",
            },
            {
                id: 70,
                enabled: true,
                color: ["#1e2d56", "#004b72", "#537388", "#c3cdce", "#e1dbcd"],
                mode: "rgb",
            },
            {
                id: 71,
                enabled: true,
                color: ["#91bfac", "#f0e7e8", "#f29c9a", "#696783"],
                mode: "rgb",
            },
            {
                id: 72,
                enabled: true,
                color: ["#f6d3d8", "#d3a2a7", "#000000", "#000000", "#98b4cd", "#5b9db9"],
                domain: [0, 0.3, 0.51, 0.5700000000000001, 0.71, 1],
                mode: "rgb",
                padding: 0.28,
                gamma: 1,
                enableBezier: false,
                enableDomain: true,
                enablePadding: true,
                enableGamma: true,
                enableClasses: false,
                classes: 4,
                enableSetRGB: [true, true, true],
                enableSetCMYK: [true, true, true, true],
                enableSetHSL: [true, true, true],
                setrgb: ["+0.0", "+0.0", "+0.0"],
                sethsl: ["+0.0", "+0.0", "+0.0"],
                setcmyk: ["+0.0", "+0.0", "+0.0", "+0.0"],
                enableMix: false,
                enableBlend: false,
                mix: ["#ffffff", 0.5, "rgb"],
                blend: ["#ffffff", "overlay"],
            },
            {
                id: 73,
                enabled: true,
                color: ["#f4f7ee", "#c2e1d2", "#3eb8c7", "#2e9099"],
                mode: "rgb",
            },
            {
                id: 74,
                color: ["#ac91b4", "#f1a5a7", "#844d6d", "#f5aab1", "#e9859d", "#91495f"],
                domain: [0, 0.2, 0.4, 0.6, 0.8, 1],
                mode: "rgb",
            },
            {
                id: 75,
                enabled: true,
                color: ["#f2debd", "#edbeac", "#7f7168", "#565249", "#2e2d2b", "#000000"],
                mode: "rgb",
            },
            {
                id: 76,
                enabled: true,
                color: ["#eecabb", "#ffffff", "#ffffff", "#000000", "#000000", "#000000"],
                mode: "rgb",
            },
            {
                id: 77,
                enabled: true,
                color: ["#436488", "#dad4d5", "#fffefd", "#3e3243"],
                mode: "rgb",
            },
            {
                id: 78,
                enabled: true,
                color: ["#128fa8", "#2c2644", "#b13c06", "#f5ead9"],
                mode: "rgb",
            },
            {
                id: 79,
                color: ["#cac5c2", "#adb8ba", "#3e5366", "#b9bcc1", "#c9c4c1", "#302722"],
                domain: [0, 0.2, 0.4, 0.6, 0.8, 1],
                mode: "rgb",
            },
            {
                id: 80,
                enabled: true,
                color: ["#665342", "#6e513f", "#9e8e7f", "#d4bba7", "#c2947a", "#d3b8a3"],
                mode: "rgb",
            },
            {
                id: 81,
                enabled: true,
                color: ["#c88a3d", "#edddc4", "#f2dbc9", "#533e3d", "#885f5b", "#e3b79a", "#f0ece9", "#f1f2f4", "#606970"],
                mode: "rgb",
            },
            {
                id: 82,
                enabled: true,
                color: ["#c88a3d", "#edddc4", "#eac6a4", "#9a8767", "#8a5e41", "#d89449"],
                mode: "rgb",
            },
            {
                id: 83,
                enabled: true,
                color: ["#ff9e67", "#da7d76", "#3e4154", "#353c4f", "#7f8487", "#9e7271", "#f3dbd7", "#f1e4de"],
                mode: "rgb",
            },
            {
                id: 84,
                enabled: true,
                color: ["#f3efee", "#e7b195", "#e78a82", "#908164", "#747d6a", "#423f4a"],
                mode: "rgb",
            },
            {
                id: 85,
                enabled: true,
                color: ["#044d82", "#62b5d3", "#feffed", "#dbd7cb", "#f9d14b"],
                mode: "rgb",
            },
            {
                id: 86,
                enabled: true,
                color: ["#fefffd", "#e8dfce", "#acb9b2", "#d9c8b8", "#feffed", "#a8cfce"],
                mode: "rgb",
            },
            {
                id: 87,
                enabled: true,
                color: ["#e5e9f2", "#fefffb", "#b6d1e4", "#dbe2e8", "#f9ffff"],
                mode: "rgb",
            },
            {
                id: 88,
                enabled: true,
                color: ["#e5e9f2", "#fefffb", "#b6d1e4", "#dbe2e8", "#f9ffff", "#e9e4e1", "#fefef6", "#cdafbb"],
                mode: "rgb",
            },
            {
                id: 89,
                enabled: true,
                color: ["#08a7fb", "#e5e9f2", "#fefffb", "#b6d1e4", "#dbe2e8", "#f9ffff", "#e9e4e1", "#fefef6", "#cdafbb"],
                mode: "rgb",
            },
            {
                id: 90,
                enabled: true,
                color: ["#001944", "#054ba3", "#fff9ed", "#addaed", "#57a4d0", "#3b9fd0", "#1256a1"],
                mode: "rgb",
            },
            {
                id: 91,
                enabled: true,
                color: ["#312525", "#6c5a4c", "#c6c1be", "#d6ac94", "#3e606a"],
                mode: "rgb",
            },
            {
                id: 92,
                enabled: true,
                color: ["#57444a", "#ba6f5a", "#c3957d", "#9a736c", "#e6cbc0", "#b76655"],
                mode: "rgb",
            },
            {
                id: 93,
                enabled: true,
                color: ["#a74c37", "#f7ebdb", "#ab7972", "#040e0d", "#1e3233"],
                mode: "rgb",
            },
            {
                id: 94,
                enabled: true,
                color: ["#10182f", "#1f3b49", "#7d85a9", "#e5daeb", "#b7778f", "#115e78", "#54a8d7", "#3c4262", "#efdbe7"],
                domain: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1],
                mode: "rgb",
            },
            {
                id: 95,
                enabled: true,
                color: ["#002a31", "#033c47", "#036e68", "#3dac8c", "#008c9d", "#00a9c2", "#b9e0b4", "#ccd872", "#eeefc7"],
                mode: "rgb",
            },
            {
                id: 96,
                enabled: true,
                color: ["#fbfbf3", "#dbe55e", "#6cb446", "#153f3b", "#0f3238", "#0d1f29", "#0c2329", "#ece9be", "#235949", "#08111a"],
                mode: "rgb",
            },
            {
                id: 97,
                enabled: true,
                color: ["#f29657", "#ffe4b5", "#fff9ef", "#fff9ef", "#8289a3", "#375673"],
                mode: "rgb",
            },
            {
                id: 98,
                enabled: true,
                color: ["#3d383e", "#764234", "#e29b4d", "#cda871", "#f0eadc", "#8e9a72", "#438772", "#0c785e"],
                mode: "rgb",
            },
            {
                id: 99,
                enabled: true,
                color: ["#5d7750", "#2a4417", "#071a1e", "#344f4a", "#5d7750", "#f6fff7", "#daf0e3", "#315b5a", "#1b3228", "#61705b"],
                mode: "rgb",
            },
            {
                id: 100,
                enabled: true,
                color: ["#2f2732", "#a9a3a3", "#ecebe7", "#eaddd5"],
                mode: "rgb",
            },
            {
                id: 101,
                enabled: true,
                color: ["#d8644b", "#f8ebc9", "#ed322b", "#f0c08f", "#ffefd7", "#311811", "#040404", "#1b110f", "#000000", "#c97559", "#e17050", "#f3ce9a"],
                mode: "rgb",
            },
            {
                id: 102,
                enabled: true,
                color: ["#f6a36f", "#ecc792", "#e8e5dc", "#bdb9a0", "#67817e", "#44595a"],
                mode: "rgb",
            },
            {
                id: 103,
                enabled: true,
                color: ["#fffeff", "#e0eff4", "#81a2a9", "#497a7f"],
                mode: "rgb",
            },
            {
                id: 104,
                enabled: true,
                color: ["#e7633c", "#ffdc76", "#af7426", "#070602"],
                mode: "rgb",
            },
            {
                id: 105,
                enabled: true,
                color: ["#edbfb0", "#b9d0be", "#1b7c82", "#06313a", "#000000"],
                mode: "rgb",
            },
            {
                id: 106,
                enabled: true,
                color: ["#5a78aa", "#a7c7d2", "#cdd3cf", "#f9faf5"],
                mode: "rgb",
            },
            {
                id: 107,
                enabled: true,
                color: ["#e1c4bd", "#84b9b2", "#b9d6d9"],
                mode: "rgb",
            },
            {
                id: 108,
                enabled: true,
                color: ["#f2668b", "#fbde45", "#fff7d2", "#fff7d2", "#82f3d5", "#423ca8"],
                mode: "rgb",
            },
            {
                id: 109,
                enabled: true,
                color: ["#f33c38", "#f5c0c8", "#f2f2f2", "#d6d8d5", "#7b7c80", "#111113", "#f6f6f4", "#f3f5f4", "#edefee"],
                mode: "rgb",
            },
            {
                id: 110,
                enabled: true,
                color: ["#cc3e26", "#d9600d", "#faca38", "#f2bac7", "#c65d6e", "#fd9e80", "#fa5f27", "#ffcf84"],
                mode: "rgb",
            },
            {
                id: 111,
                enabled: true,
                color: ["#ddccdc", "#bcc0db", "#cfe1ed", "#2c6b8a", "#859eb4", "#fefcff"],
                mode: "rgb",
            },
            {
                id: 112,
                enabled: true,
                color: ["#eab3ac", "#fcd8be", "#b3bfb3", "#8ea591", "#f8e5d7", "#705e52"],
                mode: "rgb",
            },
            {
                id: 113,
                enabled: true,
                color: ["#ffffff", "#eab635", "#cc8c2b", "#504d4e", "#504d4e", "#513d37", "#000000", "#000000", "#000000", "#000000"],
                mode: "rgb",
            },
            {
                id: 114,
                enabled: true,
                color: ["#a8d4ed", "#eafbf3", "#d2f6f6", "#b9e9e9", "#fbffff"],
                mode: "rgb",
            },
            {
                id: 115,
                enabled: true,
                color: ["#31a8a2", "#86ceb6", "#cce0ab", "#e4eff1", "#d1eaee", "#def0f2", "#f1faf9", "#92dcdb", "#c8eeef", "#ffffff", "#f4f8f9"],
                mode: "rgb",
            },
            {
                id: 116,
                enabled: true,
                color: ["#734562", "#7c5866", "#ded6d3", "#f3efee", "#ded6d3", "#14233a"],
                mode: "rgb",
            },
            {
                id: 117,
                enabled: true,
                color: ["#fffffd", "#d8b097", "#c68e77", "#9d5666", "#794269", "#4e304c"],
                mode: "rgb",
            },
            {
                id: 118,
                enabled: true,
                color: ["#041527", "#142e45", "#2e4e5d", "#567476", "#a5b09f", "#f9f0df", "#fdf6ee", "#fffefa"],
                mode: "rgb",
            },
            {
                id: 119,
                enabled: true,
                color: ["#dfeef1", "#233a42", "#0c1824", "#0d1927", "#2d4853", "#0b204f"],
                mode: "rgb",
            },
            {
                id: 120,
                enabled: true,
                color: ["#6a002e", "#aa454b", "#463045", "#e2817a", "#d5a597"],
                mode: "rgb",
            },
            {
                id: 121,
                enabled: true,
                color: ["#6c64af", "#ebe5cf", "#ebe5cf", "#e1c325"],
                mode: "rgb",
            },
            {
                id: 122,
                enabled: true,
                color: ["#fde8a5", "#f87360", "#a53543", "#d17987", "#a5587c", "#58314c"],
                mode: "rgb",
            },
            {
                id: 123,
                enabled: true,
                color: ["#c3bec2", "#e4e3eb", "#dacdbd", "#fffdee", "#fefad7", "#ffeac0", "#ffffff"],
                mode: "rgb",
            },
            {
                id: 124,
                enabled: true,
                color: ["#c3bec2", "#ffffff", "#e4e3eb", "#ffffff", "#dacdbd", "#ffffff", "#fffdee", "#ffffff", "#fefad7", "#ffffff", "#ffeac0", "#ffffff"],
                mode: "rgb",
            },
            {
                id: 125,
                enabled: true,
                color: ["#99759e", "#f47b90", "#faaca8", "#fccdcb", "#f8e1c2", "#ffffff"],
                mode: "rgb",
            },
            {
                id: 126,
                enabled: true,
                color: ["#fb7142", "#ffd09c", "#f1fcf6", "#f1fcf6", "#a8ebe2", "#033e5e"],
                mode: "rgb",
            },
            {
                id: 127,
                enabled: true,
                color: ["#cf8192", "#f1a0a7", "#f7dbd5", "#ffffff", "#badadb", "#badadb"],
                mode: "rgb",
            },
            {
                id: 128,
                enabled: true,
                color: ["#081866", "#0f47b4", "#a2dcff", "#eaf9f6", "#d0deab", "#fffa72"],
                mode: "rgb",
            },
            {
                id: 129,
                enabled: true,
                color: ["#e86987", "#f7ae9f", "#fad1b5", "#9bb0b5"],
                mode: "rgb",
            },
            {
                id: 130,
                enabled: true,
                color: ["#253860", "#50567a", "#a8929e", "#c4aeb0", "#e0c5b0", "#b76571"],
                mode: "rgb",
            },
            {
                id: 131,
                enabled: true,
                color: ["#572946", "#a63c6d", "#ff2150", "#e882b2", "#c6cdc6", "#1c8ac5", "#196795", "#112848", "#2f6e8f"],
                mode: "rgb",
            },
            {
                id: 132,
                enabled: true,
                color: ["#956362", "#c49c9c", "#e4dbc9", "#e4dbc9", "#cdbca0", "#b19d9e"],
                mode: "rgb",
            },
            {
                id: 133,
                enabled: true,
                color: ["#551d36", "#7b2238", "#e96270", "#ea989c", "#fadde2", "#f2ced2", "#081c35", "#081c35", "#081c35"],
                mode: "rgb",
            },
            {
                id: 134,
                enabled: true,
                color: ["#ffffff", "#ffffff", "#fdffed", "#ffdd9e", "#b78d5d", "#4a3c2f", "#293144", "#43607e"],
                mode: "rgb",
            },
            {
                id: 135,
                enabled: true,
                color: ["#79234a", "#d6225f", "#ac1c3d", "#e72a4a", "#fd626a", "#fe998f", "#feceb8"],
                mode: "rgb",
            },
            {
                id: 136,
                enabled: true,
                color: ["#f7f8b6", "#e37854", "#40878d", "#324d6a", "#0d2845", "#0f1418"],
                mode: "rgb",
            },
            {
                id: 137,
                enabled: true,
                color: ["#1a252b", "#86827f", "#a5aba9", "#a49997", "#e9e9e9", "#efeeec"],
                mode: "rgb",
            },
            {
                id: 138,
                enabled: true,
                color: ["#024241", "#2db08e", "#c9daad"],
                mode: "rgb",
            },
            {
                id: 139,
                enabled: true,
                color: ["#b2ecef", "#2486bd", "#4ac6c8", "#134472", "#07132a"],
                mode: "rgb",
            },
            {
                id: 140,
                enabled: true,
                color: ["#254b83", "#8c5676", "#bd6066", "#e16953", "#ff7139"],
                mode: "rgb",
            },
            {
                enabled: true,
                id: 141,
                color: ["#98bdcf", "#ffe2e2", "#ffffff"],
                domain: [0, 0.5, 1],
                mode: "rgb",
                padding: 0,
                gamma: 1,
                enableBezier: false,
                enableDomain: true,
                enablePadding: true,
                enableGamma: true,
                enableClasses: false,
                classes: 4,
                enableSetRGB: [true, true, true],
                enableSetCMYK: [true, true, true, true],
                enableSetHSL: [true, true, false],
                setrgb: ["+79.55", "+0", "-11.36"],
                sethsl: ["+24.07", "-0", "-0.04"],
                setcmyk: ["+0", "+0", "+0.12", "+0.03"],
                setDisableList: [],
                customClasses: [],
                enableMix: false,
                enableBlend: true,
                mix: ["#ffffff", 0.5, "rgb"],
                blend: ["#415e36", "overlay"],
            },
            {
                enabled: true,
                color: ["#fb7142", "#ffd09c", "#f1fcf6", "#f1fcf6", "#a8ebe2", "#033e5e"],
                domain: [0, 0.2, 0.4, 0.6, 0.8, 1],
                mode: "rgb",
                padding: 0,
                gamma: 1,
                enableBezier: false,
                enableDomain: true,
                enablePadding: true,
                enableGamma: true,
                enableClasses: false,
                classes: 4,
                enableSetRGB: [true, true, true],
                enableSetCMYK: [true, true, true, true],
                enableSetHSL: [true, true, true],
                setrgb: ["+30.310000000000002", "+0", "+0.0"],
                sethsl: ["-26.740000000000002", "-0.22", "-0.04"],
                setcmyk: ["+0", "+0.0", "+0.0", "+0"],
                setDisableList: [],
                customClasses: [],
                enableMix: true,
                enableBlend: false,
                mix: ["#ffffff", 0.24, "rgb"],
                blend: ["#ffffff", "overlay"],
            },
        ];

    }









}
