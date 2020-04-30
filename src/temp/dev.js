class NasikusaDev extends Nasikusa {

    constructor(_s) {

        super(_s);


    }

    /**
     *
     * @return {[type]} [description]
     */
    initDev() {

        var scope = this;

        if (scope.s.devMode.resize) {

            window.addEventListener("resize", scope.onDevResize.bind(scope));

        }

    }

    /**
     * dat.gui.jsを使用したリアルタイムのパラメーター変更を行う処理の初期化関数
     * @return {[type]} [description]
     */
    datgui() {

        var scope = this;

        /**
         * dat.gui.jsが使用する設定用のオブジェクト
         * @type {Object}
         *
         *
         */
        scope.guiOpt = {

            // @todo ズーム, perspectiveとorthoの切り替え、コントローラーとの同期
            camera: {
                perspective: (scope.camera.type == "PerspectiveCamera") ? true : false,
                orthographic: (scope.camera.type == "OrthographicCamera") ? true : false,
                fov: scope.camera.fov,
                near: scope.camera.near,
                far: scope.camera.far,
                zoom: scope.camera.zoom,
                position: {
                    x: scope.camera.position.x,
                    y: scope.camera.position.y,
                    z: scope.camera.position.z,
                    copy: scope.datChange.bind(scope, "camera.position.copy"),
                },
                rotation: {
                    enabled: scope.setting.camera.rotation.enabled,
                    x: THREE.Math.radToDeg(scope.camera.rotation.x),
                    y: THREE.Math.radToDeg(scope.camera.rotation.y),
                    z: THREE.Math.radToDeg(scope.camera.rotation.z),
                    copy: scope.datChange.bind(scope, "camera.rotation.copy"),
                },
                lookAt: {
                    enabled: scope.setting.camera.lookAt.enabled,
                    x: scope.setting.camera.lookAt.x,
                    y: scope.setting.camera.lookAt.y,
                    z: scope.setting.camera.lookAt.z,
                    copy: scope.datChange.bind(scope, "camera.lookAt.copy"),
                },
                reset: scope.datChange.bind(scope, "camera.reset"),
                cameraAllCopy: scope.datChange.bind(scope, "camera.cameraAllCopy"),
                // modelcamera
            },
            randomColorGeneral: {
                changeSpeed: 100,
                allOpen: "",
                allClose: "",
                allReset: "",
                allCopy: "",
                enableHistory: "",
                enableFinishAction: true,
            },

        };

        // ランダムカラー用のoption設定 ( 複数ある可能性があるため別に )
        for (var i = 0; i < scope.setting.randomColor.length; i++) {

            if (i == 0) {
                scope.guiOpt.randomColor = [];
            }

            scope.guiOpt.randomColor[i] = {};
            // datgui.js用のoptionオブジェクト
            var opt = scope.guiOpt.randomColor[i];
            // setting
            var set = scope.setting.randomColor[i];
            opt["setRGB"] = {};
            opt["setHSL"] = {};
            opt["setCMYK"] = {};

            // @deprecated
            opt["setLCH"] = {};
            // @deprecated
            opt["setLAB"] = {};

            // こっちのほうが管理しやすいので急遽つくった..
            opt["color"] = [];

            for (var j = 0; j < set.color.length; j++) {
                opt[`color${j}`] = set.color[j];
                opt["color"][j] = set.color[j];
            }
            // カラー追加
            opt["addColor"] = scope.datChange.bind(scope, "randomColor.addColor", {
                randomColorGroupNumber: i
            });
            // カラー削除
            opt["removeColor"] = scope.datChange.bind(scope, "randomColor.removeColor", {
                randomColorGroupNumber: i
            });



            opt["mode"] = set.mode;

            // bezierでのスケール
            if (set.enableBezier != null && set.enableBezier == true) {
                opt["enableBezier"] = true;
            } else {
                opt["enableBezier"] = false;
            }

            if (set.padding != null && set.enablePadding == true) {
                opt["enablePadding"] = true;
                opt["padding"] = set.padding;
            } else {
                opt["enablePadding"] = false;
                opt["padding"] = 0;
            }
            if (set.gamma != null && set.enableGamma == true) {
                opt["enableGamma"] = true;
                opt["gamma"] = set.gamma;
            } else {
                opt["enableGamma"] = false;
                opt["gamma"] = 1;
            }

            // ドメイン管理用の配列
            opt["domain"] = [];

            // domainが空配列の場合の警告
            if (Array.isArray(set.domain)) {
                if (set.domain.length == 0) {
                    console.error("空配列のdomainを作成しないでください");
                }
            }

            // @if ドメインがある場合とない場合
            if (set.domain) {

                for (var j = 0; j < set.color.length; j++) {

                    opt[`domain${j}`] = set.domain[j];
                    opt["domain"][j] = set.domain[j];

                }

            } else {

                for (var j = 0; j < set.color.length; j++) {

                    opt[`domain${j}`] = j / (set.color.length - 1);
                    opt["domain"][j] = j / (set.color.length - 1);

                    // 全体設定のrandomColorのdomainがない場合は、配列を作成する
                    if (scope.s.randomColor[i]["domain"] == null) {
                        scope.s.randomColor[i]["domain"] = [];
                    }
                    scope.s.randomColor[i]["domain"].push(j / (set.color.length - 1));

                }

            }




            // enableDomain
            if (set.domain != null && set.enableDomain == true) {
                opt["enableDomain"] = true;
            } else {
                opt["enableDomain"] = false;
            }
            // classes
            if (set.classes != null && set.enableClasses == true) {
                opt["enableClasses"] = true;
                opt["classes"] = set.classes;
            } else {
                opt["enableClasses"] = false;
                opt["classes"] = 4;
            }

            if (set.enableClasses == true && set.customClasses != null && set.enableCustomClasses == true) {
                opt["enableCustomClasses"] = true;
                opt["customClasses"] = {};

                // customClassesは2つの数字の間で1つのカラーなので、classesの数に+1する必要があることに注意
                for (let i = 0; i < opt["classes"] + 1; i++) {
                    opt["customClasses"][i] = set.customClasses[i];
                }
            } else {
                opt["enableCustomClasses"] = false;
                opt["customClasses"] = {};
                for (let i = 0; i < opt["classes"] + 1; i++) {
                    if (set.customClasses[i] != null) {
                        opt["customClasses"][i] = set.customClasses[i];
                    } else {
                        opt["customClasses"][i] = i / opt["classes"];
                    }
                }
            }



            // mix
            if (set.mix != null && set.enableMix == true) {
                opt["enableMix"] = true;
                opt["mixColor"] = set.mix[0];
                opt["mixRatio"] = set.mix[1];
                opt["mixMode"] = set.mix[2];
            } else {
                opt["enableMix"] = false;
                opt["mixRatio"] = 0.5;
                opt["mixColor"] = "#ffffff";
                opt["mixMode"] = "rgb";
            }
            // blend
            if (set.blend != null && set.enableBlend == true) {
                opt["enableBlend"] = true;
                opt["blendColor"] = set.blend[0];
                opt["blendMode"] = set.blend[1];
            } else {
                opt["enableBlend"] = false;
                opt["blendColor"] = "#ffffff";
                opt["blendMode"] = "overlay";
            }

            // setrgb
            // +?? の形などで引数がくるので、(+ - * /)の部分と数字の部分に分ける
            if (set.setrgb != null) {

                if (typeof set.setrgb[0] == "number") {
                    opt["setRGB"]["redCalcType"] = "=";
                    opt["setRGB"]["red"] = set.setrgb[0];
                } else {
                    opt["setRGB"]["redCalcType"] = set.setrgb[0].slice(0, 1);
                    opt["setRGB"]["red"] = Number(set.setrgb[0].slice(1, set.setrgb[0].length));
                }

                if (typeof set.setrgb[1] == "number") {
                    opt["setRGB"]["greenCalcType"] = "=";
                    opt["setRGB"]["green"] = set.setrgb[1];
                } else {
                    opt["setRGB"]["greenCalcType"] = set.setrgb[1].slice(0, 1);
                    opt["setRGB"]["green"] = Number(set.setrgb[1].slice(1, set.setrgb[1].length));
                }

                if (typeof set.setrgb[2] == "number") {
                    opt["setRGB"]["blueCalcType"] = "=";
                    opt["setRGB"]["blue"] = set.setrgb[2];
                } else {
                    opt["setRGB"]["blueCalcType"] = set.setrgb[2].slice(0, 1);
                    opt["setRGB"]["blue"] = Number(set.setrgb[2].slice(1, set.setrgb[2].length));
                }

                opt["setRGB"]["enableRed"] = set.enableSetRGB[0];
                opt["setRGB"]["enableGreen"] = set.enableSetRGB[1];
                opt["setRGB"]["enableBlue"] = set.enableSetRGB[2];

            }

            // setcmyk
            if (set.setcmyk != null) {

                if (typeof set.setcmyk[0] == "number") {
                    opt["setCMYK"]["cyanCalcType"] = "=";
                    opt["setCMYK"]["cyan"] = set.setcmyk[0];
                } else {
                    opt["setCMYK"]["cyanCalcType"] = set.setcmyk[0].slice(0, 1);
                    opt["setCMYK"]["cyan"] = Number(set.setcmyk[0].slice(1, set.setcmyk[0].length));
                }

                if (typeof set.setcmyk[1] == "number") {
                    opt["setCMYK"]["magentaCalcType"] = "=";
                    opt["setCMYK"]["magenta"] = set.setcmyk[1];
                } else {
                    opt["setCMYK"]["magentaCalcType"] = set.setcmyk[1].slice(0, 1);
                    opt["setCMYK"]["magenta"] = Number(set.setcmyk[1].slice(1, set.setcmyk[1].length));
                }

                if (typeof set.setcmyk[2] == "number") {
                    opt["setCMYK"]["yellowCalcType"] = "=";
                    opt["setCMYK"]["yellow"] = set.setcmyk[2];
                } else {
                    opt["setCMYK"]["yellowCalcType"] = set.setcmyk[2].slice(0, 1);
                    opt["setCMYK"]["yellow"] = Number(set.setcmyk[2].slice(1, set.setcmyk[2].length));
                }

                if (typeof set.setcmyk[3] == "number") {
                    opt["setCMYK"]["keyCalcType"] = "=";
                    opt["setCMYK"]["key"] = set.setcmyk[3];
                } else {
                    opt["setCMYK"]["keyCalcType"] = set.setcmyk[3].slice(0, 1);
                    opt["setCMYK"]["key"] = Number(set.setcmyk[3].slice(1, set.setcmyk[3].length));
                }

                opt["setCMYK"]["enableCyan"] = set.enableSetCMYK[0];
                opt["setCMYK"]["enableMagenta"] = set.enableSetCMYK[1];
                opt["setCMYK"]["enableYellow"] = set.enableSetCMYK[2];
                opt["setCMYK"]["enableKey"] = set.enableSetCMYK[3];

            }

            // sethsl
            if (set.sethsl != null) {

                if (typeof set.sethsl[0] == "number") {
                    opt["setHSL"]["hueCalcType"] = "=";
                    opt["setHSL"]["hue"] = set.sethsl[0];
                } else {
                    opt["setHSL"]["hueCalcType"] = set.sethsl[0].slice(0, 1);
                    opt["setHSL"]["hue"] = Number(set.sethsl[0].slice(1, set.sethsl[0].length));
                }

                if (typeof set.sethsl[1] == "number") {
                    opt["setHSL"]["saturationCalcType"] = "=";
                    opt["setHSL"]["saturation"] = set.sethsl[1];
                } else {
                    opt["setHSL"]["saturationCalcType"] = set.sethsl[1].slice(0, 1);
                    opt["setHSL"]["saturation"] = Number(set.sethsl[1].slice(1, set.sethsl[1].length));
                }

                if (typeof set.sethsl[2] == "number") {
                    opt["setHSL"]["luminanceCalcType"] = "=";
                    opt["setHSL"]["luminance"] = set.sethsl[2];
                } else {
                    opt["setHSL"]["luminanceCalcType"] = set.sethsl[2].slice(0, 1);
                    opt["setHSL"]["luminance"] = Number(set.sethsl[2].slice(1, set.sethsl[2].length));
                }

                opt["setHSL"]["enableHue"] = set.enableSetHSL[0];
                opt["setHSL"]["enableSaturation"] = set.enableSetHSL[1];
                opt["setHSL"]["enableLuminance"] = set.enableSetHSL[2];

            }

            opt["functions"] = {};
            // グラデーション表示
            opt["functions"]["showGradation"] = {};
            opt["functions"]['showGradation']["showGradation"] = true;
            opt["functions"]["showGradation"]["width"] = 300;
            opt["functions"]["showGradation"]["height"] = 20;
            opt["functions"]["showGradation"]["horizontalPosition"] = "center";
            opt["functions"]["showGradation"]["verticalPosition"] = "top";
            // プリセット表示
            opt["functions"]["showPreset"] = {};
            opt["functions"]['showPreset']["showPreset"] = true;
            // フェッチ表示
            opt["functions"]["showFetch"] = {};
            opt["functions"]["showFetch"]["showFetch"] = true;
            // クリップボードにコピーする
            opt["functions"]["copyToClipboard"] = {};
            opt["functions"]["copyToClipboard"]["all"] = scope.datChange.bind(scope, "randomColor.functions.copyToClipboard.all", {
                randomColorGroupNumber: i,
                minify: false
            });
            opt["functions"]["copyToClipboard"]["all(minify)"] = scope.datChange.bind(scope, "randomColor.functions.copyToClipboard.all", {
                randomColorGroupNumber: i,
                minify: true
            });
            opt["functions"]["copyToClipboard"]["color"] = scope.datChange.bind(scope, "randomColor.functions.copyToClipboard.color", {
                randomColorGroupNumber: i,
                minify: false
            });


            // opt["functions"]["exportImage"] = scope.datChange.bind(scope , "randomColor.exportImage" , { randomColorGroupNumber : i });


        }



        // リセット用のディープコピーオブジェクト(もっといい方法あるはず。。。)
        scope.guiOptBack = JSON.parse(JSON.stringify(scope.guiOpt));

        // ランダムカラー用のフラッグ
        scope.randomColorChangeFlag == true;

        // dat.gui.jsのインスタンスを生成
        scope.dat = new dat.GUI({
            hideable: true,
            autoPlace: false,
            // closed : true,
            // closeOnTop : false,
        });

        // dat.gui.jsの画面のサイズを変更したい場合はこちらで( あまり必要性を感じなかった。。開発中に邪魔になってしまう。。 )
        scope.dat.width = 200;

        // dat.GUI.jsのフォルダを入れておく
        scope.datFlds = {};
        // dat.GUI.jsのコントローラーを入れておく
        scope.datCtls = {};

        // @if dat.guiのautoPlaceがfalseのとき
        if (scope.dat.autoPlace == false) {

            // @desc dat.gui.jsでautoPlaceをfalseにしたときは、gui.domElementのheightが0になってるので
            //       スクロールさせたい場合は、heightを設定させてあげて、overflowYをscrollにする必要がある。
            let dom = scope.dat.domElement;
            dom.setAttribute("id", "Nasikusa-gui");

            // 適用するCSS
            let guiStyles = [
                ["height", window.innerHeight + "px"],
                ["position", "fixed"],
                ["top", 0 + "px"],
                ["right", 0 + "px"],
                ["z-index", 1000],
                ["overflowY", "scroll"],
                ["overflowX", "hidden"],
                ["transform", "translateX(150px)"],
                ["opacity", 0.5],
                ["transition", "transform 0.25s ease,opacity 0.25s ease"],
            ];

            guiStyles.forEach(function(value, index, array) {
                dom.style[value[0]] = value[1];
            });
            document.body.appendChild(dom);

            dom.addEventListener("mouseenter", function() {
                dom.style.transform = "translateX(0px)";
                dom.style.opacity = 1;
            });

            dom.addEventListener("mouseleave", function() {
                dom.style.transform = "translateX(150px)";
                dom.style.opacity = 0.5;
            })

        }

        //=====================================================
        // カメラ
        //=====================================================

        // フォルダ Camera ( datCamera )
        scope.datFlds.datCamera = scope.dat.addFolder("Camera");
        scope.datFlds.datCamera.close();
        // フォルダ position ( datCamera -> datCameraPosition )
        scope.datFlds.datCameraPosition = scope.datFlds.datCamera.addFolder("position");
        scope.datFlds.datCameraPosition.open();
        // フォルダ rotation ( datCamera -> datCameraRotation )
        scope.datFlds.datCameraRotation = scope.datFlds.datCamera.addFolder("rotation");
        scope.datFlds.datCameraRotation.open();
        // フォルダ rotation ( datCamera -> datCameraRotation )
        scope.datFlds.datCameraLookAt = scope.datFlds.datCamera.addFolder("lookAt");
        scope.datFlds.datCameraLookAt.open();
        // camera perspective
        scope.datCtls.cameraPerspective = scope.datFlds.datCamera.add(scope.guiOpt.camera, "perspective");
        scope.datCtls.cameraPerspective.onChange(scope.datChange.bind(scope, "camera.perspective"));
        // camera orthographic
        scope.datCtls.cameraOrthographic = scope.datFlds.datCamera.add(scope.guiOpt.camera, "orthographic");
        scope.datCtls.cameraOrthographic.onChange(scope.datChange.bind(scope, "camera.orthographic"));
        // camera fov
        scope.datCtls.cameraFov = scope.datFlds.datCamera.add(scope.guiOpt.camera, "fov", 0, 70, 0.01);
        scope.datCtls.cameraFov.onChange(scope.datChange.bind(scope, "camera.fov"));
        // camera near
        scope.datCtls.cameraNear = scope.datFlds.datCamera.add(scope.guiOpt.camera, "near", 0, 100, 0.01);
        scope.datCtls.cameraNear.onChange(scope.datChange.bind(scope, "camera.near"));
        // camera far
        scope.datCtls.cameraFar = scope.datFlds.datCamera.add(scope.guiOpt.camera, "far", 0, 500, 0.01);
        scope.datCtls.cameraFar.onChange(scope.datChange.bind(scope, "camera.far"));
        // camera zoom
        scope.datCtls.cameraZoom = scope.datFlds.datCamera.add(scope.guiOpt.camera, "zoom", 0, 5, 0.01);
        scope.datCtls.cameraZoom.onChange(scope.datChange.bind(scope, "camera.zoom"));
        // camera position x
        scope.datCtls.cameraPositionX = scope.datFlds.datCameraPosition.add(scope.guiOpt.camera.position, "x", -10, 10, 0.01);
        scope.datCtls.cameraPositionX.onChange(scope.datChange.bind(scope, "camera.position.x"));
        scope.datCtls.cameraPositionX.listen();
        // camera position y
        scope.datCtls.cameraPositionY = scope.datFlds.datCameraPosition.add(scope.guiOpt.camera.position, "y", -10, 10, 0.01);
        scope.datCtls.cameraPositionY.onChange(scope.datChange.bind(scope, "camera.position.y"));
        scope.datCtls.cameraPositionY.listen();
        // camera position z
        scope.datCtls.cameraPositionZ = scope.datFlds.datCameraPosition.add(scope.guiOpt.camera.position, "z", -10, 10, 0.01);
        scope.datCtls.cameraPositionZ.onChange(scope.datChange.bind(scope, "camera.position.z"));
        scope.datCtls.cameraPositionZ.listen();
        // camera position copy
        scope.datCtls.cameraPositionCopy = scope.datFlds.datCameraPosition.add(scope.guiOpt.camera.position, "copy");
        // camera rotation enabled
        scope.datCtls.cameraRotationEnabled = scope.datFlds.datCameraRotation.add(scope.guiOpt.camera.rotation, "enabled");
        scope.datCtls.cameraRotationEnabled.onChange(scope.datChange.bind(scope, "camera.rotation.enabled"));
        // camera rotation x
        scope.datCtls.cameraRotationX = scope.datFlds.datCameraRotation.add(scope.guiOpt.camera.rotation, "x", -360, 360, 0.01);
        scope.datCtls.cameraRotationX.onChange(scope.datChange.bind(scope, "camera.rotation.x"));
        scope.datCtls.cameraRotationX.listen();
        // camera rotation y
        scope.datCtls.cameraRotationY = scope.datFlds.datCameraRotation.add(scope.guiOpt.camera.rotation, "y", -360, 360, 0.01);
        scope.datCtls.cameraRotationY.onChange(scope.datChange.bind(scope, "camera.rotation.y"));
        scope.datCtls.cameraRotationY.listen();
        // camera rotation z
        scope.datCtls.cameraRotationZ = scope.datFlds.datCameraRotation.add(scope.guiOpt.camera.rotation, "z", -360, 360, 0.01);
        scope.datCtls.cameraRotationZ.onChange(scope.datChange.bind(scope, "camera.rotation.z"));
        scope.datCtls.cameraRotationZ.listen();
        // camera rotation copy
        scope.datCtls.cameraRotationCopy = scope.datFlds.datCameraRotation.add(scope.guiOpt.camera.rotation, "copy");
        // camera lookAt enabled
        scope.datCtls.cameraLookAtEnabled = scope.datFlds.datCameraLookAt.add(scope.guiOpt.camera.lookAt, "enabled");
        scope.datCtls.cameraLookAtEnabled.onChange(scope.datChange.bind(scope, "camera.lookAt.enabled"));
        // camera lookAt x
        scope.datCtls.cameraLookAtX = scope.datFlds.datCameraLookAt.add(scope.guiOpt.camera.lookAt, "x", -10, 10, 0.01);
        scope.datCtls.cameraLookAtX.onChange(scope.datChange.bind(scope, "camera.lookAt.x"));
        // camera lookAt y
        scope.datCtls.cameraLookAtY = scope.datFlds.datCameraLookAt.add(scope.guiOpt.camera.lookAt, "y", -10, 10, 0.01);
        scope.datCtls.cameraLookAtY.onChange(scope.datChange.bind(scope, "camera.lookAt.y"));
        // camera lookAt z
        scope.datCtls.cameraLookAtZ = scope.datFlds.datCameraLookAt.add(scope.guiOpt.camera.lookAt, "z", -10, 10, 0.01);
        scope.datCtls.cameraLookAtZ.onChange(scope.datChange.bind(scope, "camera.lookAt.z"));
        // camera lookAt copy
        scope.datCtls.cameraLookAtCopy = scope.datFlds.datCameraLookAt.add(scope.guiOpt.camera.lookAt, "copy");
        // camera reset
        scope.datCtls.cameraReset = scope.datFlds.datCamera.add(scope.guiOpt.camera, "reset");
        scope.datCtls.cameraAllCopy = scope.datFlds.datCamera.add(scope.guiOpt.camera, "cameraAllCopy");

        //=====================================================
        // ランダムカラー
        //=====================================================



        // フォルダ randomColor ( datRandomColor )
        scope.datFlds.datRandomColor = scope.dat.addFolder("randomColor");
        scope.datFlds.datRandomColor.open();

        var optRandomGeneral = scope.guiOpt.randomColorGeneral;

        for (var i = 0; i < scope.setting.randomColor.length; i++) {

            // 変数定義とフォルダの作成
            let flds, ctls, opt;
            scope.datFlds.datRandomColor[i] = scope.datFlds.datRandomColor.addFolder(`group${i}`);
            scope.datFlds.datRandomColor[i].open();
            if (i == 0) {
                scope.datCtls.datRandomColor = [];
            }
            scope.datCtls.datRandomColor[i] = {};
            flds = scope.datFlds.datRandomColor[i];
            ctls = scope.datCtls.datRandomColor[i];
            opt = scope.guiOpt.randomColor[i];

            flds["color"] = scope.datFlds.datRandomColor[i].addFolder('color');
            flds["color"].open();



            // list
            flds["colorList"] = flds["color"].addFolder('list');
            flds["colorList"].open();
            // カラー数の分処理を行う
            for (var j = 0; j < scope.setting.randomColor[i].color.length; j++) {
                // カラー
                ctls[`randomColorColor${j}`] = flds["colorList"].addColor(opt.color, j);
                // ctls[`randomColorColor${j}`] = flds["colorList"].addColor( opt , `color${j}` );
                ctls[`randomColorColor${j}`].onChange(scope.datChange.bind(scope, "randomColor.color", {
                    randomColorGroupNumber: i,
                    randomColorArrayNumber: j
                }));
                ctls[`randomColorColor${j}`].onFinishChange(scope.datChange.bind(scope, "randomColor.color", {
                    randomColorGroupNumber: i,
                    randomColorArrayNumber: j,
                    isFinish: true
                }));
            }

            flds["domain"] = flds["color"].addFolder('domain');
            // flds["domain"].open();
            // ドメイン
            ctls.randomColorEnableDomain = flds["domain"].add(opt, 'enableDomain');
            ctls.randomColorEnableDomain.onFinishChange(scope.datChange.bind(scope, "randomColor.enableDomain", {
                randomColorGroupNumber: i
            }));

            // カラー数の分ドメインの処理を行う
            for (var j = 0; j < scope.setting.randomColor[i].color.length; j++) {
                // ドメイン
                // ctls[`randomColorDomain${j}`] = flds["domain"].add( opt , `domain${j}` , 0 , 1 , 0.01 );
                ctls[`randomColorDomain${j}`] = flds["domain"].add(opt.domain, j, 0, 1, 0.01);
                ctls[`randomColorDomain${j}`].onChange(scope.datChange.bind(scope, "randomColor.domain", {
                    randomColorGroupNumber: i,
                    randomColorArrayNumber: j
                }));
                ctls[`randomColorDomain${j}`].onFinishChange(scope.datChange.bind(scope, "randomColor.domain", {
                    randomColorGroupNumber: i,
                    randomColorArrayNumber: j,
                    isFinish: true
                }));
            }


            // カラー設定フォルダ ( flds["color"]下 )
            flds["colorSetting"] = flds["color"].addFolder('setting');
            // flds["colorSetting"].open();
            // カラー設定 モード
            ctls.randomColorMode = flds["colorSetting"].add(opt, 'mode', ['rgb', 'hsl', 'lch', 'lab']);
            ctls.randomColorMode.onFinishChange(scope.datChange.bind(scope, "randomColor.mode", {
                randomColorGroupNumber: i
            }));
            // カラー設定 ベジェの有効化
            ctls.randomColorBezier = flds["colorSetting"].add(opt, 'enableBezier');
            ctls.randomColorBezier.onFinishChange(scope.datChange.bind(scope, "randomColor.enableBezier", {
                randomColorGroupNumber: i
            }));
            // カラー設定 追加
            ctls.randomColorAdd = flds["colorSetting"].add(opt, 'addColor');
            // カラー設定 削除
            ctls.randomColorRemove = flds["colorSetting"].add(opt, 'removeColor');





            // パディング
            flds["padding"] = scope.datFlds.datRandomColor[i].addFolder('padding');
            // flds["padding"].open();
            ctls.randomColorEnablePadding = flds["padding"].add(opt, 'enablePadding');
            ctls.randomColorEnablePadding.onFinishChange(scope.datChange.bind(scope, "randomColor.enablePadding", {
                randomColorGroupNumber: i
            }));
            ctls.randomColorPadding = flds["padding"].add(opt, 'padding', -0.5, 0.5, 0.01);
            ctls.randomColorPadding.onChange(scope.datChange.bind(scope, "randomColor.padding", {
                randomColorGroupNumber: i
            }));
            ctls.randomColorPadding.onFinishChange(scope.datChange.bind(scope, "randomColor.padding", {
                randomColorGroupNumber: i,
                isFinish: true
            }));
            // ガンマ
            flds["gamma"] = scope.datFlds.datRandomColor[i].addFolder('gamma');
            // flds["gamma"].open();
            ctls.randomColorEnableGamma = flds["gamma"].add(opt, 'enableGamma');
            ctls.randomColorEnableGamma.onFinishChange(scope.datChange.bind(scope, "randomColor.enableGamma", {
                randomColorGroupNumber: i
            }));
            ctls.randomColorGamma = flds["gamma"].add(opt, 'gamma', -1, 6, 0.01);
            ctls.randomColorGamma.onChange(scope.datChange.bind(scope, "randomColor.gamma", {
                randomColorGroupNumber: i
            }));
            ctls.randomColorGamma.onFinishChange(scope.datChange.bind(scope, "randomColor.gamma", {
                randomColorGroupNumber: i,
                isFinish: true
            }));

            // クラスフォルダ
            flds["classes"] = scope.datFlds.datRandomColor[i].addFolder('classes');
            // flds["classes"].open();
            // 管理用のオブジェクト
            ctls.classes = {};
            ctls.classes.custom = {};
            var classesCtls = ctls.classes;
            // クラス 有効か無効
            classesCtls.enable = flds["classes"].add(opt, 'enableClasses');
            classesCtls.enable.onFinishChange(scope.datChange.bind(scope, "randomColor.enableClasses", {
                randomColorGroupNumber: i
            }));
            // クラス
            classesCtls.number = flds["classes"].add(opt, 'classes', 2, 10, 1);
            classesCtls.number.onChange(scope.datChange.bind(scope, "randomColor.classes", {
                randomColorGroupNumber: i
            }));
            classesCtls.number.onFinishChange(scope.datChange.bind(scope, "randomColor.classes", {
                randomColorGroupNumber: i,
                isFinish: true
            }));
            // クラスフォルダ
            // flds["customClasses"] = flds["classes"].addFolder('customClasses');
            // flds["customClasses"].open();
            // クラス 有効か無効
            // classesCtls.custom.enable = flds["customClasses"].add( opt, 'enableCustomClasses' );
            // classesCtls.custom.enable.onFinishChange( scope.datChange.bind( scope , "randomColor.classes.enableCustom" , { randomColorGroupNumber : i  }));
            // クラスフォルダ
            // flds["customClassesParams"] = flds["customClasses"].addFolder('params');
            // flds["customClassesParams"].open();
            // カスタムクラスのパラメータを管理する配列
            // classesCtls.custom.params = [];
            // for( let j = 0 ; j < scope.setting.randomColor[i].classes + 1 ; j++  ){
            //     classesCtls.custom.params[j] = flds["customClassesParams"].add( opt["customClasses"] , j , 0 , 1 , 0.01 );
            //     classesCtls.custom.params[j].onChange( scope.datChange.bind( scope , "randomColor.classes.customParam" , { randomColorGroupNumber : i , randomColorCustomClassesNumber : j  }));
            //     classesCtls.custom.params[j].onFinishChange( scope.datChange.bind( scope , "randomColor.classes.customParam" , { randomColorGroupNumber : i , randomColorCustomClassesNumber : j , isFinish : true }));
            // }

            // setRGB フォルダ
            flds["setRGB"] = scope.datFlds.datRandomColor[i].addFolder('setRGB');
            flds["setRGB"].open();
            // setCMYK フォルダ
            flds["setCMYK"] = scope.datFlds.datRandomColor[i].addFolder('setCMYK');
            // flds["setCMYK"].open();
            // setHSL フォルダ
            flds["setHSL"] = scope.datFlds.datRandomColor[i].addFolder('setHSL');
            flds["setHSL"].open();

            // セット RGB
            // 赤
            ctls.randomColorSetRGB_ER = flds["setRGB"].add(opt["setRGB"], "enableRed");
            ctls.randomColorSetRGB_ER.onFinishChange(scope.datChange.bind(scope, "randomColor.setRGB", {
                randomColorGroupNumber: i,
                randomColorSetRGB_Enable: true,
                randomColorSetRGB_Color: "r",
            }));
            ctls.randomColorSetRGB_TR = flds["setRGB"].add(opt["setRGB"], 'redCalcType', ["+", "-", "*", "/", "="]);
            ctls.randomColorSetRGB_TR.onFinishChange(scope.datChange.bind(scope, "randomColor.setRGB", {
                randomColorGroupNumber: i,
                randomColorSetRGB_Type: true,
                randomColorSetRGB_Color: "r"
            }));
            ctls.randomColorSetRGB_R = flds["setRGB"].add(opt["setRGB"], 'red', 0, 255, 0.01);
            ctls.randomColorSetRGB_R.onChange(scope.datChange.bind(scope, "randomColor.setRGB", {
                randomColorGroupNumber: i,
                randomColorSetRGB_Type: false,
                randomColorSetRGB_Color: "r"
            }));
            ctls.randomColorSetRGB_R.onFinishChange(scope.datChange.bind(scope, "randomColor.setRGB", {
                randomColorGroupNumber: i,
                randomColorSetRGB_Type: false,
                randomColorSetRGB_Color: "r",
                isFinish: true
            }));
            // 緑
            ctls.randomColorSetRGB_EG = flds["setRGB"].add(opt["setRGB"], "enableGreen");
            ctls.randomColorSetRGB_EG.onFinishChange(scope.datChange.bind(scope, "randomColor.setRGB", {
                randomColorGroupNumber: i,
                randomColorSetRGB_Enable: true,
                randomColorSetRGB_Color: "g",
            }));
            ctls.randomColorSetRGB_TG = flds["setRGB"].add(opt["setRGB"], 'greenCalcType', ["+", "-", "*", "/", "="]);
            ctls.randomColorSetRGB_TG.onFinishChange(scope.datChange.bind(scope, "randomColor.setRGB", {
                randomColorGroupNumber: i,
                randomColorSetRGB_Type: true,
                randomColorSetRGB_Color: "g"
            }));
            ctls.randomColorSetRGB_G = flds["setRGB"].add(opt["setRGB"], 'green', 0, 255, 0.01);
            ctls.randomColorSetRGB_G.onChange(scope.datChange.bind(scope, "randomColor.setRGB", {
                randomColorGroupNumber: i,
                randomColorSetRGB_Type: false,
                randomColorSetRGB_Color: "g"
            }));
            ctls.randomColorSetRGB_G.onFinishChange(scope.datChange.bind(scope, "randomColor.setRGB", {
                randomColorGroupNumber: i,
                randomColorSetRGB_Type: false,
                randomColorSetRGB_Color: "g",
                isFinish: true
            }));
            // 青
            ctls.randomColorSetRGB_EB = flds["setRGB"].add(opt["setRGB"], "enableBlue");
            ctls.randomColorSetRGB_EB.onFinishChange(scope.datChange.bind(scope, "randomColor.setRGB", {
                randomColorGroupNumber: i,
                randomColorSetRGB_Enable: true,
                randomColorSetRGB_Color: "b",
            }));
            ctls.randomColorSetRGB_TB = flds["setRGB"].add(opt["setRGB"], 'blueCalcType', ["+", "-", "*", "/", "="]);
            ctls.randomColorSetRGB_TB.onFinishChange(scope.datChange.bind(scope, "randomColor.setRGB", {
                randomColorGroupNumber: i,
                randomColorSetRGB_Type: true,
                randomColorSetRGB_Color: "b"
            }));
            ctls.randomColorSetRGB_B = flds["setRGB"].add(opt["setRGB"], 'blue', 0, 255, 0.01);
            ctls.randomColorSetRGB_B.onChange(scope.datChange.bind(scope, "randomColor.setRGB", {
                randomColorGroupNumber: i,
                randomColorSetRGB_Type: false,
                randomColorSetRGB_Color: "b"
            }));
            ctls.randomColorSetRGB_B.onFinishChange(scope.datChange.bind(scope, "randomColor.setRGB", {
                randomColorGroupNumber: i,
                randomColorSetRGB_Type: false,
                randomColorSetRGB_Color: "b",
                isFinish: true
            }));


            // セット CMYK
            // C
            ctls.randomColorSetCMYK_EC = flds["setCMYK"].add(opt["setCMYK"], "enableCyan");
            ctls.randomColorSetCMYK_EC.onFinishChange(scope.datChange.bind(scope, "randomColor.setCMYK", {
                randomColorGroupNumber: i,
                randomColorSetCMYK_Enable: true,
                randomColorSetCMYK_Color: "c",
            }));
            ctls.randomColorSetCMYK_TC = flds["setCMYK"].add(opt["setCMYK"], 'cyanCalcType', ["+", "-", "*", "/", "="]);
            ctls.randomColorSetCMYK_TC.onFinishChange(scope.datChange.bind(scope, "randomColor.setCMYK", {
                randomColorGroupNumber: i,
                randomColorSetCMYK_Type: true,
                randomColorSetCMYK_Color: "c"
            }));
            ctls.randomColorSetCMYK_C = flds["setCMYK"].add(opt["setCMYK"], 'cyan', 0, 1, 0.01);
            ctls.randomColorSetCMYK_C.onChange(scope.datChange.bind(scope, "randomColor.setCMYK", {
                randomColorGroupNumber: i,
                randomColorSetCMYK_Type: false,
                randomColorSetCMYK_Color: "c"
            }));
            ctls.randomColorSetCMYK_C.onFinishChange(scope.datChange.bind(scope, "randomColor.setCMYK", {
                randomColorGroupNumber: i,
                randomColorSetCMYK_Type: false,
                randomColorSetCMYK_Color: "c",
                isFinish: true
            }));
            // M
            ctls.randomColorSetCMYK_EM = flds["setCMYK"].add(opt["setCMYK"], "enableMagenta");
            ctls.randomColorSetCMYK_EM.onFinishChange(scope.datChange.bind(scope, "randomColor.setCMYK", {
                randomColorGroupNumber: i,
                randomColorSetCMYK_Enable: true,
                randomColorSetCMYK_Color: "m",
            }));
            ctls.randomColorSetCMYK_TM = flds["setCMYK"].add(opt["setCMYK"], 'magentaCalcType', ["+", "-", "*", "/", "="]);
            ctls.randomColorSetCMYK_TM.onFinishChange(scope.datChange.bind(scope, "randomColor.setCMYK", {
                randomColorGroupNumber: i,
                randomColorSetCMYK_Type: true,
                randomColorSetCMYK_Color: "m"
            }));
            ctls.randomColorSetCMYK_M = flds["setCMYK"].add(opt["setCMYK"], 'magenta', 0, 1, 0.01);
            ctls.randomColorSetCMYK_M.onChange(scope.datChange.bind(scope, "randomColor.setCMYK", {
                randomColorGroupNumber: i,
                randomColorSetCMYK_Type: false,
                randomColorSetCMYK_Color: "m"
            }));
            ctls.randomColorSetCMYK_M.onFinishChange(scope.datChange.bind(scope, "randomColor.setCMYK", {
                randomColorGroupNumber: i,
                randomColorSetCMYK_Type: false,
                randomColorSetCMYK_Color: "m",
                isFinish: true
            }));
            // Y
            ctls.randomColorSetCMYK_EY = flds["setCMYK"].add(opt["setCMYK"], "enableYellow");
            ctls.randomColorSetCMYK_EY.onFinishChange(scope.datChange.bind(scope, "randomColor.setCMYK", {
                randomColorGroupNumber: i,
                randomColorSetCMYK_Enable: true,
                randomColorSetCMYK_Color: "y",
            }));
            ctls.randomColorSetCMYK_TY = flds["setCMYK"].add(opt["setCMYK"], 'yellowCalcType', ["+", "-", "*", "/", "="]);
            ctls.randomColorSetCMYK_TY.onFinishChange(scope.datChange.bind(scope, "randomColor.setCMYK", {
                randomColorGroupNumber: i,
                randomColorSetCMYK_Type: true,
                randomColorSetCMYK_Color: "y"
            }));
            ctls.randomColorSetCMYK_Y = flds["setCMYK"].add(opt["setCMYK"], 'yellow', 0, 1, 0.01);
            ctls.randomColorSetCMYK_Y.onChange(scope.datChange.bind(scope, "randomColor.setCMYK", {
                randomColorGroupNumber: i,
                randomColorSetCMYK_Type: false,
                randomColorSetCMYK_Color: "y"
            }));
            ctls.randomColorSetCMYK_Y.onFinishChange(scope.datChange.bind(scope, "randomColor.setCMYK", {
                randomColorGroupNumber: i,
                randomColorSetCMYK_Type: false,
                randomColorSetCMYK_Color: "y",
                isFinish: true
            }));
            // K
            ctls.randomColorSetCMYK_EK = flds["setCMYK"].add(opt["setCMYK"], "enableKey");
            ctls.randomColorSetCMYK_EK.onFinishChange(scope.datChange.bind(scope, "randomColor.setCMYK", {
                randomColorGroupNumber: i,
                randomColorSetCMYK_Enable: true,
                randomColorSetCMYK_Color: "k",
            }));
            ctls.randomColorSetCMYK_TK = flds["setCMYK"].add(opt["setCMYK"], 'keyCalcType', ["+", "-", "*", "/", "="]);
            ctls.randomColorSetCMYK_TK.onFinishChange(scope.datChange.bind(scope, "randomColor.setCMYK", {
                randomColorGroupNumber: i,
                randomColorSetCMYK_Type: true,
                randomColorSetCMYK_Color: "k"
            }));
            ctls.randomColorSetCMYK_K = flds["setCMYK"].add(opt["setCMYK"], 'key', 0, 1, 0.01);
            ctls.randomColorSetCMYK_K.onChange(scope.datChange.bind(scope, "randomColor.setCMYK", {
                randomColorGroupNumber: i,
                randomColorSetCMYK_Type: false,
                randomColorSetCMYK_Color: "k"
            }));
            ctls.randomColorSetCMYK_K.onFinishChange(scope.datChange.bind(scope, "randomColor.setCMYK", {
                randomColorGroupNumber: i,
                randomColorSetCMYK_Type: false,
                randomColorSetCMYK_Color: "k",
                isFinish: true
            }));


            // セット HSL
            // Hue
            ctls.randomColorSetHSL_EH = flds["setHSL"].add(opt["setHSL"], 'enableHue');
            ctls.randomColorSetHSL_EH.onFinishChange(scope.datChange.bind(scope, "randomColor.setHSL", {
                randomColorGroupNumber: i,
                randomColorSetHSL_Enable: true,
                randomColorSetHSL_Color: "h"
            }));
            ctls.randomColorSetHSL_TH = flds["setHSL"].add(opt["setHSL"], 'hueCalcType', ["+", "-", "*", "/", "="]);
            ctls.randomColorSetHSL_TH.onFinishChange(scope.datChange.bind(scope, "randomColor.setHSL", {
                randomColorGroupNumber: i,
                randomColorSetHSL_Type: true,
                randomColorSetHSL_Color: "h"
            }));
            ctls.randomColorSetHSL_H = flds["setHSL"].add(opt["setHSL"], 'hue', 0, 180, 0.01);
            ctls.randomColorSetHSL_H.onChange(scope.datChange.bind(scope, "randomColor.setHSL", {
                randomColorGroupNumber: i,
                randomColorSetHSL_Type: false,
                randomColorSetHSL_Color: "h"
            }));
            ctls.randomColorSetHSL_H.onFinishChange(scope.datChange.bind(scope, "randomColor.setHSL", {
                randomColorGroupNumber: i,
                randomColorSetHSL_Type: false,
                randomColorSetHSL_Color: "h",
                isFinish: true
            }));
            // Saturation
            ctls.randomColorSetHSL_ES = flds["setHSL"].add(opt["setHSL"], 'enableSaturation');
            ctls.randomColorSetHSL_ES.onFinishChange(scope.datChange.bind(scope, "randomColor.setHSL", {
                randomColorGroupNumber: i,
                randomColorSetHSL_Enable: true,
                randomColorSetHSL_Color: "s"
            }));
            ctls.randomColorSetHSL_TS = flds["setHSL"].add(opt["setHSL"], 'saturationCalcType', ["+", "-", "*", "/", "="]);
            ctls.randomColorSetHSL_TS.onFinishChange(scope.datChange.bind(scope, "randomColor.setHSL", {
                randomColorGroupNumber: i,
                randomColorSetHSL_Type: true,
                randomColorSetHSL_Color: "s"
            }));
            ctls.randomColorSetHSL_S = flds["setHSL"].add(opt["setHSL"], 'saturation', 0, 1, 0.01);
            ctls.randomColorSetHSL_S.onChange(scope.datChange.bind(scope, "randomColor.setHSL", {
                randomColorGroupNumber: i,
                randomColorSetHSL_Type: false,
                randomColorSetHSL_Color: "s"
            }));
            ctls.randomColorSetHSL_S.onFinishChange(scope.datChange.bind(scope, "randomColor.setHSL", {
                randomColorGroupNumber: i,
                randomColorSetHSL_Type: false,
                randomColorSetHSL_Color: "s",
                isFinish: true
            }));
            // Luminance
            ctls.randomColorSetHSL_EL = flds["setHSL"].add(opt["setHSL"], 'enableLuminance');
            ctls.randomColorSetHSL_EL.onFinishChange(scope.datChange.bind(scope, "randomColor.setHSL", {
                randomColorGroupNumber: i,
                randomColorSetHSL_Enable: true,
                randomColorSetHSL_Color: "l"
            }));
            ctls.randomColorSetHSL_TL = flds["setHSL"].add(opt["setHSL"], 'luminanceCalcType', ["+", "-", "*", "/", "="]);
            ctls.randomColorSetHSL_TL.onFinishChange(scope.datChange.bind(scope, "randomColor.setHSL", {
                randomColorGroupNumber: i,
                randomColorSetHSL_Type: true,
                randomColorSetHSL_Color: "l"
            }));
            ctls.randomColorSetHSL_L = flds["setHSL"].add(opt["setHSL"], 'luminance', 0, 1, 0.01);
            ctls.randomColorSetHSL_L.onChange(scope.datChange.bind(scope, "randomColor.setHSL", {
                randomColorGroupNumber: i,
                randomColorSetHSL_Type: false,
                randomColorSetHSL_Color: "l"
            }));
            ctls.randomColorSetHSL_L.onFinishChange(scope.datChange.bind(scope, "randomColor.setHSL", {
                randomColorGroupNumber: i,
                randomColorSetHSL_Type: false,
                randomColorSetHSL_Color: "l",
                isFinish: true
            }));

            // mixフォルダ
            flds["mix"] = scope.datFlds.datRandomColor[i].addFolder('mix');
            flds["mix"].open();
            // ミックス 有効か無効
            ctls.randomColorEnableMix = flds["mix"].add(opt, 'enableMix');
            ctls.randomColorEnableMix.onFinishChange(scope.datChange.bind(scope, "randomColor.enableMix", {
                randomColorGroupNumber: i
            }));
            // ミックス 色
            ctls.randomColorMixColor = flds["mix"].addColor(opt, 'mixColor');
            ctls.randomColorMixColor.onChange(scope.datChange.bind(scope, "randomColor.mixColor", {
                randomColorGroupNumber: i
            }));
            ctls.randomColorMixColor.onFinishChange(scope.datChange.bind(scope, "randomColor.mixColor", {
                randomColorGroupNumber: i,
                isFinish: true
            }));
            // ミックス 割合
            ctls.randomColorMixRatio = flds["mix"].add(opt, 'mixRatio', 0, 1, 0.01);
            ctls.randomColorMixRatio.onChange(scope.datChange.bind(scope, "randomColor.mixRatio", {
                randomColorGroupNumber: i
            }));
            ctls.randomColorMixRatio.onFinishChange(scope.datChange.bind(scope, "randomColor.mixRatio", {
                randomColorGroupNumber: i,
                isFinish: true
            }));
            // ミックス モード
            ctls.randomColorMixMode = flds["mix"].add(opt, 'mixMode', ["rgb", "hsl", "lch", "lab"]);
            ctls.randomColorMixMode.onFinishChange(scope.datChange.bind(scope, "randomColor.mixMode", {
                randomColorGroupNumber: i
            }));
            // blendフォルダ
            flds["blend"] = scope.datFlds.datRandomColor[i].addFolder('blend');
            flds["blend"].open();
            // ブレンド 有効か無効
            ctls.randomColorEnableBlend = flds["blend"].add(opt, 'enableBlend');
            ctls.randomColorEnableBlend.onFinishChange(scope.datChange.bind(scope, "randomColor.enableBlend", {
                randomColorGroupNumber: i
            }));
            // ブレンド 色
            ctls.randomColorBlendColor = flds["blend"].addColor(opt, 'blendColor');
            ctls.randomColorBlendColor.onChange(scope.datChange.bind(scope, "randomColor.blendColor", {
                randomColorGroupNumber: i
            }));
            ctls.randomColorBlendColor.onFinishChange(scope.datChange.bind(scope, "randomColor.blendColor", {
                randomColorGroupNumber: i,
                isFinish: true
            }));
            // ブレンド モード
            ctls.randomColorBlendMode = flds["blend"].add(opt, 'blendMode', ["multiply", "darken", "lighten", "screen", "overlay", "burn", "dodge"]);
            ctls.randomColorBlendMode.onFinishChange(scope.datChange.bind(scope, "randomColor.blendMode", {
                randomColorGroupNumber: i
            }));

            // functionsフォルダ
            flds["functions"] = scope.datFlds.datRandomColor[i].addFolder('functions');
            flds["functions"].open();
            // ランダムカラーのfunctionsはここのオブジェクトで管理します
            ctls.randomColorFunctions = {};
            flds["showGradation"] = flds["functions"].addFolder('showGradation');
            flds["showGradation"].open();

            // グラデーション表示
            ctls.randomColorFunctions.showGradation = {};
            // 長いので一旦ここにまとめます
            var showGraCtls = ctls.randomColorFunctions.showGradation;
            showGraCtls.showGradation = flds["showGradation"].add(opt.functions.showGradation, 'showGradation');
            showGraCtls.showGradation.onFinishChange(scope.datChange.bind(scope, "randomColor.showGradation", {
                randomColorGroupNumber: i
            }));
            if (opt.functions.showGradation.showGradation) {
                scope.initShowGradation({
                    groupNumber: i
                });
            }
            // グラデーション 横幅
            showGraCtls.width = flds["showGradation"].add(opt["functions"]["showGradation"], 'width', 50, 1000, 1);
            showGraCtls.width.onChange(scope.datChange.bind(scope, "randomColor.showGradation.width", {
                randomColorGroupNumber: i
            }));
            showGraCtls.width.onFinishChange(scope.datChange.bind(scope, "randomColor.showGradation.width", {
                randomColorGroupNumber: i,
                isFinish: true
            }));
            // グラデーション 縦幅
            showGraCtls.height = flds["showGradation"].add(opt["functions"]["showGradation"], 'height', 5, 150, 1);
            showGraCtls.height.onChange(scope.datChange.bind(scope, "randomColor.showGradation.height", {
                randomColorGroupNumber: i
            }));
            showGraCtls.height.onFinishChange(scope.datChange.bind(scope, "randomColor.showGradation.height", {
                randomColorGroupNumber: i,
                isFinish: true
            }));
            // グラデーション horizontalPosition 水平ポジション
            showGraCtls.horizontalPosition = flds["showGradation"].add(opt["functions"]["showGradation"], 'horizontalPosition', ["left", "center", "right"]);
            showGraCtls.horizontalPosition.onFinishChange(scope.datChange.bind(scope, "randomColor.showGradation.horizontalPosition", {
                randomColorGroupNumber: i
            }));
            // グラデーション verticalPosition 縦ポジション
            showGraCtls.verticalPosition = flds["showGradation"].add(opt["functions"]["showGradation"], 'verticalPosition', ["top", "center", "bottom"]);
            showGraCtls.verticalPosition.onFinishChange(scope.datChange.bind(scope, "randomColor.showGradation.verticalPosition", {
                randomColorGroupNumber: i
            }));


            flds["showPreset"] = flds["functions"].addFolder('showPreset');
            flds["showPreset"].open();
            // プリセット表示
            ctls.randomColorFunctions.showPreset = {};
            // 長いので一旦ここにまとめます２
            var showPreCtls = ctls.randomColorFunctions.showPreset;
            showPreCtls.showPreset = flds["showPreset"].add(opt.functions.showPreset, 'showPreset');
            showPreCtls.showPreset.onFinishChange(scope.datChange.bind(scope, "randomColor.showPreset", {
                randomColorGroupNumber: i
            }));

            // optionのshowPresetが最初からtrueの場合はここで起動しておく
            if (opt.functions.showPreset.showPreset) {
                scope.initShowPreset({
                    groupNumber: i
                });
            }

            flds["showFetch"] = flds["functions"].addFolder('showFetch');
            flds["showFetch"].open();
            // フェッチ表示
            ctls.randomColorFunctions.showFetch = {};
            // 長いので一旦ここにまとめます２
            var showFetchCtls = ctls.randomColorFunctions.showFetch;
            showFetchCtls.showFetch = flds["showFetch"].add(opt.functions.showFetch, 'showFetch');
            showFetchCtls.showFetch.onFinishChange(scope.datChange.bind(scope, "randomColor.showFetch", {
                randomColorGroupNumber: i
            }));
            // optionのshowFetchが最初からtrueの場合はここで起動しておく
            if (opt.functions.showFetch.showFetch) {
                scope.initShowFetch({
                    groupNumber: i
                });
            }
            flds["copyToClipboard"] = flds["functions"].addFolder('copyToClipboard');
            flds["copyToClipboard"].open();
            ctls.randomColorFunctions.copyToClipboard = {};
            ctls.randomColorFunctions.copyToClipboard.all = flds["copyToClipboard"].add(opt.functions.copyToClipboard, 'all');
            ctls.randomColorFunctions.copyToClipboard.allMinify = flds["copyToClipboard"].add(opt.functions.copyToClipboard, 'all(minify)');
            ctls.randomColorFunctions.copyToClipboard.color = flds["copyToClipboard"].add(opt.functions.copyToClipboard, 'color');



        }


        // フォルダ randomColorGeneral 全体で使うもの用のフォルダ
        var fldsRandomGen;
        scope.datFlds.datRandomColorGeneral = scope.datFlds.datRandomColor.addFolder("other");
        scope.datFlds.datRandomColorGeneral.open();
        fldsRandomGen = scope.datFlds.datRandomColorGeneral;
        scope.datCtls.randomColorGeneralSpeed = fldsRandomGen.add(scope.guiOpt.randomColorGeneral, "changeSpeed", 0, 400, 10);
        scope.datCtls.randomColorGeneralEnableOnFinishAction = fldsRandomGen.add(scope.guiOpt.randomColorGeneral, "enableFinishAction");


        // ここでカメラフォルダを消してます(一時的に) keyword : 削除,remove,delete
        // scope.dat.removeFolder( scope.datFlds.datCamera );



    }

    /**
     * datgui関数のonChange,onFinishChangeイベントの処理を行う
     * @param  {string} str switch文で処理させるキーワード
     * @param  {object} _s  各々の関数のオリジナルの引数を定義
     * @return {void}
     *
     * @todo カメラとカラー変更などいろいろ増えてきたので今後管理が煩雑にならないように関数を分岐させたほうがいいかも？
     */
    datChange(str, _s) {

        var scope = this;

        if (_s == null) {
            _s = {}
        };

        // @desc randomColorの切り替わり速度を調節
        // @if 引数strに[randomColor]が含まれている場合のみ
        if (str.split(".")[0].toLowerCase() == "randomcolor") {

            // @desc 数字やカラーなどは最後に決定する際にonFinishChangeイベントが発生する(その際にisFinishという引数を持つ)
            // @if 設定のisFinishがtrueのときのみ
            if (_s.isFinish != null && _s.isFinish == true) {

                scope.randomColorChangeFlag = true;
                // @if 設定で無効化されている場合はあとの処理を行わない
                if (scope.guiOpt.randomColorGeneral.enableFinishAction == false) {
                    return false;
                }

            } else {

                // @desc フラッグがfalseの場合は処理を行わない
                // @if randomColorChangeFlagがfalseのとき
                if (scope.randomColorChangeFlag == false) {
                    return;
                } else {

                    scope.randomColorChangeFlag = false;

                    // @desc 設定から読み込んだ時間でflagをtrueにさせる関数を設置
                    setTimeout(scope._randomColorRefreshFlag.bind(scope), scope.guiOpt.randomColorGeneral.changeSpeed);
                }

            }

        }

        if (str.split(".")[0] == "camera") {

            var opt = scope.guiOpt;

        }


        switch (str) {
            case "camera.fov":
                scope.camera.fov = opt.camera.fov;
                scope.camera.updateProjectionMatrix();
                break;
            case "camera.position.x":
                scope.camera.position.x = opt.camera.position.x;
                break;
            case "camera.position.y":
                scope.camera.position.y = opt.camera.position.y;
                break;
            case "camera.position.z":
                scope.camera.position.z = opt.camera.position.z;
                break;
            case "camera.position.copy":
                var camPos = "position : {\n    x : " + scope.camera.position.x + ",\n" + "    y : " + scope.camera.position.y + ",\n" + "    z : " + scope.camera.position.z + ",\n},";
                scope.execCopy(camPos);
                break;
            case "camera.rotation.enabled":
                scope.setting.camera.rotation.enabled = opt.camera.rotation.enabled;
                break;
            case "camera.rotation.x":
                if (scope.setting.camera.rotation.enabled) scope.camera.rotation.x = THREE.Math.degToRad(opt.camera.rotation.x);
                break;
            case "camera.rotation.y":
                if (scope.setting.camera.rotation.enabled) scope.camera.rotation.y = THREE.Math.degToRad(opt.camera.rotation.y);
                break;
            case "camera.rotation.z":
                if (scope.setting.camera.rotation.enabled) scope.camera.rotation.z = THREE.Math.degToRad(opt.camera.rotation.z);
                break;
            case "camera.rotation.copy":
                var camPos = "rotation : {\n    enabled : " + scope.setting.camera.rotation.enabled + ",\n    x : " + THREE.Math.radToDeg(scope.camera.rotation.x) + ",\n" + "    y : " + THREE.Math.radToDeg(scope.camera.rotation.y) + ",\n" + "    z : " + THREE.Math.radToDeg(scope.camera.rotation.z) + ",\n},";
                scope.execCopy(camPos);
                break;
            case "camera.lookAt.x":
                scope.camera.lookAt(new THREE.Vector3(scope.guiOpt.camera.lookAt.x, scope.guiOpt.camera.lookAt.y, scope.guiOpt.camera.lookAt.z));
                break;
            case "camera.lookAt.y":
                scope.camera.lookAt(new THREE.Vector3(scope.guiOpt.camera.lookAt.x, scope.guiOpt.camera.lookAt.y, scope.guiOpt.camera.lookAt.z));
                break;
            case "camera.lookAt.z":
                scope.camera.lookAt(new THREE.Vector3(scope.guiOpt.camera.lookAt.x, scope.guiOpt.camera.lookAt.y, scope.guiOpt.camera.lookAt.z));
                break;
            case "camera.lookAt.copy":
                var camPos = "lookAt : {\n    enabled : " + scope.setting.camera.lookAt.enabled + ",\n    x : " + scope.guiOpt.camera.lookAt.x + ",\n" + "    y : " + scope.guiOpt.camera.lookAt.y + ",\n" + "    z : " + scope.guiOpt.camera.lookAt.z + ",\n},";
                scope.execCopy(camPos);
                break;
            case "camera.near":
                scope.camera.near = opt.camera.near;
                scope.camera.updateProjectionMatrix();
                break;
            case "camera.far":
                scope.camera.far = opt.camera.far;
                scope.camera.updateProjectionMatrix();
                break;
            case "camera.zoom":
                scope.camera.zoom = opt.camera.zoom;
                scope.camera.updateProjectionMatrix();
                break;
            case "camera.reset":
                scope.datCtls.cameraFov.setValue(scope.guiOptBack.camera.fov);
                scope.datCtls.cameraNear.setValue(scope.guiOptBack.camera.near);
                scope.datCtls.cameraFar.setValue(scope.guiOptBack.camera.far);
                scope.datCtls.cameraZoom.setValue(scope.guiOptBack.camera.zoom);
                scope.datCtls.cameraPerspective.setValue(scope.guiOptBack.camera.perspective);
                scope.datCtls.cameraOrthographic.setValue(scope.guiOptBack.camera.orthographic);
                scope.datCtls.cameraPositionX.setValue(scope.guiOptBack.camera.position.x);
                scope.datCtls.cameraPositionY.setValue(scope.guiOptBack.camera.position.y);
                scope.datCtls.cameraPositionZ.setValue(scope.guiOptBack.camera.position.z);
                break;
            case "camera.cameraAllCopy":
                var camType;
                if (scope.camera.type == "PerspectiveCamera") {
                    camType = "perspective";
                } else {
                    camType = "orthographic";
                }
                var camPos = "camera : {\n    type : '" + camType + "',\n    fov : " + scope.camera.fov + ",\n    near : " + scope.camera.near + ",\n    far : " + scope.camera.far + ",\n";
                camPos += "    position : {\n        x : " + scope.camera.position.x + ",\n" + "        y : " + scope.camera.position.y + ",\n" + "        z : " + scope.camera.position.z + ",\n    },\n";
                camPos += "    rotation : {\n        enabled : " + scope.setting.camera.rotation.enabled + ",\n        x : " + THREE.Math.radToDeg(scope.camera.rotation.x) + ",\n" + "        y : " + THREE.Math.radToDeg(scope.camera.rotation.y) + ",\n" + "        z : " + THREE.Math.radToDeg(scope.camera.rotation.z) + ",\n    },\n";
                camPos += "    lookAt : {\n        enabled : " + scope.setting.camera.lookAt.enabled + ",\n        x : " + scope.guiOpt.camera.lookAt.x + ",\n" + "        y : " + scope.guiOpt.camera.lookAt.y + ",\n" + "        z : " + scope.guiOpt.camera.lookAt.z + ",\n    },\n";
                if (camType == "perspective") {
                    camPos += "    perspectiveZoom : " + scope.camera.zoom + ",\n";
                } else {
                    camPos += "    orthoZoom : " + scope.camera.zoom + ",\n";
                }
                camPos += "},";
                scope.execCopy(camPos);
                break;
            case "camera.perspective":
                if (opt.camera.perspective) {
                    scope.datCtls.cameraOrthographic.setValue(false);
                }
                scope.setting.camera.type = "perspective";
                scope.reflectCurrentChangeToSetting();
                scope.createCamera();
                scope.createControls();
                break;
            case "camera.orthographic":
                if (opt.camera.orthographic) {
                    scope.datCtls.cameraPerspective.setValue(false);
                }
                scope.setting.camera.type = "orthographic";
                scope.reflectCurrentChangeToSetting();
                scope.createCamera();
                scope.createControls();
                break;
            case "randomColor.color":
                // scope.setting.randomColor[_s.randomColorGroupNumber].color[_s.randomColorArrayNumber] = scope.guiOpt.randomColor[_s.randomColorGroupNumber][`color${_s.randomColorArrayNumber}`];
                scope.setting.randomColor[_s.randomColorGroupNumber].color[_s.randomColorArrayNumber] = scope.guiOpt.randomColor[_s.randomColorGroupNumber].color[_s.randomColorArrayNumber];
                scope.colorChange({
                    settingNumber: _s.randomColorGroupNumber,
                });
                break;
            case "randomColor.enableBezier":
                if (scope.setting.randomColor[_s.randomColorGroupNumber].color.length >= 6) {
                    alert("色が6色以上の場合はbezier機能は使えません..");
                    return;
                }
                scope.setting.randomColor[_s.randomColorGroupNumber].enableBezier = scope.guiOpt.randomColor[_s.randomColorGroupNumber].enableBezier;
                scope.colorChange({
                    settingNumber: _s.randomColorGroupNumber,
                });
                break;
            case "randomColor.addColor":

                var flds = scope.datFlds.datRandomColor[_s.randomColorGroupNumber];
                var ctls = scope.datCtls.datRandomColor[_s.randomColorGroupNumber];
                var opt = scope.guiOpt.randomColor[_s.randomColorGroupNumber];
                var set = scope.setting.randomColor[_s.randomColorGroupNumber];

                var colNum = opt.color.length;

                // @deprecated
                opt[`color${colNum}`] = "#ffffff";

                // guiOptへの登録
                opt["color"][colNum] = "#ffffff";
                opt["domain"][colNum] = 1.0;
                set.color[colNum] = opt.color[colNum];
                set.domain[colNum] = opt.domain[colNum];

                // コントロールの命名が微妙なので修正したいが...。
                // コントロールの生成
                ctls[`randomColorColor${colNum}`] = flds["colorList"].addColor(opt.color, colNum);
                ctls[`randomColorDomain${colNum}`] = flds["domain"].add(opt.domain, colNum, 0, 1, 0.01);

                // イベントの登録
                ctls[`randomColorColor${colNum}`].onChange(scope.datChange.bind(scope, "randomColor.color", {
                    randomColorGroupNumber: _s.randomColorGroupNumber,
                    randomColorArrayNumber: colNum
                }));
                ctls[`randomColorColor${colNum}`].onFinishChange(scope.datChange.bind(scope, "randomColor.color", {
                    randomColorGroupNumber: _s.randomColorGroupNumber,
                    randomColorArrayNumber: colNum,
                    isFinish: true
                }));
                ctls[`randomColorDomain${colNum}`].onChange(scope.datChange.bind(scope, "randomColor.domain", {
                    randomColorGroupNumber: _s.randomColorGroupNumber,
                    randomColorArrayNumber: colNum
                }));
                ctls[`randomColorDomain${colNum}`].onFinishChange(scope.datChange.bind(scope, "randomColor.domain", {
                    randomColorGroupNumber: _s.randomColorGroupNumber,
                    randomColorArrayNumber: colNum,
                    isFinish: true
                }));

                // ドメインへの値の反映
                for (let i = 0; i < opt["domain"].length; i++) {
                    ctls[`randomColorDomain${i}`].setValue((i / (opt["domain"].length - 1)));
                    set["domain"][i] = i / (opt["domain"].length - 1);
                }

                scope.colorChange({
                    settingNumber: _s.randomColorGroupNumber,
                });

                break;
            case "randomColor.removeColor":


                var flds = scope.datFlds.datRandomColor[_s.randomColorGroupNumber];
                var ctls = scope.datCtls.datRandomColor[_s.randomColorGroupNumber];
                var opt = scope.guiOpt.randomColor[_s.randomColorGroupNumber];
                var set = scope.setting.randomColor[_s.randomColorGroupNumber];

                var colNum = opt.color.length - 1;

                if (opt["color"].length <= 2) {
                    alert("カラーの数は2以下に出来ないです...");
                    return;
                }

                // guiOptの削除
                opt["color"].pop();
                opt["domain"].pop();
                // コントロールの削除
                ctls[`randomColorColor${colNum}`].remove();
                ctls[`randomColorDomain${colNum}`].remove();
                // 設定の削除
                set["color"].pop();
                set["domain"].pop();

                // ドメインへの値の反映
                for (let i = 0; i < opt["domain"].length; i++) {
                    ctls[`randomColorDomain${i}`].setValue((i / (opt["domain"].length - 1)));
                    set["domain"][i] = i / (opt["domain"].length - 1);
                }

                scope.colorChange({
                    settingNumber: _s.randomColorGroupNumber,
                });

                break;
            case "randomColor.showGradation":
                if (scope.guiOpt.randomColor[_s.randomColorGroupNumber]["functions"]["showGradation"]["showGradation"] == true) {
                    scope.initShowGradation({
                        groupNumber: _s.randomColorGroupNumber
                    });
                } else if (scope.guiOpt.randomColor[_s.randomColorGroupNumber]["functions"]["showGradation"]["showGradation"] == false) {
                    scope.deleteShowGradation({
                        groupNumber: _s.randomColorGroupNumber
                    });
                }
                break;
            case "randomColor.showGradation.width":
                if (document.getElementById("Nasikusa-show-gradation") != null) {
                    var elem = document.getElementById("Nasikusa-show-gradation");
                    var opt = scope.guiOpt.randomColor[_s.randomColorGroupNumber];
                    elem.style.width = scope.guiOpt.randomColor[_s.randomColorGroupNumber].functions.showGradation.width + "px";
                    if (opt["functions"]["showGradation"]["horizontalPosition"] == "center") {
                        elem.style.right = "auto";
                        elem.style.left = (window.innerWidth - opt["functions"]["showGradation"]["width"]) / 2 + "px";
                    }
                }
                break;
            case "randomColor.showGradation.height":
                if (document.getElementById("Nasikusa-show-gradation") != null) {
                    var elem = document.getElementById("Nasikusa-show-gradation");
                    var opt = scope.guiOpt.randomColor[_s.randomColorGroupNumber];
                    elem.style.height = scope.guiOpt.randomColor[_s.randomColorGroupNumber].functions.showGradation.height + "px";
                    if (opt["functions"]["showGradation"]["verticalPosition"] == "center") {
                        elem.style.bottom = "auto";
                        elem.style.top = (window.innerHeight - opt["functions"]["showGradation"]["height"]) / 2 + "px";
                    }
                }
                break;
            case "randomColor.showGradation.horizontalPosition":
                if (document.getElementById("Nasikusa-show-gradation") != null) {
                    var elem = document.getElementById("Nasikusa-show-gradation");
                    var opt = scope.guiOpt.randomColor[_s.randomColorGroupNumber];
                    switch (opt["functions"]["showGradation"]["horizontalPosition"]) {
                        case "left":
                            elem.style.right = "auto";
                            elem.style.left = 0;
                            break;
                        case "center":
                            elem.style.right = "auto";
                            elem.style.left = (window.innerWidth - opt["functions"]["showGradation"]["width"]) / 2 + "px";
                            break;
                        case "right":
                            elem.style.left = "auto";
                            elem.style.right = 0;
                            break;
                    }
                }
                break;
            case "randomColor.showGradation.verticalPosition":
                if (document.getElementById("Nasikusa-show-gradation") != null) {
                    var elem = document.getElementById("Nasikusa-show-gradation");
                    var opt = scope.guiOpt.randomColor[_s.randomColorGroupNumber];
                    switch (opt["functions"]["showGradation"]["verticalPosition"]) {
                        case "top":
                            elem.style.bottom = "auto";
                            elem.style.top = 0;
                            break;
                        case "center":
                            elem.style.bottom = "auto";
                            elem.style.top = (window.innerHeight - opt["functions"]["showGradation"]["height"]) / 2 + "px";
                            break;
                        case "bottom":
                            elem.style.top = "auto";
                            elem.style.bottom = 0;
                            break;
                    }
                }
                break;
            case "randomColor.mode":
                scope.setting.randomColor[_s.randomColorGroupNumber].mode = scope.guiOpt.randomColor[_s.randomColorGroupNumber].mode;
                scope.colorChange({
                    settingNumber: _s.randomColorGroupNumber,
                });
                break;
            case "randomColor.enablePadding":

                scope.setting.randomColor[_s.randomColorGroupNumber].enablePadding = scope.guiOpt.randomColor[_s.randomColorGroupNumber].enablePadding;
                scope.colorChange({
                    settingNumber: _s.randomColorGroupNumber,
                });

                break;
            case "randomColor.padding":
                scope.setting.randomColor[_s.randomColorGroupNumber].padding = scope.guiOpt.randomColor[_s.randomColorGroupNumber].padding;
                scope.colorChange({
                    settingNumber: _s.randomColorGroupNumber,
                });
                break;
            case "randomColor.enableGamma":

                scope.setting.randomColor[_s.randomColorGroupNumber].enableGamma = scope.guiOpt.randomColor[_s.randomColorGroupNumber].enableGamma;
                scope.colorChange({
                    settingNumber: _s.randomColorGroupNumber,
                });

                break;
            case "randomColor.gamma":
                scope.setting.randomColor[_s.randomColorGroupNumber].gamma = scope.guiOpt.randomColor[_s.randomColorGroupNumber].gamma;
                scope.colorChange({
                    settingNumber: _s.randomColorGroupNumber,
                });
                break;
            case "randomColor.enableDomain":
                scope.setting.randomColor[_s.randomColorGroupNumber].enableDomain = scope.guiOpt.randomColor[_s.randomColorGroupNumber].enableDomain;
                scope.colorChange({
                    settingNumber: _s.randomColorGroupNumber,
                });
                break;
            case "randomColor.domain":
                // scope.setting.randomColor[_s.randomColorGroupNumber].domain[_s.randomColorArrayNumber] = scope.guiOpt.randomColor[_s.randomColorGroupNumber][`domain${_s.randomColorArrayNumber}`];
                scope.setting.randomColor[_s.randomColorGroupNumber].domain[_s.randomColorArrayNumber] = scope.guiOpt.randomColor[_s.randomColorGroupNumber].domain[_s.randomColorArrayNumber];
                scope.colorChange({
                    settingNumber: _s.randomColorGroupNumber,
                });
                break;
            case "randomColor.enableClasses":
                scope.setting.randomColor[_s.randomColorGroupNumber].enableClasses = scope.guiOpt.randomColor[_s.randomColorGroupNumber].enableClasses;
                scope.colorChange({
                    settingNumber: _s.randomColorGroupNumber,
                });
                break;
            case "randomColor.classes":

                var flds = scope.datFlds.datRandomColor[_s.randomColorGroupNumber];
                var ctls = scope.datCtls.datRandomColor[_s.randomColorGroupNumber];
                var opt = scope.guiOpt.randomColor[_s.randomColorGroupNumber];
                var set = scope.setting.randomColor[_s.randomColorGroupNumber];

                scope.setting.randomColor[_s.randomColorGroupNumber].classes = scope.guiOpt.randomColor[_s.randomColorGroupNumber].classes;

                // カスタムクラス 難しかったので後回し・・・
                // if( set.classes != set.customClasses.length - 1 ){
                //
                //     var moveNum = set.classes -  ( set.customClasses.length - 1 );
                //     var moveNumAbs = Math.abs( moveNum );
                //     if( moveNum > 0 ){
                //
                //         for( let i = 0 ; i < moveNumAbs ; i++ ){
                //
                //             var len = set.customClasses.length;
                //             opt["customClasses"][len] = 1;
                //             ctls.classes.custom.params[ set.customClasses.length ] = flds["customClassesParams"].add( opt["customClasses"] , len , 0 , 1 , 0.01 );
                //             ctls.classes.custom.params[ set.customClasses.length ].onChange( scope.datChange.bind( scope , "randomColor.classes.customParam" , { randomColorGroupNumber : i , randomColorCustomClassesNumber : len  }));
                //             ctls.classes.custom.params[ set.customClasses.length ].onFinishChange( scope.datChange.bind( scope , "randomColor.classes.customParam" , { randomColorGroupNumber : i , randomColorCustomClassesNumber : len , isFinish : true }));
                //             set.customClasses[ set.customClasses.length ] = 1;
                //             console.log( ctls.classes.custom.params );
                //
                //         }
                //
                //     }else{
                //
                //         for( let i = 0 ; i < moveNumAbs ; i++ ){
                //             delete opt["customClasses"][set.customClasses.length -i - 1];
                //             ctls.classes.custom.params[ set.customClasses.length - i - 1 ].remove();
                //             set.customClasses.pop();
                //         }
                //
                //     }
                // }

                if (scope.setting.randomColor[_s.randomColorGroupNumber].enableClasses) {
                    scope.colorChange({
                        settingNumber: _s.randomColorGroupNumber,
                    });
                }
                break;
            case "randomColor.classes.enableCustom":
                scope.setting.randomColor[_s.randomColorGroupNumber].enableCustomClasses = scope.guiOpt.randomColor[_s.randomColorGroupNumber].enableCustomClasses;
                scope.colorChange({
                    settingNumber: _s.randomColorGroupNumber,
                });
                break;
            case "randomColor.classes.customParam":
                scope.setting.randomColor[_s.randomColorGroupNumber].customClasses[_s.randomColorCustomClassesNumber] = scope.guiOpt.randomColor[_s.randomColorGroupNumber].customClasses[_s.randomColorCustomClassesNumber];
                scope.colorChange({
                    settingNumber: _s.randomColorGroupNumber,
                });
                break;
            case "randomColor.enableMix":
                if (scope.setting.randomColor[_s.randomColorGroupNumber].mix == null) {
                    scope._datguiInitNoValueObjectToActive("randomColor.mix", {
                        GroupNumber: _s.randomColorGroupNumber
                    });
                }
                scope.setting.randomColor[_s.randomColorGroupNumber].enableMix = scope.guiOpt.randomColor[_s.randomColorGroupNumber].enableMix;
                scope.colorChange({
                    settingNumber: _s.randomColorGroupNumber,
                });
                break;
            case "randomColor.mixColor":
                if (scope.setting.randomColor[_s.randomColorGroupNumber].mix == null) {
                    scope._datguiInitNoValueObjectToActive("randomColor.mix", {
                        GroupNumber: _s.randomColorGroupNumber
                    });
                }
                scope.setting.randomColor[_s.randomColorGroupNumber].mix[0] = scope.guiOpt.randomColor[_s.randomColorGroupNumber].mixColor;
                if (scope.setting.randomColor[_s.randomColorGroupNumber].enableMix) {
                    scope.colorChange({
                        settingNumber: _s.randomColorGroupNumber,
                    });
                }
                break;
            case "randomColor.mixRatio":
                if (scope.setting.randomColor[_s.randomColorGroupNumber].mix == null) {
                    scope._datguiInitNoValueObjectToActive("randomColor.mix", {
                        GroupNumber: _s.randomColorGroupNumber
                    });
                }
                scope.setting.randomColor[_s.randomColorGroupNumber].mix[1] = scope.guiOpt.randomColor[_s.randomColorGroupNumber].mixRatio;
                if (scope.setting.randomColor[_s.randomColorGroupNumber].enableMix) {
                    scope.colorChange({
                        settingNumber: _s.randomColorGroupNumber,
                    });
                }
                break;
            case "randomColor.mixMode":
                if (scope.setting.randomColor[_s.randomColorGroupNumber].mix == null) {
                    scope._datguiInitNoValueObjectToActive("randomColor.mix", {
                        GroupNumber: _s.randomColorGroupNumber
                    });
                }
                scope.setting.randomColor[_s.randomColorGroupNumber].mix[2] = scope.guiOpt.randomColor[_s.randomColorGroupNumber].mixMode;
                if (scope.setting.randomColor[_s.randomColorGroupNumber].enableMix) {
                    scope.colorChange({
                        settingNumber: _s.randomColorGroupNumber,
                    });
                }
                break;
            case "randomColor.enableBlend":
                if (scope.setting.randomColor[_s.randomColorGroupNumber].blend == null) {
                    scope._datguiInitNoValueObjectToActive("randomColor.blend", {
                        GroupNumber: _s.randomColorGroupNumber
                    });
                }
                scope.setting.randomColor[_s.randomColorGroupNumber].enableBlend = scope.guiOpt.randomColor[_s.randomColorGroupNumber].enableBlend;
                scope.colorChange({
                    settingNumber: _s.randomColorGroupNumber,
                });
                break;
            case "randomColor.blendColor":
                if (scope.setting.randomColor[_s.randomColorGroupNumber].blend == null) {
                    scope._datguiInitNoValueObjectToActive("randomColor.blend", {
                        GroupNumber: _s.randomColorGroupNumber
                    });
                }
                scope.setting.randomColor[_s.randomColorGroupNumber].blend[0] = scope.guiOpt.randomColor[_s.randomColorGroupNumber].blendColor;
                if (scope.setting.randomColor[_s.randomColorGroupNumber].enableBlend) {
                    scope.colorChange({
                        settingNumber: _s.randomColorGroupNumber,
                    });
                }
                break;
            case "randomColor.blendMode":
                if (scope.setting.randomColor[_s.randomColorGroupNumber].blend == null) {
                    scope._datguiInitNoValueObjectToActive("randomColor.blend", {
                        GroupNumber: _s.randomColorGroupNumber
                    });
                }
                scope.setting.randomColor[_s.randomColorGroupNumber].blend[1] = scope.guiOpt.randomColor[_s.randomColorGroupNumber].blendMode;
                if (scope.setting.randomColor[_s.randomColorGroupNumber].enableBlend) {
                    scope.colorChange({
                        settingNumber: _s.randomColorGroupNumber,
                    });
                }
                break;
            case "randomColor.setRGB":

                var ctls = scope.datCtls.datRandomColor[_s.randomColorGroupNumber];

                // ここの変数で RGB を区別させている
                var cNum, cType, cStr, cEnable;
                if (_s.randomColorSetRGB_Color == "r") {
                    cNum = 0;
                    cType = "redCalcType";
                    cStr = "red";
                    cEnable = "enableRed";
                } else if (_s.randomColorSetRGB_Color == "g") {
                    cNum = 1;
                    cType = "greenCalcType";
                    cStr = "green";
                    cEnable = "enableGreen";
                } else if (_s.randomColorSetRGB_Color == "b") {
                    cNum = 2;
                    cType = "blueCalcType";
                    cStr = "blue";
                    cEnable = "enableBlue";
                }

                // 有効無効ボタンの場合
                if (_s.randomColorSetRGB_Enable == true) {

                    scope.setting.randomColor[_s.randomColorGroupNumber].enableSetRGB[cNum] = scope.guiOpt.randomColor[_s.randomColorGroupNumber]["setRGB"][cEnable];

                }

                // タイプ変更ボタンの場合
                if (_s.randomColorSetRGB_Type == true) {
                    // + or - の場合の最大値を設定
                    if (scope.guiOpt.randomColor[_s.randomColorGroupNumber]["setRGB"][cType] == "+" || scope.guiOpt.randomColor[_s.randomColorGroupNumber]["setRGB"][cType] == "-" || scope.guiOpt.randomColor[_s.randomColorGroupNumber]["setRGB"][cType] == "=") {
                        switch (cNum) {
                            case 0:
                                ctls.randomColorSetRGB_R.__max = 255;
                                break;
                            case 1:
                                ctls.randomColorSetRGB_G.__max = 255;
                                break;
                            case 2:
                                ctls.randomColorSetRGB_B.__max = 255;
                                break;
                        }
                        // * or / の場合の最大値を設定
                    } else if (scope.guiOpt.randomColor[_s.randomColorGroupNumber]["setRGB"][cType] == "*" || scope.guiOpt.randomColor[_s.randomColorGroupNumber]["setRGB"][cType] == "/") {
                        switch (cNum) {
                            case 0:
                                ctls.randomColorSetRGB_R.__max = 5;
                                break;
                            case 1:
                                ctls.randomColorSetRGB_G.__max = 5;
                                break;
                            case 2:
                                ctls.randomColorSetRGB_B.__max = 5;
                                break;
                        }
                    }
                }

                if (_s.randomColorSetRGB_Type == true) {


                    if (scope.guiOpt.randomColor[_s.randomColorGroupNumber]["setRGB"][cType] == "+" || scope.guiOpt.randomColor[_s.randomColorGroupNumber]["setRGB"][cType] == "-") {

                        // 設定への変更
                        scope.setting.randomColor[_s.randomColorGroupNumber].setrgb[cNum] = scope.guiOpt.randomColor[_s.randomColorGroupNumber]["setRGB"][cType] + 0;
                        // dat.gui.jsの画面への変更
                        if (cNum == 0) {
                            ctls.randomColorSetRGB_R.setValue(0);
                        } else if (cNum == 1) {
                            ctls.randomColorSetRGB_G.setValue(0);
                        } else if (cNum == 2) {
                            ctls.randomColorSetRGB_B.setValue(0);
                        }

                    } else if (scope.guiOpt.randomColor[_s.randomColorGroupNumber]["setRGB"][cType] == "*" || scope.guiOpt.randomColor[_s.randomColorGroupNumber]["setRGB"][cType] == "/") {

                        // 設定への変更
                        scope.setting.randomColor[_s.randomColorGroupNumber].setrgb[cNum] = scope.guiOpt.randomColor[_s.randomColorGroupNumber]["setRGB"][cType] + 1;
                        // dat.gui.jsの画面への変更
                        if (cNum == 0) {
                            ctls.randomColorSetRGB_R.setValue(1);
                        } else if (cNum == 1) {
                            ctls.randomColorSetRGB_G.setValue(1);
                        } else if (cNum == 2) {
                            ctls.randomColorSetRGB_B.setValue(1);
                        }

                        // タイプが = のときの挙動
                    } else if (scope.guiOpt.randomColor[_s.randomColorGroupNumber]["setRGB"][cType] == "=") {

                        // 設定への変更
                        scope.setting.randomColor[_s.randomColorGroupNumber].setrgb[cNum] = 0;
                        // console.log( scope.setting.randomColor[_s.randomColorGroupNumber].setrgb[cNum] );
                        // dat.gui.jsの画面への変更
                        if (cNum == 0) {
                            ctls.randomColorSetRGB_R.setValue(0);
                        } else if (cNum == 1) {
                            ctls.randomColorSetRGB_G.setValue(0);
                        } else if (cNum == 2) {
                            ctls.randomColorSetRGB_B.setValue(0);
                        }

                    }

                } else {

                    if (scope.guiOpt.randomColor[_s.randomColorGroupNumber]["setRGB"][cType] == "=") {

                        // 値をセッティングの方に反映させる(短くしたい)
                        scope.setting.randomColor[_s.randomColorGroupNumber].setrgb[cNum] = scope.guiOpt.randomColor[_s.randomColorGroupNumber]["setRGB"][cStr];

                    } else {

                        // 値をセッティングの方に反映させる(短くしたい)
                        scope.setting.randomColor[_s.randomColorGroupNumber].setrgb[cNum] = scope.guiOpt.randomColor[_s.randomColorGroupNumber]["setRGB"][cType] + scope.guiOpt.randomColor[_s.randomColorGroupNumber]["setRGB"][cStr];

                    }

                }

                scope.colorChange({
                    settingNumber: _s.randomColorGroupNumber,
                });
                break;
            case "randomColor.setCMYK":

                var ctls = scope.datCtls.datRandomColor[_s.randomColorGroupNumber];

                // ここの変数で RGB を区別させている
                var cNum, cType, cStr, cEnable;
                if (_s.randomColorSetCMYK_Color == "c") {
                    cNum = 0;
                    cType = "cyanCalcType";
                    cStr = "cyan";
                    cEnable = "enableCyan";
                } else if (_s.randomColorSetCMYK_Color == "m") {
                    cNum = 1;
                    cType = "magentaCalcType";
                    cStr = "magenta";
                    cEnable = "enableMagenta";
                } else if (_s.randomColorSetCMYK_Color == "y") {
                    cNum = 2;
                    cType = "yellowCalcType";
                    cStr = "yellow";
                    cEnable = "enableYellow";
                } else if (_s.randomColorSetCMYK_Color == "k") {
                    cNum = 3;
                    cType = "keyCalcType";
                    cStr = "key";
                    cEnable = "enableKey";
                }

                // 有効無効ボタンの場合
                if (_s.randomColorSetCMYK_Enable == true) {
                    scope.setting.randomColor[_s.randomColorGroupNumber].enableSetCMYK[cNum] = scope.guiOpt.randomColor[_s.randomColorGroupNumber]["setCMYK"][cEnable];
                }

                // タイプ変更ボタンの場合
                if (_s.randomColorSetCMYK_Type == true) {
                    // + or - の場合の最大値を設定
                    if (scope.guiOpt.randomColor[_s.randomColorGroupNumber]["setCMYK"][cType] == "+" || scope.guiOpt.randomColor[_s.randomColorGroupNumber]["setCMYK"][cType] == "-" || scope.guiOpt.randomColor[_s.randomColorGroupNumber]["setCMYK"][cType] == "=") {
                        switch (cNum) {
                            case 0:
                                ctls.randomColorSetCMYK_C.__max = 1;
                                break;
                            case 1:
                                ctls.randomColorSetCMYK_M.__max = 1;
                                break;
                            case 2:
                                ctls.randomColorSetCMYK_Y.__max = 1;
                                break;
                            case 3:
                                ctls.randomColorSetCMYK_K.__max = 1;
                                break;
                        }
                        // * or / の場合の最大値を設定
                    } else {
                        switch (cNum) {
                            case 0:
                                ctls.randomColorSetCMYK_C.__max = 5;
                                break;
                            case 1:
                                ctls.randomColorSetCMYK_M.__max = 5;
                                break;
                            case 2:
                                ctls.randomColorSetCMYK_Y.__max = 5;
                                break;
                            case 3:
                                ctls.randomColorSetCMYK_K.__max = 5;
                                break;
                        }
                    }
                }

                if (_s.randomColorSetCMYK_Type == true) {


                    if (scope.guiOpt.randomColor[_s.randomColorGroupNumber]["setCMYK"][cType] == "+" || scope.guiOpt.randomColor[_s.randomColorGroupNumber]["setCMYK"][cType] == "-") {

                        // 設定への変更
                        scope.setting.randomColor[_s.randomColorGroupNumber].setcmyk[cNum] = scope.guiOpt.randomColor[_s.randomColorGroupNumber]["setCMYK"][cType] + 0;
                        // dat.gui.jsの画面への変更
                        if (cNum == 0) {
                            ctls.randomColorSetCMYK_C.setValue(0);
                        } else if (cNum == 1) {
                            ctls.randomColorSetCMYK_M.setValue(0);
                        } else if (cNum == 2) {
                            ctls.randomColorSetCMYK_Y.setValue(0);
                        } else if (cNum == 3) {
                            ctls.randomColorSetCMYK_K.setValue(0);
                        }

                    } else if (scope.guiOpt.randomColor[_s.randomColorGroupNumber]["setCMYK"][cType] == "*" || scope.guiOpt.randomColor[_s.randomColorGroupNumber]["setCMYK"][cType] == "/") {

                        // 設定への変更
                        scope.setting.randomColor[_s.randomColorGroupNumber].setcmyk[cNum] = scope.guiOpt.randomColor[_s.randomColorGroupNumber]["setCMYK"][cType] + 1;
                        // dat.gui.jsの画面への変更
                        if (cNum == 0) {
                            ctls.randomColorSetCMYK_C.setValue(1);
                        } else if (cNum == 1) {
                            ctls.randomColorSetCMYK_M.setValue(1);
                        } else if (cNum == 2) {
                            ctls.randomColorSetCMYK_Y.setValue(1);
                        } else if (cNum == 3) {
                            ctls.randomColorSetCMYK_K.setValue(1);
                        }

                    } else if (scope.guiOpt.randomColor[_s.randomColorGroupNumber]["setCMYK"][cType] == "=") {

                        // 設定への変更
                        scope.setting.randomColor[_s.randomColorGroupNumber].setcmyk[cNum] = 0;
                        // dat.gui.jsの画面への変更
                        if (cNum == 0) {
                            ctls.randomColorSetCMYK_C.setValue(0);
                        } else if (cNum == 1) {
                            ctls.randomColorSetCMYK_M.setValue(0);
                        } else if (cNum == 2) {
                            ctls.randomColorSetCMYK_Y.setValue(0);
                        } else if (cNum == 3) {
                            ctls.randomColorSetCMYK_K.setValue(0);
                        }

                    }

                } else {

                    // 値をセッティングの方に反映させる(短くしたい)
                    if (scope.guiOpt.randomColor[_s.randomColorGroupNumber]["setCMYK"][cType] == "=") {
                        scope.setting.randomColor[_s.randomColorGroupNumber].setcmyk[cNum] = scope.guiOpt.randomColor[_s.randomColorGroupNumber]["setCMYK"][cStr];
                    } else {
                        scope.setting.randomColor[_s.randomColorGroupNumber].setcmyk[cNum] = scope.guiOpt.randomColor[_s.randomColorGroupNumber]["setCMYK"][cType] + scope.guiOpt.randomColor[_s.randomColorGroupNumber]["setCMYK"][cStr];
                    }

                }

                scope.colorChange({
                    settingNumber: _s.randomColorGroupNumber,
                });

                break;
            case "randomColor.setHSL":

                var ctls = scope.datCtls.datRandomColor[_s.randomColorGroupNumber];
                var cNum, cType, cStr, cEnable;
                if (_s.randomColorSetHSL_Color == "h") {
                    cNum = 0;
                    cType = "hueCalcType";
                    cStr = "hue";
                    cEnable = "enableHue";
                } else if (_s.randomColorSetHSL_Color == "s") {
                    cNum = 1;
                    cType = "saturationCalcType";
                    cStr = "saturation";
                    cEnable = "enableSaturation";
                } else if (_s.randomColorSetHSL_Color == "l") {
                    cNum = 2;
                    cType = "luminanceCalcType";
                    cStr = "luminance";
                    cEnable = "enableLuminance";
                }

                // 有効無効ボタンの場合
                if (_s.randomColorSetHSL_Enable == true) {
                    scope.setting.randomColor[_s.randomColorGroupNumber].enableSetHSL[cNum] = scope.guiOpt.randomColor[_s.randomColorGroupNumber]["setHSL"][cEnable];
                }

                // タイプ変更ボタンの場合
                if (_s.randomColorSetHSL_Type == true) {
                    // + or - の場合の最大値を設定
                    if (scope.guiOpt.randomColor[_s.randomColorGroupNumber]["setHSL"][cType] == "+" || scope.guiOpt.randomColor[_s.randomColorGroupNumber]["setHSL"][cType] == "-" || scope.guiOpt.randomColor[_s.randomColorGroupNumber]["setHSL"][cType] == "=") {
                        switch (cNum) {
                            case 0:
                                ctls.randomColorSetHSL_H.__max = 180;
                                break;
                            case 1:
                                ctls.randomColorSetHSL_S.__max = 1;
                                break;
                            case 2:
                                ctls.randomColorSetHSL_L.__max = 1;
                                break;
                        }
                        // * or / の場合の最大値を設定
                    } else {
                        switch (cNum) {
                            case 0:
                                ctls.randomColorSetHSL_H.__max = 5;
                                break;
                            case 1:
                                ctls.randomColorSetHSL_S.__max = 5;
                                break;
                            case 2:
                                ctls.randomColorSetHSL_L.__max = 5;
                                break;
                        }
                    }
                }

                if (_s.randomColorSetHSL_Type == true) {


                    if (scope.guiOpt.randomColor[_s.randomColorGroupNumber]["setHSL"][cType] == "+" || scope.guiOpt.randomColor[_s.randomColorGroupNumber]["setHSL"][cType] == "-") {

                        // 設定への変更
                        scope.setting.randomColor[_s.randomColorGroupNumber].sethsl[cNum] = scope.guiOpt.randomColor[_s.randomColorGroupNumber]["setHSL"][cType] + 0;
                        // dat.gui.jsの画面への変更
                        if (cNum == 0) {
                            ctls.randomColorSetHSL_H.setValue(0);
                        } else if (cNum == 1) {
                            ctls.randomColorSetHSL_S.setValue(0);
                        } else if (cNum == 2) {
                            ctls.randomColorSetHSL_L.setValue(0);
                        }

                    } else if (scope.guiOpt.randomColor[_s.randomColorGroupNumber]["setHSL"][cType] == "*" || scope.guiOpt.randomColor[_s.randomColorGroupNumber]["setHSL"][cType] == "/") {

                        // 設定への変更
                        scope.setting.randomColor[_s.randomColorGroupNumber].sethsl[cNum] = scope.guiOpt.randomColor[_s.randomColorGroupNumber]["setHSL"][cType] + 1;
                        // dat.gui.jsの画面への変更
                        if (cNum == 0) {
                            ctls.randomColorSetHSL_H.setValue(1);
                        } else if (cNum == 1) {
                            ctls.randomColorSetHSL_S.setValue(1);
                        } else if (cNum == 2) {
                            ctls.randomColorSetHSL_L.setValue(1);
                        }

                    } else {

                        // 設定への変更
                        if (scope.guiOpt.randomColor[_s.randomColorGroupNumber]["setHSL"][cType] == "=") {
                            scope.setting.randomColor[_s.randomColorGroupNumber].sethsl[cNum] = 0;
                        } else {
                            scope.setting.randomColor[_s.randomColorGroupNumber].sethsl[cNum] = scope.guiOpt.randomColor[_s.randomColorGroupNumber]["setHSL"][cType] + 1;
                        }
                        // dat.gui.jsの画面への変更
                        if (cNum == 0) {
                            ctls.randomColorSetHSL_H.setValue(0);
                        } else if (cNum == 1) {
                            ctls.randomColorSetHSL_S.setValue(0);
                        } else if (cNum == 2) {
                            ctls.randomColorSetHSL_L.setValue(0);
                        }
                    }

                } else {

                    // 値をセッティングの方に反映させる(短くしたい)
                    if (scope.guiOpt.randomColor[_s.randomColorGroupNumber]["setHSL"][cType] == "=") {
                        scope.setting.randomColor[_s.randomColorGroupNumber].sethsl[cNum] = scope.guiOpt.randomColor[_s.randomColorGroupNumber]["setHSL"][cStr];
                    } else {
                        scope.setting.randomColor[_s.randomColorGroupNumber].sethsl[cNum] = scope.guiOpt.randomColor[_s.randomColorGroupNumber]["setHSL"][cType] + scope.guiOpt.randomColor[_s.randomColorGroupNumber]["setHSL"][cStr];
                    }

                }


                scope.colorChange({
                    settingNumber: _s.randomColorGroupNumber,
                });
                break;
            case "randomColor.showPreset":

                var scope = this;

                var opt = scope.guiOpt.randomColor[_s.randomColorGroupNumber];

                if (opt["functions"]['showPreset']["showPreset"] == true) {
                    scope.initShowPreset.call(scope, {
                        groupNumber: _s.randomColorGroupNumber
                    });
                } else {
                    scope.deleteShowPreset.call(scope);
                }

                break;
            case "randomColor.showFetch":
                var scope = this;
                var opt = scope.guiOpt.randomColor[_s.randomColorGroupNumber];

                if (opt["functions"]['showPreset']["showPreset"] == true) {
                    scope.initShowFetch.call(scope, {
                        groupNumber: _s.randomColorGroupNumber
                    });
                } else {
                    scope.deleteShowFetch.call(scope, {
                        groupNumber: _s.randomColorGroupNumber
                    });
                }

                break;
            case "randomColor.functions.copyToClipboard.all":

                // @todo カスタムクラス , set系の = , 値がない場合の対処(dat.gui.jsを起動した上でのコピーなら大丈夫ですが。。)


                var opt = scope.guiOpt.randomColor[_s.randomColorGroupNumber];
                var set = scope.setting.randomColor[_s.randomColorGroupNumber];
                var n8 = "\n        ";
                var n4 = "\n    ";
                var arraysName = ["domain", "customClasses", "enableSetRGB", "enableSetCMYK", "enableSetHSL", "setrgb", "sethsl", "setcmyk"];

                var ct = "";
                ct += `randomColor : [${n4}{${n8}`;
                ct += `enabled : ${set.enabled},${n8}`;
                set.color.forEach(function(value, index, array) {
                    if (index == 0) {
                        ct += `color : [`;
                    }
                    ct += "'" + value + "'";
                    if (array.length - 1 == index) {
                        ct += " ]," + n8;
                    } else {
                        ct += ", ";
                    }
                });
                set.domain.forEach(function(value, index, array) {
                    if (index == 0) {
                        ct += `domain : [`;
                    }
                    ct += value;
                    if (array.length - 1 == index) {
                        ct += " ]," + n8;
                    } else {
                        ct += ", ";
                    }
                });
                ct += `mode : '${set.mode}',${n8}`;
                ct += `padding : ${set.padding},${n8}`;
                ct += `gamma : ${set.gamma},${n8}`;
                ct += `enableBezier : ${set.enableBezier},${n8}`;
                ct += `enableDomain : ${set.enableDomain},${n8}`;
                ct += `enablePadding : ${set.enablePadding},${n8}`;
                ct += `enableGamma : ${set.enableGamma},${n8}`;
                ct += `enableClasses : ${set.enableClasses},${n8}`;
                ct += `classes : ${set.classes},${n8}`;
                set.enableSetRGB.forEach(function(val, i, array) {
                    if (i == 0) {
                        ct += `enableSetRGB : [`;
                    }
                    ct += `${set.enableSetRGB[i]} `;
                    if (array.length - 1 == i) {
                        ct += `],${n8}`;
                    } else {
                        ct += ",";
                    }
                });
                set.enableSetCMYK.forEach(function(val, i, array) {
                    if (i == 0) {
                        ct += "enableSetCMYK : [";
                    }
                    ct += `${set.enableSetCMYK[i]} `;
                    if (array.length - 1 == i) {
                        ct += `],${n8}`;
                    } else {
                        ct += ",";
                    }
                });
                set.enableSetHSL.forEach(function(val, i, array) {
                    if (i == 0) {
                        ct += "enableSetHSL : [";
                    }
                    ct += `${set.enableSetHSL[i]} `;
                    if (array.length - 1 == i) {
                        ct += `],${n8}`;
                    } else {
                        ct += ",";
                    }
                });
                set.setrgb.forEach(function(val, i, array) {
                    if (i == 0) {
                        ct += "setrgb : [";
                    }
                    if (typeof set.setrgb[i] == "number") {
                        ct += ` ${set.setrgb[i]} `;
                    } else {
                        ct += ` '${set.setrgb[i]}' `;
                    }
                    if (array.length - 1 == i) {
                        ct += `],${n8}`;
                    } else {
                        ct += ",";
                    }
                });
                set.sethsl.forEach(function(val, i, array) {
                    if (i == 0) {
                        ct += "sethsl : [";
                    }
                    if (typeof set.sethsl[i] == "number") {
                        ct += ` ${set.sethsl[i]} `;
                    } else {
                        ct += ` '${set.sethsl[i]}' `;
                    }
                    if (array.length - 1 == i) {
                        ct += `],${n8}`;
                    } else {
                        ct += ",";
                    }
                });
                set.setcmyk.forEach(function(val, i, array) {
                    if (i == 0) {
                        ct += "setcmyk : [";
                    }
                    if (typeof set.setcmyk[i] == "number") {
                        ct += ` ${set.setcmyk[i]} `;
                    } else {
                        ct += ` '${set.setcmyk[i]}' `;
                    }
                    if (array.length - 1 == i) {
                        ct += `],${n8}`;
                    } else {
                        ct += ",";
                    }
                });
                set.setDisableList.forEach(function(val, i, array) {
                    if (i == 0) {
                        ct += "setDisableList : [";
                    }
                    ct += ` '${set.setDisableList[i]}' `;
                    if (array.length - 1 == i) {
                        ct += `],${n8}`;
                    } else {
                        ct += ",";
                    }
                });

                // @temp
                ct += `setDisableList : [],${n8}`;
                // @temp
                ct += `customClasses : [],${n8}`;

                ct += "enableMix : " + set.enableMix + "," + n8;
                ct += "enableBlend : " + set.enableBlend + "," + n8;
                set.mix.forEach(function(val, i, array) {
                    if (i == 0) {
                        ct += "mix : [";
                        ct += ` '${set.mix[0]}' ,`;
                    }
                    if (i == 1) {
                        ct += ` ${set.mix[1]} ,`;
                    }
                    if (i == 2) {
                        ct += ` '${set.mix[2]}' `;
                        ct += `],${n8}`;
                    }
                });
                set.blend.forEach(function(val, i, array) {
                    if (i == 0) {
                        ct += "blend : [";
                        ct += ` '${set.blend[0]}' ,`;
                    }
                    if (i == 1) {
                        ct += ` '${set.blend[1]}' `;
                        ct += `],${n4}`;
                    }
                });
                ct += `},\n],`;

                if (_s.minify) {
                    ct = ct.replace(/[ |\t|\n]/g, "");
                }

                scope.execCopy(ct);

                break;
            case "randomColor.functions.copyToClipboard.color":


                var opt = scope.guiOpt.randomColor[_s.randomColorGroupNumber];
                var set = scope.setting.randomColor[_s.randomColorGroupNumber];
                var n8 = "\n        ";
                var n4 = "\n    ";
                var arraysName = ["domain", "customClasses", "enableSetRGB", "enableSetCMYK", "enableSetHSL", "setrgb", "sethsl", "setcmyk"];

                var ct = "";
                set.color.forEach(function(value, index, array) {
                    if (index == 0) {
                        ct += `color : [`;
                    }
                    ct += "'" + value + "'";
                    if (array.length - 1 == index) {
                        ct += " ],";
                    } else {
                        ct += ", ";
                    }
                });

                scope.execCopy(ct);


                break;
        } // end of switch

        // 補助用の表示グラデーションのアップデートを行う。
        if (str.indexOf("randomColor") != -1 && _s.randomColorGroupNumber != null) {
            if (scope.guiOpt.randomColor[_s.randomColorGroupNumber]["functions"]["showGradation"]["showGradation"]) {
                scope.updateShowGradation({
                    groupNumber: _s.randomColorGroupNumber
                });
            }
        }


    }

    /**
     * 現在の状態を設定に反映させる ( 内部で使用される関数 )
     * @return {[type]} [description]
     */
    reflectCurrentChangeToSetting() {

        var scope = this;

        // position
        scope.setting.camera.position.x = scope.camera.position.x;
        scope.setting.camera.position.y = scope.camera.position.y;
        scope.setting.camera.position.z = scope.camera.position.z;
        // rotation
        scope.setting.camera.rotation.x = THREE.Math.radToDeg(scope.camera.rotation.x);
        scope.setting.camera.rotation.y = THREE.Math.radToDeg(scope.camera.rotation.y);
        scope.setting.camera.rotation.z = THREE.Math.radToDeg(scope.camera.rotation.z);
        // カメラ諸々
        scope.setting.camera.near = scope.camera.near;
        scope.setting.camera.far = scope.camera.far;
        if (scope.setting.camera.type == "perspective") {
            scope.setting.camera.type = "perspective";
            scope.setting.camera.fov = scope.camera.fov;
            scope.setting.perspectiveZoom = scope.camera.zoom;
        } else if (scope.setting.camera.type == "orthographic") {
            scope.setting.camera.type = "orthographic";
            scope.setting.orthoZoom = scope.camera.zoom;
        }

    }

    /**
     * リアルタイムのパラメーターをdat.gui.js側の画面に更新させる ( 内部で使用される関数 )
     * @return {[type]} [description]
     */
    _reflectRealTimeUpdateToGuiParam() {

        var scope = this;
        // @todo 負荷軽減のための分岐
        scope.guiOpt.camera.position.x = scope.camera.position.x;
        scope.guiOpt.camera.position.y = scope.camera.position.y;
        scope.guiOpt.camera.position.z = scope.camera.position.z;

        scope.guiOpt.camera.rotation.x = THREE.Math.radToDeg(scope.camera.rotation.x);
        scope.guiOpt.camera.rotation.y = THREE.Math.radToDeg(scope.camera.rotation.y);
        scope.guiOpt.camera.rotation.z = THREE.Math.radToDeg(scope.camera.rotation.z);

    }

    /**
     * 初期設定に存在しない場所の初期化を行いArrayやObjectを生成して補完する ( 内部で使用される関数 )
     * @return {void} [description]
     */
    _datguiInitNoValueObjectToActive(key, _s) {

        var scope = this;

        switch (key) {
            case "randomColor.mix":
                var GroupNumber = _s.GroupNumber;
                scope.setting.randomColor[GroupNumber].mix = [];
                scope.setting.randomColor[GroupNumber].mix[0] = "#ffffff";
                scope.setting.randomColor[GroupNumber].mix[1] = 0.5;
                scope.setting.randomColor[GroupNumber].mix[2] = "rgb";
                break;
            case "randomColor.blend":
                var GroupNumber = _s.GroupNumber;
                scope.setting.randomColor[GroupNumber].blend = [];
                scope.setting.randomColor[GroupNumber].blend[0] = "#ffffff";
                scope.setting.randomColor[GroupNumber].blend[1] = "overlay";
                break;
        }

    }

    /**
     * randomColorの更新頻度をコントロールするフラグ用の関数 ( 内部で使用される関数 )
     * @return {void} [description]
     */
    _randomColorRefreshFlag() {

        var scope = this;

        scope.randomColorChangeFlag = true;

    }

    /**
     * 現在のグラデーションをscale0から1へ順番に表示
     * @return {[type]} [description]
     */
    initShowGradation(_s) {

        var scope = this;

        if (_s == null) _s = {};

        var opt = scope.guiOpt.randomColor[_s.groupNumber];

        var gradationArea = document.createElement("div");
        gradationArea.setAttribute("id", "Nasikusa-show-gradation");


        window.addEventListener("keydown", function(e) {
            if (e.keyCode == 72) {
                let target = document.getElementById("Nasikusa-show-gradation");
                let st = target.currentStyle || document.defaultView.getComputedStyle(target, '');
                if (st.display == "flex") {
                    target.style.display = "none";
                } else {
                    target.style.display = "flex";
                };
            }
        })


        // 適用するCSS
        var styles = [
            ["width", opt["functions"]["showGradation"]["width"] + "px"],
            ["height", opt.functions.showGradation.height + "px"],
            ["position", "fixed"],
            ["bottom", 0],
            ["margin", "10px"],
            ["backgroundColor", "#999999"],
            ["z-index", 1000],
            ["display", "flex"],
        ];

        // グラデーションエリアの横方向のポジションを決定
        var HoriPos;
        if (opt["functions"]["showGradation"]["horizontalPosition"] == "left") {
            HoriPos = ["left", 0];
            styles.push(HoriPos);
        } else if (opt["functions"]["showGradation"]["horizontalPosition"] == "center") {
            HoriPos = ["left", (window.innerWidth - opt["functions"]["showGradation"]["width"]) / 2 + "px"]
            styles.push(HoriPos);
        } else if (opt["functions"]["showGradation"]["horizontalPosition"] == "right") {
            HoriPos = ["right", 0];
            styles.push(HoriPos);
        }

        // グラデーションエリアの縦方向のポジションを決定
        var vertPos;
        if (opt["functions"]["showGradation"]["verticalPosition"] == "top") {
            vertPos = ["top", 0];
            styles.push(vertPos);
        } else if (opt["functions"]["showGradation"]["verticalPosition"] == "center") {
            vertPos = ["top", (window.innerHeight - opt["functions"]["showGradation"]["height"]) / 2 + "px"]
            styles.push(vertPos);
        } else if (opt["functions"]["showGradation"]["verticalPosition"] == "bottom") {
            vertPos = ["bottom", 0];
            styles.push(vertPos);
        }

        styles.forEach(function(value, index, array) {
            gradationArea.style[value[0]] = value[1];
        });

        var graElementArray = [];
        // 持ってくるグラデーションの数
        var graNum = 100;
        // colorsオプションでカラーを配列で持ってくる
        var scale = scope.colorChange({
            settingNumber: _s.groupNumber,
            returnScaleColors: graNum
        });

        for (let i = 0; i < graNum; i++) {

            var graElement = document.createElement("div");
            graElement.setAttribute("class", "Nasikusa-show-gradation-element")
            var styles = [
                ["width", graNum / 100 * 100 + "%"],
                ["height", "100%"],
                ["position", "relative"],
                ["z-index", 1000],
            ];
            styles.forEach(function(value, index, array) {
                graElement.style[value[0]] = value[1];
            });

            graElement.style.backgroundColor = scale[i];

            gradationArea.appendChild(graElement);

        }

        document.body.appendChild(gradationArea);

    }

    // 補助用のグラデーションを削除する
    deleteShowGradation() {

        if (document.getElementById("Nasikusa-show-gradation") != null) {
            var elem = document.getElementById("Nasikusa-show-gradation");
            elem.parentNode.removeChild(elem);
        }

    }

    // グラデーションエリアの更新を行う
    updateShowGradation(_s) {

        var scope = this;

        // 持ってくるグラデーションの数
        var graNum = 100;
        // colorsオプションでカラーを配列で持ってくる
        var scale = scope.colorChange({
            settingNumber: _s.groupNumber,
            returnScaleColors: graNum
        });

        for (let i = 0; i < graNum; i++) {

            var graElement = document.getElementsByClassName("Nasikusa-show-gradation-element");

            graElement[i].style.backgroundColor = scale[i];

        }

    }

    /**
     * ランダムカラーのプリセットエリアを作成する
     * @param {[type]} _s [description]
     *
     * @see JavaScriptでCSSの擬似クラスを設定する方法 http://www.koikikukan.com/archives/2013/05/29-005555.php
     */
    initShowPreset(_s) {

        var scope = this;

        if (_s == null) _s = {};

        // グラデーションプリセットをscopeで使えるようにする
        scope.initGradationPresets();

        /**
         * プリセットエリアのラッパー
         * @type {HTMLElement}
         */
        var presetArea = document.createElement("div");
        presetArea.setAttribute("id", "Nasikusa-show-preset");

        /**
         * プリセットエリアに適用するCSS
         * @type {Array}
         */
        var Areastyles = [
            ["width", 150 + "px"],
            ["height", window.innerHeight + "px"],
            ["position", "fixed"],
            ["top", 10 + "px"],
            ["left", 0 + "px"],
            ["z-index", 1000],
            ["display", "flex"],
            ["flexWrap", "wrap"],
            ["justifyContent", "center"],
            ["alignContent", "flex-start"],
            ["overflowY", "scroll"],
            ["transform", "translateX(-125px)"],
            ["opacity", 0.5],
            ["transition", "transform 0.25s ease,opacity 0.25s ease"],
        ];

        Areastyles.forEach(function(value, index, array) {
            presetArea.style[value[0]] = value[1];
        });
        // 疑似要素のcssは下で定義

        // @desc hボタンでハイドする
        window.addEventListener("keydown", function(e) {
            if (e.keyCode == 72) {
                let target = document.getElementById("Nasikusa-show-preset");
                let st = target.currentStyle || document.defaultView.getComputedStyle(target, '');
                if (st.display == "flex") {
                    target.style.display = "none";
                } else {
                    target.style.display = "flex";
                };
            }
        });

        // @see 【JavaScript】アロー関数式を学ぶついでにthisも復習する話 https://qiita.com/mejileben/items/69e5facdb60781927929
        (() => {

            /**
             * スクロールバー用のCSSをまとめた配列
             * @type {Array}
             * @see CSSでスクロールバーをカスタマイズ https://cloudpack.media/32418
             */
            var cssArray = [
                "#Nasikusa-show-preset::-webkit-scrollbar{width:5px}",
                "#Nasikusa-show-preset::-webkit-scrollbar-thumb{width : 3px;border-radius:10px;background-color:#888;}",
                "#Nasikusa-show-preset::-webkit-scrollbar-track{border-radius:10px;background-color:#ddd;}",
            ];
            var pseudoCSS = "";
            cssArray.forEach(function(v, i, a) {
                pseudoCSS += v;
            });
            var insertStyle = document.createElement('style');
            insertStyle.appendChild(document.createTextNode(pseudoCSS));
            document.getElementsByTagName('head')[0].appendChild(insertStyle);

        })();



        for (let i = 0; i < scope.gradationPresets.length; i++) {

            // グラデーション１つ１つのラッパーdivです。
            var presetItem = document.createElement("div");
            presetItem.classList.add("Nasikusa-show-preset-item");
            presetItem.classList.add(`Nasikusa-show-preset-item${i}`);
            // アイテム欄の中での順番(ページが変わっても変わらない)
            presetItem.dataset.showPresetItemNum = i;
            // プリセットグラデーションオブジェクトの中での順番(ページが変わるとこっちは変わる)(今のところはページは無いけど。。。)
            presetItem.dataset.showPresetGradationNum = i;
            var options = {
                presetItemNum: presetItem.dataset.showPresetItemNum,
                presetGradationNum: presetItem.dataset.showPresetGradationNum,
                groupNumber: _s.groupNumber
            };
            presetItem.addEventListener("click", scope.onPresetItemClickEvent.bind(scope, options));

            // @desc 適用するCSS
            // @hint 下のほうで適用している
            var Itemstyles = [
                ["width", "100%"],
                ["height", 25 + "px"],
                ["margin", 2.5 + "px " + 0 + "px"],
                ["position", "relative"],
                // [ "backgroundColor" ,  ],
                ["z-index", 1000],
                ["display", "flex"],
                ["border", "1px solid rgba(0,0,0,0)"],
            ];


            var preElementArray = [];
            // 持ってくるグラデーションの数
            var graNum = 100;
            // colorChange関数で使用するオプションを用意する
            var scaleOptions = {
                enabled: scope.gradationPresets[i].enabled ? true : false,
                target: "all",
                color: scope.gradationPresets[i].color,
                domain: (scope.gradationPresets[i].domain) ? scope.gradationPresets[i].domain : [0.0, 0.5, 1.0],
                mode: (scope.gradationPresets[i].mode) ? scope.gradationPresets[i].mode : "rgb",
                padding: (scope.gradationPresets[i].padding) ? scope.gradationPresets[i].padding : 0.0,
                gamma: (scope.gradationPresets[i].gamma) ? scope.gradationPresets[i].gamma : 1.0,
                enableBezier: (scope.gradationPresets[i].enableBezier) ? scope.gradationPresets[i].enableBezier : false,
                enableDomain: (scope.gradationPresets[i].enableDomain) ? scope.gradationPresets[i].enableDomain : true,
                enablePadding: (scope.gradationPresets[i].enablePadding) ? scope.gradationPresets[i].enablePadding : true,
                enableGamma: (scope.gradationPresets[i].enableGamma) ? scope.gradationPresets[i].enableGamma : true,
                enableClasses: (scope.gradationPresets[i].enableClasses) ? scope.gradationPresets[i].enableClasses : false,
                classes: (scope.gradationPresets[i].classes) ? scope.gradationPresets[i].classes : 4,
                enableCustomClasses: false,
                customClasses: [0.0, 0.25, 0.5, 0.75, 1.0],
                enableSetRGB: ((scope.gradationPresets[i].enableSetRGB)) ? [scope.gradationPresets[i].enableSetRGB[0], scope.gradationPresets[i].enableSetRGB[1], scope.gradationPresets[i].enableSetRGB[2]] : null,
                enableSetHSL: ((scope.gradationPresets[i].enableSetHSL)) ? [scope.gradationPresets[i].enableSetHSL[0], scope.gradationPresets[i].enableSetHSL[1], scope.gradationPresets[i].enableSetHSL[2]] : null,
                enableSetCMYK: ((scope.gradationPresets[i].enableSetCMYK)) ? [scope.gradationPresets[i].enableSetCMYK[0], scope.gradationPresets[i].enableSetCMYK[1], scope.gradationPresets[i].enableSetCMYK[2]] : null,
                setrgb: ((scope.gradationPresets[i].setrgb)) ? [scope.gradationPresets[i].setrgb[0], scope.gradationPresets[i].setrgb[1], scope.gradationPresets[i].setrgb[2]] : null,
                sethsl: ((scope.gradationPresets[i].sethsl)) ? [scope.gradationPresets[i].sethsl[0], scope.gradationPresets[i].sethsl[1], scope.gradationPresets[i].sethsl[2]] : null,
                setcmyk: ((scope.gradationPresets[i].setcmyk)) ? [scope.gradationPresets[i].setcmyk[0], scope.gradationPresets[i].setcmyk[1], scope.gradationPresets[i].setcmyk[2]] : null,
                setDisableList: (scope.gradationPresets[i].setDisableList) ? scope.gradationPresets[i].setDisableList : [],
                enableMix: (scope.gradationPresets[i].enableMix) ? scope.gradationPresets[i].enableMix : false,
                enableBlend: (scope.gradationPresets[i].enableBlend) ? scope.gradationPresets[i].enableBlend : false,
                returnScaleColors: graNum, // このオプションで色数を決めて持ってきている
            };
            // colorsオプションでカラーを配列で持ってくる
            var scale = scope.colorChange(scaleOptions);

            for (let j = 0; j < graNum; j++) {

                // 背景色にchroma.jsからのデータをもらうここの色divです。
                var preElement = document.createElement("div");
                preElement.classList.add("Nasikusa-show-preset-element");
                preElement.classList.add(`Nasikusa-show-preset-element-${i}-${j}`);
                preElement.dataset.showPresetItemNum = i;
                preElement.dataset.showPresetElementNum = j;

                var ElementStyles = [
                    ["width", graNum / 100 * 100 + "%"],
                    ["height", "100%"],
                    ["position", "relative"],
                    ["z-index", 1000],
                ];
                ElementStyles.forEach(function(value, index, array) {
                    preElement.style[value[0]] = value[1];
                });

                // ここで背景色にscaleからもらった色を入れている
                preElement.style.backgroundColor = scale[j];
                preElement.dataset.showPresetColorHex = scale[j];

                presetItem.appendChild(preElement);

                // backgroundColorがはいってからイベントをいれる？
                preElement.addEventListener("click", function(e) {
                    // console.log( e.target );
                    // console.log( e.target.children );
                    let style = (e.target.currentStyle || document.defaultView.getComputedStyle(e.target, '')).backgroundColor;
                    // console.log( style );
                });

            }


            Itemstyles.forEach(function(value, index, array) {
                presetItem.style[value[0]] = value[1];
            });

            presetArea.appendChild(presetItem);

        }

        document.body.appendChild(presetArea);

        var pseudoCSS = '#Nasikusa-show-preset:hover{opacity:1 !important;transform:translateX(0px) !important;}';
        var pseudoStyle = document.createElement('style');
        pseudoStyle.appendChild(document.createTextNode(pseudoCSS));
        document.getElementsByTagName('head')[0].appendChild(pseudoStyle);


    }

    /** プリセットアイテムをクリックしたときの挙動をinitShowPresetから分離したもの。
     * _s いろいろなオプションがはいっているオブジェクト
     *
     */
    onPresetItemClickEvent(_s) {


        var scope = this;

        var presetItems = document.getElementsByClassName("Nasikusa-show-preset-item");
        var elem = document.getElementsByClassName(`Nasikusa-show-preset-item${_s.presetItemNum}`);

        // 一旦すべてのborderを透明にする
        Array.prototype.forEach.call(presetItems, function(value, index, array) {
            value.style.border = "1px solid transparent";
        });

        elem.item(0).style.border = "1px solid black";

        // 一時的にここで動かします
        scope.replaceGuiOptionToPresetParam.call(scope, {
            groupNumber: _s.groupNumber,
            presetGradationNum: _s.presetGradationNum
        });

    }

    /**
     * プリセットの値とdat.gui.js側の値を切り替える
     */
    replaceGuiOptionToPresetParam(_s) {

        var scope = this;
        var opt = scope.guiOpt.randomColor[_s.groupNumber];
        var ctls = scope.datCtls.datRandomColor[_s.groupNumber];
        var set = scope.setting.randomColor[_s.groupNumber];
        var flds = scope.datFlds.datRandomColor[_s.groupNumber];

        // グラデーションプリセットから持ってきたグラデーション設定(1つ)
        var presetDetail = scope.gradationPresets[_s.presetGradationNum];

        // 無限ループ注意
        while (presetDetail.color.length != opt['color'].length) {

            var len = opt['color'].length;
            // presetのほうが色数が多い
            if (presetDetail.color.length > opt['color'].length) {

                len = opt['color'].length;

                opt['color'][len] = "#ffffff";
                set["color"][len] = "#ffffff";
                for (let i = 0; i < len + 1; i++) {
                    opt['domain'][i] = i / (len);
                    set["domain"][i] = i / (len);
                }


                ctls[`randomColorColor${len}`] = flds["colorList"].addColor(opt.color, len);
                ctls[`randomColorColor${len}`].onChange(scope.datChange.bind(scope, "randomColor.color", {
                    randomColorGroupNumber: _s.groupNumber,
                    randomColorArrayNumber: len
                }));
                ctls[`randomColorColor${len}`].onFinishChange(scope.datChange.bind(scope, "randomColor.color", {
                    randomColorGroupNumber: _s.groupNumber,
                    randomColorArrayNumber: len,
                    isFinish: true
                }));
                ctls[`randomColorDomain${len}`] = flds["domain"].add(opt.domain, len, 0, 1, 0.01);
                ctls[`randomColorDomain${len}`].onChange(scope.datChange.bind(scope, "randomColor.domain", {
                    randomColorGroupNumber: _s.groupNumber,
                    randomColorArrayNumber: len
                }));
                ctls[`randomColorDomain${len}`].onFinishChange(scope.datChange.bind(scope, "randomColor.domain", {
                    randomColorGroupNumber: _s.groupNumber,
                    randomColorArrayNumber: len,
                    isFinish: true
                }));

                for (let i = 0; i < len + 1; i++) {
                    ctls[`randomColorDomain${i}`].setValue(i / (len));
                }

                // presetのほうが色数が少ない
            } else if (presetDetail.color.length < opt['color'].length) {

                opt['color'].pop();
                set["color"].pop();
                opt['domain'].pop();
                set["domain"].pop();

                var tempLen = len - 1;
                ctls[`randomColorColor${tempLen}`].remove();

                ctls[`randomColorDomain${tempLen}`].remove();

                len = opt['color'].length;

                for (let i = 0; i < len; i++) {
                    opt['domain'][i] = i / (len - 1);
                    set["domain"][i] = i / (len - 1);
                    ctls[`randomColorDomain${i}`].setValue(i / (len - 1));
                }

            }

        }

        // 設定の変更を行う
        for (let i = 0; i < opt["color"].length; i++) {

            ctls[`randomColorColor${i}`].setValue(presetDetail.color[i]);
            opt['color'][i] = presetDetail.color[i];
            set["color"][i] = presetDetail.color[i];

        }

        if (presetDetail.domain != null) {

            if (presetDetail.domain.length > 0) {
                for (let i = 0; i < opt["domain"].length; i++) {

                    ctls[`randomColorDomain${i}`].setValue(presetDetail.domain[i]);
                    opt['domain'][i] = presetDetail.domain[i];
                    set["domain"][i] = presetDetail.domain[i];

                }
            }
        }

        // mode
        if (presetDetail.mode != null) {
            ctls[`randomColorMode`].setValue(presetDetail.mode);
            set["mode"] = presetDetail.mode;
        } else {
            ctls[`randomColorMode`].setValue("rgb");
            set["mode"] = "rgb";
        }
        // padding
        if (presetDetail.padding != null) {
            // ctlsのmaxを超えてた場合は、縮小させたほうがいいのかも？
            ctls[`randomColorPadding`].setValue(presetDetail.padding);
            set["padding"] = presetDetail.padding;
        } else {
            ctls[`randomColorPadding`].setValue(0);
            set["padding"] = 0;
        }
        // gamma
        if (presetDetail.gamma != null) {
            ctls[`randomColorGamma`].setValue(presetDetail.gamma);
            set["gamma"] = presetDetail.gamma;
        } else {
            ctls[`randomColorGamma`].setValue(1.0);
            set["gamma"] = 1.0;
        }
        // classes
        if (presetDetail.classes != null) {
            ctls.classes.number.setValue(presetDetail.classes);
            set["classes"] = presetDetail.classes;
        } else {
            ctls.classes.number.setValue(4);
            set["classes"] = 4;
        }

        if (presetDetail.enablePadding != null) {
            ctls.randomColorEnablePadding.setValue(presetDetail.enablePadding);
            set["enablePadding"] = presetDetail.enablePadding;
        } else {
            ctls.randomColorEnablePadding.setValue(true);
            set["enablePadding"] = true;
        }

        if (presetDetail.enableGamma) {
            ctls.randomColorEnableGamma.setValue(presetDetail.enableGamma);
            set["enableGamma"] = presetDetail.enableGamma;
        } else {
            ctls.randomColorEnableGamma.setValue(true);
            set["enableGamma"] = true;
        }

        if (presetDetail.enableClasses) {
            ctls.classes.enable.setValue(presetDetail.enableClasses);
            set["enableClasses"] = presetDetail.enableClasses;
        } else {
            ctls.classes.enable.setValue(false);
            set["enableClasses"] = false;
        }

        if (presetDetail.enableBezier) {
            ctls.randomColorBezier.setValue(presetDetail.enableBezier);
            set["enableBezier"] = presetDetail.enableBezier;
        } else {
            ctls.randomColorBezier.setValue(false);
            set["enableBezier"] = false;
        }

        if (presetDetail.enableSetRGB != null && presetDetail.enableSetRGB.length > 0) {
            opt["setRGB"]["enableRed"] = presetDetail.enableSetRGB[0];
            opt["setRGB"]["enableGreen"] = presetDetail.enableSetRGB[1];
            opt["setRGB"]["enableBlue"] = presetDetail.enableSetRGB[2];
            set["enableSetRGB"][0] = presetDetail.enableSetRGB[0];
            set["enableSetRGB"][1] = presetDetail.enableSetRGB[1];
            set["enableSetRGB"][2] = presetDetail.enableSetRGB[2];
            ctls.randomColorSetRGB_ER.updateDisplay();
            ctls.randomColorSetRGB_EG.updateDisplay();
            ctls.randomColorSetRGB_EB.updateDisplay();
        } else {
            opt["setRGB"]["enableRed"] = true;
            opt["setRGB"]["enableGreen"] = true;
            opt["setRGB"]["enableBlue"] = true;
            set["enableSetRGB"][0] = true;
            set["enableSetRGB"][1] = true;
            set["enableSetRGB"][2] = true;
            ctls.randomColorSetRGB_ER.updateDisplay();
            ctls.randomColorSetRGB_EG.updateDisplay();
            ctls.randomColorSetRGB_EB.updateDisplay();
        }

        if (presetDetail.enableSetCMYK != null && presetDetail.enableSetCMYK.length > 0) {
            opt["setCMYK"]["enableCyan"] = presetDetail.enableSetCMYK[0];
            opt["setCMYK"]["enableMagenta"] = presetDetail.enableSetCMYK[1];
            opt["setCMYK"]["enableYellow"] = presetDetail.enableSetCMYK[2];
            opt["setCMYK"]["enableKey"] = presetDetail.enableSetCMYK[2];
            set["enableSetCMYK"][0] = presetDetail.enableSetCMYK[0];
            set["enableSetCMYK"][1] = presetDetail.enableSetCMYK[1];
            set["enableSetCMYK"][2] = presetDetail.enableSetCMYK[2];
            set["enableSetCMYK"][3] = presetDetail.enableSetCMYK[3];
            ctls.randomColorSetCMYK_EC.updateDisplay();
            ctls.randomColorSetCMYK_EM.updateDisplay();
            ctls.randomColorSetCMYK_EY.updateDisplay();
            ctls.randomColorSetCMYK_EK.updateDisplay();
        } else {
            opt["setCMYK"]["enableCyan"] = true;
            opt["setCMYK"]["enableMagenta"] = true;
            opt["setCMYK"]["enableYellow"] = true;
            opt["setCMYK"]["enableKey"] = true;
            set["enableSetCMYK"][0] = true;
            set["enableSetCMYK"][1] = true;
            set["enableSetCMYK"][2] = true;
            set["enableSetCMYK"][3] = true;
            ctls.randomColorSetCMYK_EC.updateDisplay();
            ctls.randomColorSetCMYK_EM.updateDisplay();
            ctls.randomColorSetCMYK_EY.updateDisplay();
            ctls.randomColorSetCMYK_EK.updateDisplay();
        }

        if (presetDetail.enableSetHSL != null && presetDetail.enableSetHSL.length > 0) {
            opt["setHSL"]["enableHue"] = presetDetail.enableSetHSL[0];
            opt["setHSL"]["enableSaturation"] = presetDetail.enableSetHSL[1];
            opt["setHSL"]["enableLuminance"] = presetDetail.enableSetHSL[2];
            set["enableSetHSL"][0] = presetDetail.enableSetHSL[0];
            set["enableSetHSL"][1] = presetDetail.enableSetHSL[1];
            set["enableSetHSL"][2] = presetDetail.enableSetHSL[2];
            ctls.randomColorSetHSL_EH.updateDisplay();
            ctls.randomColorSetHSL_ES.updateDisplay();
            ctls.randomColorSetHSL_EL.updateDisplay();
        } else {
            opt["setHSL"]["enableHue"] = true;
            opt["setHSL"]["enableSaturation"] = true;
            opt["setHSL"]["enableLuminance"] = true;
            set["enableSetHSL"][0] = true;
            set["enableSetHSL"][1] = true;
            set["enableSetHSL"][2] = true;
            ctls.randomColorSetHSL_EH.updateDisplay();
            ctls.randomColorSetHSL_ES.updateDisplay();
            ctls.randomColorSetHSL_EL.updateDisplay();
        }

        if (presetDetail.enableSetRGB != null && presetDetail.enableSetRGB.length > 0) {
            opt["setRGB"]["redCalcType"] = presetDetail.setrgb[0].slice(0, 1);
            opt["setRGB"]["greenCalcType"] = presetDetail.setrgb[1].slice(0, 1);
            opt["setRGB"]["blueCalcType"] = presetDetail.setrgb[2].slice(0, 1);
            opt["setRGB"]["red"] = Number(presetDetail.setrgb[0].slice(1, set["enableSetRGB"][0].length));
            opt["setRGB"]["green"] = Number(presetDetail.setrgb[1].slice(1, set["enableSetRGB"][1].length));
            opt["setRGB"]["blue"] = Number(presetDetail.setrgb[2].slice(1, set["enableSetRGB"][2].length));
            set["setrgb"][0] = presetDetail.setrgb[0].slice(0, 1) + Number(presetDetail.setrgb[0].slice(1, set["enableSetRGB"][0].length));
            set["setrgb"][1] = presetDetail.setrgb[1].slice(0, 1) + Number(presetDetail.setrgb[1].slice(1, set["enableSetRGB"][1].length));
            set["setrgb"][2] = presetDetail.setrgb[2].slice(0, 1) + Number(presetDetail.setrgb[2].slice(1, set["enableSetRGB"][2].length));
            ctls.randomColorSetRGB_TR.updateDisplay();
            ctls.randomColorSetRGB_TG.updateDisplay();
            ctls.randomColorSetRGB_TB.updateDisplay();
            ctls.randomColorSetRGB_R.updateDisplay();
            ctls.randomColorSetRGB_G.updateDisplay();
            ctls.randomColorSetRGB_B.updateDisplay();
        } else {
            opt["setRGB"]["redCalcType"] = "+";
            opt["setRGB"]["greenCalcType"] = "+";
            opt["setRGB"]["blueCalcType"] = "+";
            opt["setRGB"]["red"] = 0;
            opt["setRGB"]["green"] = 0;
            opt["setRGB"]["blue"] = 0;
            set["setrgb"][0] = "+0.0";
            set["setrgb"][1] = "+0.0";
            set["setrgb"][2] = "+0.0";
            ctls.randomColorSetRGB_TR.updateDisplay();
            ctls.randomColorSetRGB_TG.updateDisplay();
            ctls.randomColorSetRGB_TB.updateDisplay();
            ctls.randomColorSetRGB_R.updateDisplay();
            ctls.randomColorSetRGB_G.updateDisplay();
            ctls.randomColorSetRGB_B.updateDisplay();
        }

        if (presetDetail.enableSetCMYK != null && presetDetail.enableSetCMYK.length > 0) {
            opt["setCMYK"]["cyanCalcType"] = presetDetail.setcmyk[0].slice(0, 1);
            opt["setCMYK"]["magentaCalcType"] = presetDetail.setcmyk[1].slice(0, 1);
            opt["setCMYK"]["yellowCalcType"] = presetDetail.setcmyk[2].slice(0, 1);
            opt["setCMYK"]["keyCalcType"] = presetDetail.setcmyk[3].slice(0, 1);
            opt["setCMYK"]["cyan"] = Number(presetDetail.setcmyk[0].slice(1, set["enableSetCMYK"][0].length));
            opt["setCMYK"]["magenta"] = Number(presetDetail.setcmyk[1].slice(1, set["enableSetCMYK"][1].length));
            opt["setCMYK"]["yellow"] = Number(presetDetail.setcmyk[2].slice(1, set["enableSetCMYK"][2].length));
            opt["setCMYK"]["key"] = Number(presetDetail.setcmyk[3].slice(1, set["enableSetCMYK"][3].length));
            set["setcmyk"][0] = presetDetail.setcmyk[0].slice(0, 1) + Number(presetDetail.setcmyk[0].slice(1, set["enableSetCMYK"][0].length));
            set["setcmyk"][1] = presetDetail.setcmyk[1].slice(0, 1) + Number(presetDetail.setcmyk[1].slice(1, set["enableSetCMYK"][1].length));
            set["setcmyk"][2] = presetDetail.setcmyk[2].slice(0, 1) + Number(presetDetail.setcmyk[2].slice(1, set["enableSetCMYK"][2].length));
            set["setcmyk"][3] = presetDetail.setcmyk[3].slice(0, 1) + Number(presetDetail.setcmyk[3].slice(1, set["enableSetCMYK"][3].length));
            ctls.randomColorSetCMYK_TC.updateDisplay();
            ctls.randomColorSetCMYK_TM.updateDisplay();
            ctls.randomColorSetCMYK_TY.updateDisplay();
            ctls.randomColorSetCMYK_TK.updateDisplay();
            ctls.randomColorSetCMYK_C.updateDisplay();
            ctls.randomColorSetCMYK_M.updateDisplay();
            ctls.randomColorSetCMYK_Y.updateDisplay();
            ctls.randomColorSetCMYK_K.updateDisplay();
        } else {
            opt["setCMYK"]["cyanCalcType"] = "+";
            opt["setCMYK"]["magentaCalcType"] = "+";
            opt["setCMYK"]["yellowCalcType"] = "+";
            opt["setCMYK"]["keyCalcType"] = "+";
            opt["setCMYK"]["cyan"] = 0;
            opt["setCMYK"]["magenta"] = 0;
            opt["setCMYK"]["yellow"] = 0;
            opt["setCMYK"]["key"] = 0;
            set["setcmyk"][0] = "+0.0";
            set["setcmyk"][1] = "+0.0";
            set["setcmyk"][2] = "+0.0";
            set["setcmyk"][3] = "+0.0";
            ctls.randomColorSetCMYK_TC.updateDisplay();
            ctls.randomColorSetCMYK_TM.updateDisplay();
            ctls.randomColorSetCMYK_TY.updateDisplay();
            ctls.randomColorSetCMYK_TK.updateDisplay();
            ctls.randomColorSetCMYK_C.updateDisplay();
            ctls.randomColorSetCMYK_M.updateDisplay();
            ctls.randomColorSetCMYK_Y.updateDisplay();
            ctls.randomColorSetCMYK_K.updateDisplay();
        }




        if (presetDetail.enableSetHSL != null && presetDetail.enableSetHSL.length > 0) {
            opt["setHSL"]["hueCalcType"] = presetDetail.sethsl[0].slice(0, 1);
            opt["setHSL"]["saturationCalcType"] = presetDetail.sethsl[1].slice(0, 1);
            opt["setHSL"]["luminanceCalcType"] = presetDetail.sethsl[2].slice(0, 1);
            opt["setHSL"]["hue"] = Number(presetDetail.sethsl[0].slice(1, set["enableSetHSL"][0].length));
            opt["setHSL"]["saturation"] = Number(presetDetail.sethsl[1].slice(1, set["enableSetHSL"][1].length));
            opt["setHSL"]["luminance"] = Number(presetDetail.sethsl[2].slice(1, set["enableSetHSL"][2].length));
            set["sethsl"][0] = presetDetail.sethsl[0].slice(0, 1) + Number(presetDetail.sethsl[0].slice(1, set["enableSetHSL"][0].length));
            set["sethsl"][1] = presetDetail.sethsl[1].slice(0, 1) + Number(presetDetail.sethsl[1].slice(1, set["enableSetHSL"][1].length));
            set["sethsl"][2] = presetDetail.sethsl[2].slice(0, 1) + Number(presetDetail.sethsl[2].slice(1, set["enableSetHSL"][2].length));
            ctls.randomColorSetHSL_TH.updateDisplay();
            ctls.randomColorSetHSL_TS.updateDisplay();
            ctls.randomColorSetHSL_TL.updateDisplay();
            ctls.randomColorSetHSL_H.updateDisplay();
            ctls.randomColorSetHSL_S.updateDisplay();
            ctls.randomColorSetHSL_L.updateDisplay();
        } else {
            opt["setHSL"]["hueCalcType"] = "+";
            opt["setHSL"]["saturationCalcType"] = "+";
            opt["setHSL"]["luminanceCalcType"] = "+";
            opt["setHSL"]["hue"] = 0
            opt["setHSL"]["saturation"] = 0
            opt["setHSL"]["luminance"] = 0
            set["sethsl"][0] = "+0.0";
            set["sethsl"][1] = "+0.0";
            set["sethsl"][2] = "+0.0";
            ctls.randomColorSetHSL_TH.updateDisplay();
            ctls.randomColorSetHSL_TS.updateDisplay();
            ctls.randomColorSetHSL_TL.updateDisplay();
            ctls.randomColorSetHSL_H.updateDisplay();
            ctls.randomColorSetHSL_S.updateDisplay();
            ctls.randomColorSetHSL_L.updateDisplay();
        }

        if (presetDetail.enableMix) {
            ctls.randomColorEnableMix.setValue(presetDetail.enableMix);
            set["enableMix"] = presetDetail.enableMix;
        } else {
            ctls.randomColorEnableMix.setValue(false);
            set["enableMix"] = false;
        }

        if (presetDetail.enableBlend) {
            ctls.randomColorEnableBlend.setValue(presetDetail.enableBlend);
            set["enableBlend"] = presetDetail.enableBlend;
        } else {
            ctls.randomColorEnableBlend.setValue(false);
            set["enableBlend"] = false;
        }

        if (presetDetail.mix != null && presetDetail.mix.length > 0) {
            opt["mixColor"] = presetDetail.mix[0];
            opt["mixRatio"] = presetDetail.mix[1];
            opt["mixMode"] = presetDetail.mix[2];
            set.mix = [presetDetail.mix[0], presetDetail.mix[1], presetDetail.mix[2]];
        } else {
            opt["mixColor"] = "#ffffff";
            opt["mixRatio"] = 0.5;
            opt["mixMode"] = "rgb";
            set.mix = ["#ffffff", 0.5, "rgb"];
        }
        ctls.randomColorEnableMix.updateDisplay();
        ctls.randomColorMixColor.updateDisplay();
        ctls.randomColorMixRatio.updateDisplay();
        ctls.randomColorMixMode.updateDisplay();

        if (presetDetail.blend != null && presetDetail.blend.length > 0) {
            opt["blendColor"] = presetDetail.blend[0];
            opt["blendMode"] = presetDetail.blend[1];
            set.blend = [presetDetail.blend[0], presetDetail.blend[1]];
        } else {
            opt["blendColor"] = "#ffffff";
            opt["blendMode"] = "overlay";
            set.blend = ["#ffffff", "overlay"];
        }
        ctls.randomColorEnableBlend.updateDisplay();
        ctls.randomColorBlendColor.updateDisplay();
        ctls.randomColorBlendMode.updateDisplay();






        scope.colorChange({
            settingNumber: _s.groupNumber,
        });

        // 補助用のグラデーション表示のアップデートを行う
        if (scope.guiOpt.randomColor[_s.groupNumber]["functions"]["showGradation"]["showGradation"]) {
            scope.updateShowGradation({
                groupNumber: _s.groupNumber
            });
        }



    }

    // プリセットを削除する
    deleteShowPreset() {

        var scope = this;

        if (document.getElementById("Nasikusa-show-preset") != null) {

            var presetArea = document.getElementById("Nasikusa-show-preset");

            presetArea.parentNode.removeChild(presetArea);

        }


    }

    /**
     * 開発モード用のリサイズイベント
     * @return {[type]} [description]
     */
    onDevResize() {

        var scope = this;
        var width = window.innerWidth;
        var height = window.innerHeight;

        if (scope.s.datgui.enabled) {


            if (width < 1000) {
                scope.dat.width = 200;
            } else {
                scope.dat.width = 300;
            }

            if (scope.dat.autoPlace == false) {
                scope.dat.domElement.style.height = height + "px";
            }

            if (document.getElementById("Nasikusa-show-preset") != null) {

                let presetArea = document.getElementById("Nasikusa-show-preset");
                presetArea.style.height = height + "px";

            }



        }

    }

    /**
     * フェッチ表示
     * @return {[type]} [description]
     */
    initShowFetch(_s) {

        var scope = this;

        var fetchArea = document.createElement("div");
        fetchArea.setAttribute("id", "Nasikusa-show-fetch");

        console.log("obj");
        var fetchObject = scope.colorChange({
            settingNumber: _s.groupNumber,
            isFetchColor: true
        });
        console.log(fetchObject);


    }

}
