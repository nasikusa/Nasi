/*globals Nasikusa,NasikusaBase,TweenMax,chroma,THREE,$,THREEx,TweenLite */

/**
 * @author youkan <https://nasikusa.net>
 * @version 0.0.7
 * twitter : https://twitter.com/nakanasinokusa
 */

class Nasikusa extends NasikusaBase {

    /**
     * Nasikusa constructor
     * @param  {Object} _s general setting
     * @return {void}
     */
    constructor(_s) {

        super(_s);

        this.validateSetting();
        this.createRenderFlag();
        this.createTimeData();
        this.updateNullSetting();
        // #todo 画像ロードが遅れるなどの原因でサイズがおかしくなることがある
        this.setRenderSize();
        this.createScene();
        this.createRenderer();
        // #hint 順番に注意
        // #todo 通常スクロール用の関数と共用しているので注意
        this.onScroll();
        this.createCamera();
        this.createLight();

        if (this.s.controls.enabled === true) this.createControls();
        if (this.s.model.enabled === true) this.createModel();

        // register resize event
        if (this.s.ar.enabled === false || this.s.ar.enabled == null) {
            window.addEventListener("resize", () => this.onResize());
        }

        // register scroll event
        window.addEventListener("scroll", () => this.onScroll());

    }

    /**
     * create data related to time
     * @return {void}
     */
    createTimeData() {

        // To reduce load of renderLoop function, compute fps data in advance.
        if (this.s.fps !== 60) {
            this.isFPS60 = false;
            this.fpsSecond = (1000 / this.s.fps);
        } else {
            this.isFPS60 = true;
        }

        /**
         * clock
         * @type {THREE.Clock}
         */
        this.clock = new THREE.Clock();

    }

    /**
     * レンダラーを作成する関数
     * widthとheightからのレンダリングサイズの決定 ,
     * @return {void}
     * @see 配列の要素を展開して関数の引数にする https://qiita.com/airtoxin/items/e1d6b820825e742be095
     */
    createRenderer(){

        /**
         * 全体設定(短縮用)
         * @type {[type]}
         */
        const obj = this.s.renderer;

        /**
         * コンストラクターとして使われているものの名前をここに記入
         * @type {Array}
         */
        const keywords = ["precision", "alpha", "premultipliedAlpha", "antialias", "stencil", "preserveDrawingBuffer", "depth", "logarithmicDepthBuffer"];

        this.createInstance( obj , keywords , "renderer" , "WebGLRenderer" );

        // const light = {
        //     color : new THREE.Color(0,123,255),
        //     intensity : 1.5,
        //     position : {
        //         x : 1,
        //         y : 0.5,
        //         z : 0,
        //     },
        //     visible : false,
        //     translateX : 2,
        //     rotateX : 1,
        // };
        // const lightKeyWords = ["color","intensity"];
        // this.createInstance( light , lightKeyWords , "light" , "AmbientLight" );
        // console.log(this.light);


        // setRenderSize関数で決めた値をここでレンダラーに伝えて反映させる
        this.renderer.setSize(this.width, this.height);

        /**
         * 実際にレンダリングされるcanvasのラッパーオブジェクト
         * @type {HTMLElement}
         */
        this.canvasArea = this.s.renderArea;

        /**
         * 実際にレンダリングされるcanvas本体
         * @type {HTMLElement}
         */
        this.canvasElement = this.renderer.domElement;

        // call saveGPUInfo function after creating WebGLRenderer and canvas element
        // is good for performance
        this.saveGPUInfo();

    }

    /**
     * レンダラーを作成する関数
     * widthとheightからのレンダリングサイズの決定 ,
     * @temp
     * @deprecated
     * @return {void}
     * @see 配列の要素を展開して関数の引数にする https://qiita.com/airtoxin/items/e1d6b820825e742be095
     */
    backCreateRenderer() {

        /**
         * 全体設定(短縮用)
         * @type {[type]}
         */
        const obj = this.s.renderer;
        /**
         * 設定のキーをここに格納する
         * @type {[type]}
         */
        const keys = Object.keys(obj);
        /**
         * コンストラクターとして使われているものの名前をここに記入
         * @type {Array}
         */
        const keywords = ["precision", "alpha", "premultipliedAlpha", "antialias", "stencil", "preserveDrawingBuffer", "depth", "logarithmicDepthBuffer"];
        /**
         * コンストラクタとして入れるオブジェクト
         * @type {Object}
         */
        const opt = {};

        for (let i = 0, len = keys.length; i < len; i++) {
            if (keywords.indexOf(keys[i]) > -1) opt[keys[i]] = obj[keys[i]];
        }
        /**
         * WebGLRendererオブジェクト
         * @type {THREE.WebGLRenderer}
         * @see WebGLRenderer_doc https://threejs.org/docs/#api/en/renderers/WebGLRenderer
         */
        this.renderer = new THREE.WebGLRenderer(opt);

        // setRenderSize関数で決めた値をここでレンダラーに伝えて反映させる
        this.renderer.setSize(this.width, this.height);

        for (let i = 0, len = keys.length; i < len; i++) {

            /**
             * 対象のプロパティorメソッドの型を取得する
             * @type {String}
             */
            const type = this.getType(this.renderer[keys[i]]);

            if (type === "function") {

                /**
                 * 引数として入る値の型を取得する
                 * @type {String}
                 */
                const argType = this.getType(obj[keys[i]]);

                if (argType === "array") {
                    this.renderer[keys[i]].apply(this, obj[keys[i]]);
                } else {
                    this.renderer[keys[i]](obj[keys[i]]);
                }

            } else if (type != null) {
                this.renderer[keys[i]] = obj[keys[i]];
            }
        }

        /**
         * 実際にレンダリングされるcanvasのラッパーオブジェクト
         * @type {HTMLElement}
         */
        this.canvasArea = this.s.renderArea;

        /**
         * 実際にレンダリングされるcanvas本体
         * @todo 若干上のやつと名前が紛らわしい ( canvasElementがcanvas本体 )
         * @type {HTMLElement}
         */
        this.canvasElement = this.renderer.domElement;

        // call saveGPUInfo function after creating WebGLRenderer and canvas element
        // is good for performance
        this.saveGPUInfo();

    }

    /**
     * 準備したパラメータをつけてインスタンス化させるメソッド
     * @param {Object} obj     コンストラクタやプロパティやメソッドを混ぜて格納したオブジェクト
     * @param {Array} keywords コンストラクタのキーワード
     * @param {String} instance this[xxx]のインスタンスとなるオブジェクト
     * @param {String} root     THREE[xxx]の親となるオブジェクト
     * @todo thisだけでなく、普通に返り値としてインスタンスを返す形もやりたい , lightなど複数のものだとthis指定が厳しい?
     */
    createInstance( obj , keywords , instance , root ){


        /**
         * 設定のキーをここに格納する
         * @type {Object}
         */
        const keys = Object.keys(obj);

        /**
         * コンストラクタとして入れるオブジェクト
         * @type {Object}
         */
        const opt = {};

        for (let i = 0, len = keys.length; i < len; i++) {
            if (keywords.indexOf(keys[i]) > -1){
                opt[keys[i]] = obj[keys[i]];

                // 見つかったものはkeysから削除する(下で同名のものがあるかもなので)
                keys.splice(i,1);
            }
        }

        this[instance] = new THREE[root](opt);

        for (let i = 0, len = keys.length; i < len; i++) {

            /**
             * 対象のプロパティorメソッドの型を取得する
             * @type {String}
             */
            const type = this.getType(this[instance][keys[i]]);

            if (type === "function") {

                /**
                 * 引数として入る値の型を取得する
                 * @type {String}
                 */
                const argType = this.getType(obj[keys[i]]);

                if (argType === "array") {
                    this[instance][keys[i]].apply(this, obj[keys[i]]);
                } else {
                    this[instance][keys[i]](obj[keys[i]]);
                }

            } else if( type === "object" ){

                // empty
                const objectKeys = Object.keys(this[instance][keys[i]]);
                for( let j = 0 , len2 = objectKeys.length ; j < len2 ; j++ ){
                    this[instance][keys[i]][objectKeys[j]] = obj[keys[i]][objectKeys[j]];
                }

            } else if (type != null) {
                this[instance][keys[i]] = obj[keys[i]];
            }
        }
    }

    /**
     * create 3d scene
     * @return {void}
     */
    createScene() {

        /**
         * scene
         * @type {THREE.Scene}
         * @see 公式doc https://threejs.org/docs/#api/en/scenes/Scene
         */
        this.scene = new THREE.Scene();

        // #if fog設定がtrueのみ
        if (this.s.scene.fog.enabled) {
            let fs = this.s.scene.fog;
            if (this.isu(fs.color)) fs.color = new THREE.Color(0xffffff);
            if (this.isu(fs.near)) fs.near = 0.1;
            if (this.isu(fs.far)) fs.far = 10;
            this.scene.fog = new THREE.Fog(fs.color, fs.near, fs.far);
        }

        // #help 背景テクスチャ(引数で入れられるようにしたい) vfxにも使えそう
        // var texture = new THREE.TextureLoader().load("/assets/img/back.jpg");
        // this.scene.background = texture;

    }

    /**
     * ライトの作成を行う
     * @return {[type]} [description]
     */
    createLight() {

        let scope = this;

        scope.ambLight = new THREE.AmbientLight(0xffffff, 1);
        scope.scene.add(scope.ambLight);

    }

    /**
     * renderLoop関数内でrenderするかどうかを決定するフラグを作成する
     * @return {void}
     */
    createRenderFlag() {

        let flag = this.renderFlag = {};
        flag.position = {};

        flag.motion = [];
        flag.animation = [];

        flag.main = true;

        flag.position.before = false;
        flag.position.after = false;
        flag.position.afterWithThreshold = false;
        flag.position.beforeWithThreshold = false;
        flag.position.visible = false;
        flag.position.visibleWithThreshold = false;

    }

    updateRenderFlag() {

    }

    /**
     * インスタンスごとにスクロールイベントを設定する際はここで設定する。Nasikusa全体の場合はonScrollGeneral関数で設定
     * @return {void}
     * @todo canvas自体がスクロール時に動くなどするとどうなる? , thresholdを外部からせっていできるようにしたい , thresholdParamの値をパーセントなどで指定したい
     */
    onScroll() {

        // #todo canvasElementを全体で使用するのが望ましい気がする
        this.canvasRect = this.canvasElement.getBoundingClientRect();

        let beforeParam = this.canvasRect.top - window.innerHeight;
        let afterParam = this.canvasRect.top + this.canvasRect.height;
        let flagPos = this.renderFlag.position;

        /**
         * レンダリングする際のしきい値を指定する
         * @type {number}
         */
        let thresholdParam = 200;

        flagPos.before = ((beforeParam) > 0) ? true : false;
        flagPos.beforeWithThreshold = ((beforeParam) > thresholdParam) ? true : false;
        flagPos.after = ((afterParam) < 0) ? true : false;
        flagPos.afterWithThreshold = ((afterParam) < -thresholdParam) ? true : false;
        flagPos.visible = (flagPos.before === false && flagPos.after === false) ? true : false;
        flagPos.visibleWithThreshold = (flagPos.beforeWithThreshold === false && flagPos.afterWithThreshold === false) ? true : false;

        // #hint レンダリングループ関数で一度レンダリングエリアを離れた後に元に戻すための機能
        if (flagPos.visibleWithThreshold) {
            if (this.renderFlag.main === false) {
                this.renderLoop();
                this.renderFlag.main = true;
            }
        }


    }



    /**
     * レンダリング
     * @return {void}
     * @todo requestAnimationFrameを使用したfpsの調整, setIntervalをオプション , visibleWithThresholdを関係なく常にレンダーする設定が欲しい
     */
    renderLoop() {

        if (this.renderFlag.position.visibleWithThreshold) {

            this.delta = this.clock.getDelta();

            if (this.isFPS60) {
                // requestAnimationFrame(this.renderLoop.bind(this));
                requestAnimationFrame(() => this.renderLoop());
            } else {
                setTimeout(() => this.renderLoop(), this.fpsSecond);
            }

            this.render();
            // console.log("render");

            if ((this.s.controls.type === "orbit" || this.s.controls.type === "DeviceOrientation") && this.ist(this.s.controls.enabled)) {
                this.controls.update();
            }

            if (this.ist(this.s.model.motion.enabled)) {
                if (!this.isUndefined(this.mixer)) {
                    this.mixer.update(this.delta);
                }
            }

            if (this.ist(this.s.datgui.enabled)) {
                if (this.isd(this.guiOpt)) {
                    this._reflectRealTimeUpdateToGuiParam();
                }
            }


        } else {
            // ここで一回レンダリングループが途切れる。onScroll関数内の中でまたレンダリングを再開させる。
            this.renderFlag.main = false;
        }

    }

    render() {

        if (this.ist(this.s.effect)) {
            // #desc uniformがtimeのときのみ処理している
            for (let i = 0, l = this.effectList.length; i < l; i++) {
                for (let j = 0, l2 = this.effectList[i].uniforms.length; j < l2; j++) {
                    if (this.effectList[i].uniforms[j].name === "time") {
                        this[`${this.effectList[i].name}`].uniforms[`${this.effectList[i].uniforms[j].name}`].value = this.clock.getElapsedTime();
                    }
                }
            }
            this.composer.render();
        } else {
            this.renderer.render(this.scene, this.camera);
        }

    }

    /**
     * 設定の文字から、レンダリングするサイズやアスペクトを決定する関数
     *
     * 使用設定 : scope.setting.size.type
     * 設定値 : fixed , fixedHeight , fixedAspect , fixedModelCameraAspect , fill
     * 設定値詳細 : fixed - 固定ピクセルサイズ ( ex : 100px * 100px )
     *             fixedHeight - 高さのみ固定ピクセルサイズ。横は可変。 ( ex : 100% * 400px )
     *             fixedAspect - アスペクトが固定 ( ex : 16 : 9 )
     *             fixedModelCameraAspect - ロードしたモデルに含まれるカメラのアスペクトを使用する＆固定 ( ex : 16 : 9 )
     *             fill - 描画されるcanvasのラッパーオブジェクトと同じ大きさ ( ex : 100% * 100% )
     * @todo 全体設定だけでなく、直で設定できるようにしたい。画像などのロードサイズが遅いものでDOMサイズが小さくなる時にサイズがおかしくなる(fillの場合)
     *
     * @return {void}
     */
    setRenderSize() {

        /**
         * レンダリングされるcanvasのラッパーの
         * @type {[type]}
         */
        this.canvasRect = this.s.renderArea.getBoundingClientRect();

        if (this.s.size.type === "fixed") {
            this.width = this.s.size.width;
            this.height = this.s.size.height;
        } else if (this.s.size.type === "fixedHeight") {

            this.width = this.canvasRect.width;
            // @todo cssのheightを使ったほうがいい？ 今だと2重で決定できてしまうので問題ありかも。
            this.height = this.s.size.height;

        } else if (this.s.size.type === "fixedAspect") {

            this.width = this.canvasRect.width;
            this.height = this.width / this.s.size.aspect;

        } else if (this.s.size.type === "fixedModelCameraAspect") {

            // モデル読み込み後のmodelCameraAspectAdjustment関数で対応

        } else if (this.s.size.type === "fill") {

            this.width = this.canvasRect.width;
            this.height = this.canvasRect.height;

        }

    }



    /**
     * レイキャスターを使用を開始する
     * @return {[type]} [description]
     * @todo マウスの更新とraycasterの更新がごっちゃにならない?不確定な感じになってるかも。→問題は起こしてないっぽいが..。
     */
    createRay() {

        let scope = this;

        scope.createMousePoint();

        /**
         * レイキャスター
         * @type {THREE.Raycaster}
         */
        scope.ray = new THREE.Raycaster();

        /**
         * 全体設定の ray.target の文字によってターゲットをコントロールする
         * @type {Object}
         */
        let targets;
        if (scope.s.ray.target === "all") {
            targets = scope.scene.children;
        } else if (scope.s.ray.target === "model") {
            targets = scope.model.children;
        } else {
            targets = scope.scene.children;
        }

        /**
         * updateRay関数に渡される設定値をここでまとめておきます。
         * @type {Object}
         */
        let updateRayOptions = {
            targets: targets,
            isRecursive: (scope.s.ray.isRecursive == null || scope.s.ray.isRecursive === false) ? false : true,
        };

        // イベントの設定
        if (scope.device === "sp" || scope.device === "tab") {
            if (scope.s.ray.type === "moveOrTouch") {
                scope.canvasArea.addEventListener("touchmove", scope.updateRay.bind(scope, updateRayOptions));
            } else if (scope.s.ray.type === "clickStartOrTapStart") {
                scope.canvasArea.addEventListener("touchstart", scope.updateRay.bind(scope, updateRayOptions));
            } else if (scope.s.ray.type === "clickEndOrTapEnd") {
                scope.canvasArea.addEventListener("touchend", scope.updateRay.bind(scope, updateRayOptions));
            }
        } else if (scope.device === "other") {
            // scope.canvasArea.addEventListener("mousemove" , scope.updateRay.bind(scope , updateRayOptions ) );
            if (scope.s.ray.type === "moveOrTouch") {
                scope.canvasArea.addEventListener("mousemove", scope.updateRay.bind(scope, updateRayOptions));
            } else if (scope.s.ray.type === "clickStartOrTapStart") {
                scope.canvasArea.addEventListener("click", scope.updateRay.bind(scope, updateRayOptions));
            } else if (scope.s.ray.type === "clickEndOrTapEnd") {
                scope.canvasArea.addEventListener("mouseup", scope.updateRay.bind(scope, updateRayOptions));
            }
        }

    }

    /**
     * レイキャスターを更新する
     * @event
     * @param {Object} _s 設定用のオブジェクト
     * @return {[type]} [description]
     */
    updateRay(_s) {

        /**
         * 設定用のオブジェクト
         * @param {Array} targets インターセクトの対象になるオブジェクトを配列で用意する( デフォは scene.children )
         * @param {bool} isRecursive インターセクトをchildrenに対して反復して行うか?( デフォは false )
         * @type {[type]}
         */
        _s = _s || {};

        if (_s.targets == null) {
            _s.targets = this.scene.children;
        }

        if (this.mouse == null) return;

        this.ray.setFromCamera(this.mouse, this.camera);

        this.intersects = this.ray.intersectObjects(_s.targets, true);

        if (this.intersects.length === 0) return;

        // this.intersects[0].object.material.opacity = 1.0;


        if (!TweenMax.isTweening(this.intersects[0].object.material)) {

            TweenMax.to(this.intersects[0].object.material, 0.2 + this.random("simple") * 3, {
                opacity: 1.0,
            });
            // TweenMax.to(this.intersects[0].object.scale, 0.2 + this.random("simple") * 3, {
            //     x: 0,
            //     y : 0,
            //     z : 0,
            //     yoyo : true,
            //     repeat : 1,
            // });
        }

        // TweenMax.fromTo( this.intersects[0].object.scale ,  this.random("simple") * 2 ,  { x : 0.5 , y : 0.5 , z : 0.5 }, { x : 1.0 , y : 1.0 , z : 1.0 } );
        // tl.to( this.intersects[0].object.material ,  0.2 + this.random("simple") * 3 ,  { opacity : 0.0 , delay : this.random("simple")  } );


    }

    /**
     * マウスの使用を開始する ( createRayなどで使用 )
     * updateMousePointのイベントを登録する
     * @return {[type]} [description]
     */
    createMousePoint() {

        var scope = this;

        /**
         * マウス位置(もしくはタッチ位置)を格納する変数
         * @type {THREE.Vector2}
         */
        scope.mouse = new THREE.Vector2();

        // イベントの登録
        if (scope.device === "sp" || scope.device === "tab") {
            if (scope.s.ray.type === "moveOrTouch") {
                scope.canvasArea.addEventListener("touchmove", scope.updateMousePoint.bind(scope));
            } else if (scope.s.ray.type === "clickStartOrTapStart") {
                scope.canvasArea.addEventListener("touchstart", scope.updateMousePoint.bind(scope));
            } else if (scope.s.ray.type === "clickEndOrTapEnd") {
                scope.canvasArea.addEventListener("touchend", scope.updateMousePoint.bind(scope));
            }
        } else if (scope.device === "other") {
            // scope.canvasArea.addEventListener("mousemove" , scope.updateMousePoint.bind(scope) );
            if (scope.s.ray.type === "moveOrTouch") {
                scope.canvasArea.addEventListener("mousemove", scope.updateMousePoint.bind(scope));
            } else if (scope.s.ray.type === "clickStartOrTapStart") {
                scope.canvasArea.addEventListener("click", scope.updateMousePoint.bind(scope));
            } else if (scope.s.ray.type === "clickEndOrTapEnd") {
                scope.canvasArea.addEventListener("mousedown", scope.updateMousePoint.bind(scope));
            }
        }

    }

    /**
     * マウスの位置を更新する
     * @event
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    updateMousePoint(e) {

        var scope = this;
        let x, y, $rendererDomElement;

        // canvasラッパーのrectを更新する
        scope.canvasRect = scope.canvasArea.getBoundingClientRect();

        /**
         * イベントの発生箇所のx座標から、canvaswrapperのleftを引いたもの
         * @type {number}
         */
        if (scope.device === "sp" || scope.device === "tab") {
            if (scope.s.ray.type === "clickStartOrTapStart" || scope.s.ray.type === "moveOrTouch") {
                x = e.touches[0].clientX - scope.canvasRect.left;
            } else if (scope.s.ray.type === "clickEndOrTapEnd") {
                x = e.changedTouches[0].clientX - scope.canvasRect.left;
            }
        } else if (scope.device === "other") {
            x = e.clientX - scope.canvasRect.left;
        }

        /**
         * イベントの発生箇所のy座標から、canvaswrapperのtopを引いたもの
         * @type {number}
         * @todo position : fixed + getBoundingClientRect().top の状況において iOS safariでtopの値が画面上部からになってしまうバグがあると思われる・・。そのための解決策が必要です。
         */
        if (scope.device === "sp" || scope.device === "tab") {
            if (scope.s.ray.type === "clickStartOrTapStart" || scope.s.ray.type === "moveOrTouch") {
                // @todoにも書いたとおり、position : fixed下のgetBoudingClientRectにバグがあるっぽいのでsafariのみ別ルートで動かします。
                // @todo jquery依存のため要注意。jquery入れてるなら問題ないです。
                if (scope.browser === "safari") {
                    $rendererDomElement = $(scope.canvasArea);
                    y = e.touches[0].clientY - $rendererDomElement.offset().top;
                } else {
                    y = e.touches[0].clientY - scope.canvasRect.top;
                }
            } else if (scope.s.ray.type === "clickEndOrTapEnd") {
                // @todoにも書いたとおり、position : fixed下のgetBoudingClientRectにバグがあるっぽいのでsafariのみ別ルートで動かします。
                if (scope.browser === "safari") {
                    $rendererDomElement = $(scope.canvasArea);
                    y = e.changedTouches[0].clientY - $rendererDomElement.offset().top;
                } else {
                    y = e.changedTouches[0].clientY - scope.canvasRect.top;
                }
            }
        } else if (scope.device === "other") {
            y = e.clientY - scope.canvasRect.top;
        }

        // -1 ~ 1 に正規化する
        scope.mouse.x = (x / scope.canvasRect.width) * 2 - 1;
        scope.mouse.y = -(y / scope.canvasRect.height) * 2 + 1;

    }

    /**
     * (0,0,0)の位置からの距離を計測する
     * @return {[type]} [description]
     * @todo 使ってない
     */
    getLength() {

        var scope = this;

        var target = scope.model;
        var lengthList = [];

        for (let i = 0, l = scope.model.children.length; i < l; i++) {

            lengthList[i] = [];
            lengthList[i][0] = scope.model.children[i];
            lengthList[i][1] = scope.model.children[i].position.length();
            // 昇順
            var resLengthList = lengthList.sort(function(a, b) {
                return (a[1] - b[1]);
            });
            // 降順
            // var resLengthList = lengthList.sort( function(a,b){ return( b[1] - a[1] ); } );
            //
            // resLengthList.forEach(function(value,index,array){
            //
            //     value[0].material.opacity =  1 - ( 1 * ( index / array.length ) + Math.random() );
            // });

        }

    }


    /**
     * リサイズ
     * @return {void}
     * @see 要素の中身が変更されたことを知る https://qiita.com/Hashibata/items/1113d9cc6a1ad04a9644
     * @todo window以外でサイズの変更のイベントが発生しないので、何かしらの方法でリサイズを感知する必要がある
     * @todo Resize Observerを使用する方法があるがchromaでしか現在は動かない点に注意
     * @todo 共通動作が多いのでまとめてしまったほうがいいかも？(別でもいいけども)
     */
    onResize() {

        if (this.s.size.type === "fixedHeight") {

            this.canvasRect = this.s.renderArea.getBoundingClientRect();
            this.width = this.canvasRect.width;
            this.renderer.setSize(this.width, this.height);
            this.camera.aspect = this.width / this.height;
            this.camera.updateProjectionMatrix();

        } else if (this.s.size.type === "fixedAspect") {

            this.canvasRect = this.s.renderArea.getBoundingClientRect();
            this.width = this.canvasRect.width;
            this.height = this.width / this.s.size.aspect;
            this.renderer.setSize(this.width, this.height);
            this.camera.aspect = this.width / this.height;
            this.camera.updateProjectionMatrix();

        } else if (this.s.size.type === "fixedModelCameraAspect") {

            this.canvasRect = this.s.renderArea.getBoundingClientRect();
            this.width = this.canvasRect.width;
            this.height = this.width / this.camera.aspect;
            this.renderer.setSize(this.width, this.height);
            this.camera.aspect = this.width / this.height;
            this.camera.updateProjectionMatrix();

        } else if (this.s.size.type === "fill") {

            this.canvasRect = this.s.renderArea.getBoundingClientRect();
            this.width = this.canvasRect.width;
            this.height = this.canvasRect.height;
            this.renderer.setSize(this.width, this.height);
            this.camera.aspect = this.width / this.height;
            this.camera.updateProjectionMatrix();

        } else if (this.s.size.type === "fixed") {
            // empty
        }

    }

    // モデルカメラを使用する際のサイズ調整を行う関数
    modelCameraAdjustment() {

        // モデルカメラを使用する場合
        if (this.s.model.camera.enabled) {

            // モデルカメラの番号指定がなければ自動的に最初のカメラを選択
            if (this.s.model.camera.number == null) {
                this.s.model.camera.number = 0;
            }

            /**
             * 初期生成のカメラ
             * @type {THREE.Camera}
             */
            this.oldCamera = this.camera;

            this.camera = this.gltf.cameras[this.s.model.camera.number];

            // モデルのカメラのアスペクトを使用しない場合の処理。フル画面など。
            // @todo もっと簡潔に切り替えができると良い( fill ならオフなど)
            if (this.s.model.camera.disablemodel.cameraAspect) {

                this.camera.aspect = this.oldCamera.aspect;
                this.camera.updateProjectionMatrix();

            }


            // カメラポジションの調整
            Object.keys(this.s.model.camera.positionAdjustment).forEach(function(key) {

                // key is string
                if (this.s.model.camera.positionAdjustment[key] != 0) {
                    this.camera.position[key] += this.s.model.camera.positionAdjustment[key];
                }

            });

        }

        // サイズのモードが fixedModelCameraAspect の場合のみ
        if (this.s.size.type === "fixedModelCameraAspect") {

            this.canvasRect = this.s.renderArea.getBoundingClientRect();
            this.width = this.canvasRect.width;
            this.height = this.width / this.camera.aspect;
            this.renderer.setSize(this.width, this.height);

        }

    }


    /**
     * カメラの作成
     * @return {[type]} [description]
     */
    createCamera() {

        /**
         * 全体設定のカメラ項目
         * @type {Object}
         */
        let ca = this.s.camera;

        if (ca.type === "perspective" || ca.type == null) {

            this.camera = new THREE.PerspectiveCamera(ca.fov ? ca.fov : 35, this.width / this.height, ca.near ? ca.near : 0.1, ca.far ? ca.far : 1000);

            // #desc ポジション設定
            this.camera.position.x = (this.isu(ca.position.x)) ? 5 : ca.position.x;
            this.camera.position.y = (this.isu(ca.position.y)) ? 5 : ca.position.y;
            this.camera.position.z = (this.isu(ca.position.z)) ? 5 : ca.position.z;

            // #desc 回転設定
            if (ca.rotation.enabled == null || ca.rotation.enabled === true) {
                if (ca.rotation.x != null) this.camera.rotation.x = THREE.Math.degToRad(ca.rotation.x);
                if (ca.rotation.y != null) this.camera.rotation.y = THREE.Math.degToRad(ca.rotation.y);
                if (ca.rotation.z != null) this.camera.rotation.z = THREE.Math.degToRad(ca.rotation.z);
            }

            // #desc lookAt設定 ( 回転との併用不可 )
            if (Object.keys(ca.lookAt).length) {
                if (ca.lookAt.enabled == null || ca.lookAt.enabled === true) {
                    if (ca.lookAt.x == null) ca.lookAt.x = 0;
                    if (ca.lookAt.y == null) ca.lookAt.y = 0;
                    if (ca.lookAt.z == null) ca.lookAt.z = 0;
                    this.camera.lookAt(new THREE.Vector3(ca.lookAt.x, ca.lookAt.y, ca.lookAt.z));
                }
            }

        } else if (ca.type === "orthographic" || ca.type === "ortho") {
            // @todo 平行投影はまだしっかりできてない感じです。

            let left = this.width / -2;
            let right = this.width / 2;
            let top = this.height / 2;
            let bottom = this.height / -2;

            this.camera = new THREE.OrthographicCamera(left, right, top, bottom, ca.near, ca.far);
            (ca.position.x == null) ? this.camera.position.x = 5: this.camera.position.x = ca.position.x;
            (ca.position.y == null) ? this.camera.position.y = 5: this.camera.position.y = ca.position.y;
            (ca.position.z == null) ? this.camera.position.z = 5: this.camera.position.z = ca.position.z;
            (ca.orthoZoom == null) ? this.camera.zoom = 1.0: this.camera.zoom = ca.orthoZoom;

        }


    }


    /**
     * コントローラーを作成する
     *
     * @todo まだ途中なので追加したい・・・。
     * @return {void} [description]
     */
    createControls() {

        let scope = this;

        if (scope.s.controls.enabled) {

            if (scope.s.controls.type === "orbit") {

                /**
                 * コントローラーの反応するエリアの設定
                 * @type {DOM}
                 */
                let listener;
                if (scope.s.controls.orbitSetting.listener != null) {
                    listener = scope.s.controls.orbitSetting.listener;
                } else {
                    listener = scope.s.renderArea;
                }

                // @todo モデルカメラの場合はどうなる？再呼び出し？
                scope.controls = new THREE.OrbitControls(scope.camera, listener);
                // パンの方法(デフォルトはtrue)
                if (scope.s.controls.orbitSetting.screenSpacePanning == null) {
                    scope.controls.screenSpacePanning = true;
                } else {
                    scope.controls.screenSpacePanning = scope.s.controls.orbitSetting.screenSpacePanning ? true : false;
                }

                // 横方向の制限
                scope.controls.maxAzimuthAngle = typeof scope.s.controls.orbitSetting.maxAzimuthAngle !== "undefined" ? scope.s.controls.orbitSetting.maxAzimuthAngle : Infinity;
                scope.controls.minAzimuthAngle = typeof scope.s.controls.orbitSetting.minAzimuthAngle !== "undefined" ? scope.s.controls.orbitSetting.minAzimuthAngle : -Infinity;
                // 縦方向の制限
                scope.controls.maxPolarAngle = typeof scope.s.controls.orbitSetting.maxPolarAngle !== "undefined" ? scope.s.controls.orbitSetting.maxPolarAngle : Math.PI;
                scope.controls.minPolarAngle = typeof scope.s.controls.orbitSetting.minPolarAngle !== "undefined" ? scope.s.controls.orbitSetting.minPolarAngle : 0;
                // ダンピング
                (scope.s.controls.orbitSetting.enableDamping == null) ? scope.controls.enableDamping = true: scope.controls.enableDamping = scope.s.controls.orbitSetting.enableDamping;
                scope.controls.dampingFactor = typeof scope.s.controls.orbitSetting.dampingFactor !== "undefined" ? scope.s.controls.orbitSetting.dampingFactor : 1.0;
                // パン
                (scope.s.controls.orbitSetting.enablePan == null) ? scope.controls.enablePan = true: scope.controls.enablePan = scope.s.controls.orbitSetting.enablePan;
                // ズーム
                (scope.s.controls.orbitSetting.enableZoom == null) ? scope.controls.enableZoom = true: scope.controls.enableZoom = scope.s.controls.orbitSetting.enableZoom;
                // 回転
                (scope.s.controls.orbitSetting.enableRotate == null) ? scope.controls.enableRotate = true: scope.controls.enableRotate = scope.s.controls.orbitSetting.enableRotate;
                (scope.s.controls.orbitSetting.rotateSpeed == null) ? scope.controls.rotateSpeed = 1.0: scope.controls.rotateSpeed = scope.s.controls.orbitSetting.rotateSpeed;
                // 自動回転
                (scope.s.controls.orbitSetting.autoRotate == null) ? scope.controls.autoRotate = false: scope.controls.autoRotate = scope.s.controls.orbitSetting.autoRotate;
                (scope.s.controls.orbitSetting.autoRotateSpeed == null) ? scope.controls.autoRotateSpeed = 2.0: scope.controls.autoRotateSpeed = scope.s.controls.orbitSetting.autoRotateSpeed;
                // ターゲット
                (scope.s.controls.orbitSetting.target == null) ? scope.controls.target = new THREE.Vector3(0, 0, 0): scope.controls.target = new THREE.Vector3(scope.s.controls.orbitSetting.target[0], scope.setting.controls.orbitSetting.target[1], scope.setting.controls.orbitSetting.target[2]);




            } else if (scope.s.controls.type === "deviceOrientation") {

                scope.controls = new THREE.DeviceOrientationControls(scope.camera, scope.renderer.domElement);


            } else if (scope.s.controls.type === "mouse") {


            } else if (scope.s.controls.type === "transform") {


            } else if (scope.s.controls.type === "autoOrbit") {

            }

        }

    }

    /**
     *
     * @todo キャッシュも削除したい
     */
    removeModel() {

        let scope = this;

        scope.scene.remove(scope.model);
        // geometry.dispose();
        // material.dispose();
        // texture.dispose();


    }




    /**
     * モデルのロード
     * @return {void}
     *
     * _sについての詳細
     * @param _s.addModel
     * @todo 複数対応 , ajax対応 , 途中でも
     */
    createModel(_s) {

        if (this.isu(_s)) _s = {};
        if (this.isu(_s.addModel)) _s.addModel = false;

        /**
         * 複数モデル使用時用の配列モデルデータ
         * @type {Array}
         */
        this.models = [];

        /**
         * 名前付きのモデルデータ(主に複数モデル使用時用)
         * @type {Object}
         */
        this.namedModels = {};


        Nasikusa.data.models = [];


        // モデルのローダータイプが gltf の場合 ( or nullの場合 )
        // @todo sceneが複数ある場合に対応できてないです..。
        if (this.s.model.loader === "gltf" || this.s.model.loader == null) {

            this.loader = new THREE.GLTFLoader();

            this.loader.load(this.s.model.path, data => {

                /**
                 * GLTFファイルからもらったデータ
                 * @type {Object}
                 */
                this.gltf = data;

                /**
                 * ローダーにかかわらず共通でこの変数に格納されます
                 * @type {Object}
                 */
                this.model = this.gltf.scene;
                this.models.push(this.model);
                Nasikusa.data.models.push(this.model);

                // temp
                // deprecated
                if (this.s.nameme.enabled) {
                    let scale;
                    switch (Number(this.s.nameme.model)) {
                        case 2:
                            scale = 3;
                            break;
                        case 3:
                            scale = 10;
                            break;
                        case 4:
                            scale = 1;
                            break;
                        case 5:
                            scale = 2;
                            break;
                        case 6:
                            scale = 1.5;
                            break;
                        case 7:
                            scale = 3;
                            break;
                        case 8:
                            scale = 3;
                            break;
                        case 9:
                            scale = 0.025;
                            break;
                    }

                    if (this.isd(scale)) {
                        this.model.children[0].scale.set(scale, scale, scale);
                    }

                }

                this.setMaterial();

                this.scene.add(this.gltf.scene);

                if (_s.addModel) {
                    this.onAddModel();
                } else {
                    this.oncreateModel();
                }

            });

        } else if (this.s.model.loader === "draco") {

            // empty

        } else if (this.s.model.loader === "fbx") {

            this.loader = new THREE.FBXLoader();

            this.loader.load(this.s.model.path, function(data) {

                this.fbx = data;
                /**
                 * ローダーにかかわらず共通でこの変数に格納されます
                 * @type {Object}
                 */
                this.model = data;
                this.models.push(this.model);
                Nasikusa.data.models.push(this.model);

                this.scene.add(this.fbx);

                this.setMaterial();

                if (_s.addModel) {
                    this.onAddModel();
                } else {
                    this.oncreateModel();
                }

            }, null, function(e) {
                console.log(e);
            });


        } else if (this.s.model.loader === "obj") {

            this.loader = new THREE.OBJLoader();

            this.loader.load(this.s.model.path, function(data) {

                this.obj = data;
                this.model = data;

                this.scene.add(this.obj);

                this.oncreateModel();

            });


        } else if (this.s.model.loader === "objmtl") {

            this.loader = new THREE.OBJLoader();
            this.mtlLoader = new THREE.MTLLoader();

            this.mtlLoader.load(this.s.model.mtlPath, function(material) {

                material.preload();
                this.loader.setMaterials(material);

                this.loader.load(this.s.model.path, function(data) {

                    this.objmtl = data;
                    this.model = data;

                    this.setMaterial();

                    this.scene.add(this.objmtl);

                    this.oncreateModel();

                });

            });

        }

    }

    /**
     * ロードしたモデルのマテリアルを調整する関数
     * @return {void} [description]
     * @todo defaultがまだ完成してないです
     *
     *
     * _sについての解説
     * @type {Object} _s
     * @prop  {Object|Array} target 対象となるオブジェクトを任意で設定できる( defaultはscope.model )
     * @prop {String} type マテリアルのタイプ  ex) basic | normal | diffuse など
     * @prop {Object} materialSetting カスタム
     */
    setMaterial(_s) {

        if (_s == null) _s = {};
        if (_s.target == null) {
            _s.target = this.model;
        }

        /**
         * アップデートさせるマテリアルをここに格納
         * @type {Array}
         */
        let target = [];
        // @if 入力された _s.target が配列であった場合はそのまま使用する
        if (Array.isArray(_s.target)) {
            target = _s.target;
        } else {
            _s.target.traverse(function(object) {
                if (object.isMesh) {
                    target.push(object);
                }
            });
        }

        /**
         * マテリアルのタイプの設定をここに格納 ex) basic | normal | diffuse など
         * @type {String}
         */
        var materialType;
        if (_s.type != null) {
            materialType = _s.type;
        } else if (this.s.model.material != null) {
            materialType = this.s.model.material;
        } else {
            console.error("setMaterial");
        }

        let ms;

        /**
         * モデルのマテリアル設定を短縮させてここに格納
         * @type {Object}
         */
        if (_s.materialSetting != null) {
            ms = _s.materialSetting;
        } else {
            ms = this.s.model.materialSetting;
        }

        for (let i = 0, l = target.length; i < l; i++) {

            // materialが存在したら動く
            if (target[i].material != null) {

                if (materialType === "basic") {

                    // 先にここで設定( 0の場合はfalseとして扱われてしまうため )
                    if (ms.opacity == null) {
                        ms.opacity = 1.0;
                    }


                    target[i].material = new THREE.MeshBasicMaterial({
                        color: ms.color ? new THREE.Color(ms.color) : new THREE.Color(0xffffff),
                        side: ms.side ? THREE[ms.side] : THREE.DoubleSide,
                        transparent: (ms.transparent != null) ? ms.transparent : true,
                        opacity: ms.opacity,
                        polygonOffset: ms.polygonOffset ? ms.polygonOffset : false,
                        polygonOffsetFactor: -(target.length - i),
                        polygonOffsetUnits: -(target.length - i),
                        morphTargets: true, // これがないとモーフが動かない
                        blending: (ms.blending != null) ? THREE[ms.blending] : THREE.NormalBlending,
                    });

                } else if (materialType === "normal") {

                    target[i].material = new THREE.MeshNormalMaterial();

                } else if (materialType === "lambert") {

                    // @todo いろいろ設定値
                    target[i].material = new THREE.MeshLambertMaterial();

                } else if (materialType === "shadow") {

                    target[i].material = new THREE.ShadowMaterial();

                } else if (materialType === "depth") {

                    target[i].material = new THREE.MeshDepthMaterial();

                } else if (materialType === "default") {

                    // マテリアル設定の enabledがtrueかnull(未記入)であるときに設定を反映する
                    if (ms.defaultEnabled === true || ms.defaultEnabled == null) {

                        if (ms.color != null) target[i].material.color = new THREE.Color(ms.color);
                        if (ms.side != null) target[i].material.side = THREE[ms.side];
                        if (ms.transparent != null) target[i].material.transparent = ms.transparent;
                        if (ms.opacity != null) target[i].material.opacity = ms.opacity;
                        if (ms.polygonOffset === true) {
                            target[i].material.polygonOffset = true;
                            target[i].material.polygonOffsetFactor = -(target.length - i);
                            target[i].material.polygonOffsetUnits = -(target.length - i);
                        }

                    }

                }


            }

        }

    }

    /**
     * 同一オブジェクトを複製する
     * @return {[type]} [description]
     * @see How_to_clone_an_object3d_in_Three.js? https://stackoverflow.com/questions/11919694/how-to-clone-an-object3d-in-three-js
     * @todo ハードコピーと単純なインスタンスのコピーの両方を行いたい
     */
    createClone() {



    }

    /**
     * フォント
     * @see フォント用のjsのジェネレータ https://gero3.github.io/facetype.js/
     * @see フォント用のjsのジェネレータ(github) https://github.com/gero3/facetype.js
     * @see TextGeometry_公式doc https://threejs.org/docs/#api/en/geometries/TextGeometry
     */
    createFontObject() {

        var scope = this;

        /**
         * フォントローダー
         * @var {THREE.FontLoader}
         */
        var loader = new THREE.FontLoader();
        loader.load(scope.s.text.src, function(font) {

            if (scope.s.text.type === "indivisual") {

                if (scope.s.text.text == null) {
                    console.warn("createFontObject関数のテキストが設定されていません");
                    scope.s.text.text = "temp_text";
                }

                /**
                 * テキスト文字を１文字ずつ分解したもの
                 * @var {Array}
                 */
                var textArray = scope.s.text.text.split("");

                if (scope.s.text.randomColor) {
                    /**
                     * 文字数
                     * @type {number}
                     */
                    var getColorNumber = textArray.length;

                    // @desc グラデーションプリセットの番号( 記入がない場合はランダムで取得 )
                    if (scope.s.text.randomColorPresetNum != null) {
                        var preset = scope.gradationPresets.filter(function(item) {
                            if (item.id == scope.s.text.randomColorPresetNum) {
                                return true;
                            }
                        })[0];
                        if (preset == null) {
                            console.error("createFontObject");
                            return;
                        }
                        if (preset.length > 1) console.warn("同じidのグラデーションが複数あります");
                    } else {
                        var preset = scope.gradationPresets[Math.floor(scope.gradationPresets.length * Math.random())];
                    }

                    // @desc presetオブジェクトへのプロパティの追加(主に設定用)
                    preset.returnScaleColors = getColorNumber;

                    /**
                     * colorChange関数から得たスケールをここに格納
                     * @type {Object}
                     */
                    var scale = scope.colorChange(preset);
                    // var scale = scope.colorChange( scaleOptions );

                }

                /**
                 * 文字オブジェクトグループ
                 * @var {Object}
                 */
                var textGroup = new THREE.Group();

                var resultColors = [];

                textArray.forEach(function(value, index, array) {

                    /**
                     * テキストのジオメトリ
                     * @var {THREE.TextGeometry}
                     * @see TextGeometry_公式doc https://threejs.org/docs/#api/en/geometries/TextGeometry
                     */
                    var textGeometry = new THREE.TextGeometry(textArray[index], {
                        font: font || "/assets/js/three/fonts/mplus1.json",
                        size: (scope.s.text.size != null) ? scope.s.text.size : 0.2,
                        height: (scope.s.text.height != null) ? scope.s.text.height : 0.01,
                        curveSegments: (scope.s.text.curveSegments != null) ? scope.s.text.curveSegments : 8,
                    });

                    // @desc カラーの設定
                    if (scope.s.text.randomColor) {
                        let colNum = Math.floor(Math.random() * getColorNumber);
                        // let colNum = index;
                        var materialColor = scale[colNum].replace("#", "0x");

                        let colChroma = chroma(scale[colNum]);
                        var colObj = {
                            rgb_r: colChroma.get("rgb.r"),
                            rgb_g: colChroma.get("rgb.g"),
                            rgb_b: colChroma.get("rgb.b"),
                            hsl_h: colChroma.get("hsl.h"),
                            hsl_s: colChroma.get("hsl.s"),
                            hsl_l: colChroma.get("hsl.l"),
                            gl_r: colChroma.get("rgb.r") / 255,
                            gl_b: colChroma.get("rgb.g") / 255,
                            gl_b: colChroma.get("rgb.b") / 255,
                        };
                        resultColors.push(colObj);
                    } else if (scope.s.text.color != null) {
                        var materialColor = scope.s.text.color;
                    } else {
                        console.warn("createFontObject関数のカラーが設定されていません。一時的に白色で表示します。");
                        var materialColor = "0xffffff";
                    }

                    /**
                     * テキストのマテリアル
                     * @var {THREE.MeshBasicMaterial}
                     * @todo setMaterialでやったほうがいいかな。。。
                     */
                    var material = new THREE.MeshBasicMaterial({
                        color: new THREE.Color(Number(materialColor)),
                        transparent: (scope.s.text.transparent != null) ? scope.s.text.transparent : false,
                        opacity: (scope.s.text.opacity != null) ? scope.s.text.opacity : 1.0,
                    });

                    /**
                     * テキストメッシュ本体はここに格納されます
                     * @type {THREE.Mesh}
                     */
                    var text = new THREE.Mesh(textGeometry, material);

                    // @desc 文字スペース設定
                    if (scope.s.text.space == null) scope.s.text.space = 2;
                    text.translateX(index * scope.s.text.size * scope.s.text.space);
                    text.translateY(1);
                    textGroup.add(text);

                });

                scope.scene.add(textGroup);

                // @todo 外部関数化してもいいかも
                for (let i = 0, l = textGroup.children.length; i < l; i++) {
                    if (i === 0) {
                        var box = {
                            xmin: 0,
                            xmax: 0,
                            ymin: 0,
                            ymax: 0,
                            zmin: 0,
                            zmax: 0,
                        };
                    }
                    if (textGroup.children[i].position.x < box.xmin) box.xmin = textGroup.children[i].position.x;
                    if (textGroup.children[i].position.x > box.xmax) box.xmax = textGroup.children[i].position.x;
                    if (textGroup.children[i].position.y < box.ymin) box.ymin = textGroup.children[i].position.y;
                    if (textGroup.children[i].position.y > box.ymax) box.ymax = textGroup.children[i].position.y;
                    if (textGroup.children[i].position.z < box.zmin) box.zmin = textGroup.children[i].position.z;
                    if (textGroup.children[i].position.z > box.zmax) box.zmax = textGroup.children[i].position.z;
                    if (i === (textGroup.children.length - 1)) {
                        // return box;
                    }
                    // console.log( box );
                }

                textGroup.position.set(box.xmax * -0.5, 0, 0);

                /**
                 * createAnimation関数の設定オブジェクト
                 * @type {Object}
                 */
                var options = {
                    type: "position",
                    targets: textGroup,
                    isTraverse: true,
                    colors: resultColors,
                    sort: {
                        enabled: true,
                        type: "position",
                        positionDirection: "x",
                        positionDirectionReverse: false,
                        reverse: false,
                        colorOption: "rgb.r",
                    },
                };
                scope.createAnimations(options);


                // @if textオブジェクトを結合させて出力する場合
            } else if (scope.s.text.type === "combine") {

                /**
                 * テキストのジオメトリ
                 * @var {THREE.TextGeometry}
                 */
                var textGeometry = new THREE.TextGeometry(scope.s.text.text, {
                    text: text || "/assets/js/three/texts/mplus1.json",
                    size: (scope.s.text.size != null) ? scope.s.text.size : 0.2,
                    height: (scope.s.text.height != null) ? scope.s.text.height : 0.01,
                });

                /**
                 * テキストのマテリアル
                 * @var {THREE.MeshBasicMaterial}
                 */
                var material = new THREE.MeshBasicMaterial({
                    color: (scope.s.text.color != null) ? scope.s.text.color : new THREE.Color(0xffffff),
                    transparent: (scope.s.text.transparent != null) ? scope.s.text.transparent : false,
                    opacity: (scope.s.text.opacity != null) ? scope.s.text.opacity : 1.0,
                });

                var text = new THREE.Mesh(textGeometry, material);

                scope.scene.add(text);

                // バウンディングボックスの計算
                text.geometry.computeBoundingBox();

                // 中央寄せ
                // text.position.set( - ( text.geometry.boundingBox.max.x * 0.5 )  , 1 , 0 );
                text.position.set(-(boundingBox.max.x) * textArray.length, 1, 0);
            }

        });

    }


    /**
     * グループはバウンディングボックスを取得できないので、これで取得する
     * @param {Object3D}
     * @return
     */
    getCompoundBoundingBox(object3D) {
        var box = null;
        object3D.traverse(function(obj3D) {
            var geometry = obj3D.geometry;
            if (geometry === undefined) return;
            geometry.computeBoundingBox();
            if (box === null) {
                box = geometry.boundingBox;
            } else {
                box.union(geometry.boundingBox);
            }
        });
        return box;
    }



    /**
     * モデルをロードしたあとに行う関数たち
     * @return {void}
     * @todo モデル読み込みを行わないときにここの関数が全部読み込まれない...
     */
    oncreateModel() {

        // #hint initEffectよりも先でお願いします。
        this.modelCameraAdjustment();

        // #hint 一度レンダリングだけしておく(空白を防ぐ)
        this.render();

        this.createTraverseNI(this.scene);

        // #if ランダムカラー変更を行うか
        if (this.ist(this.s.enableRandomColor) && this.isd(this.s.enableRandomColor)) {
            this.colorChange({
                settingNumber: 0,
            });
        }

        // #if モーションを適用するか
        if (this.s.model.motion.enabled && this.s.event.type == null) {
            this.createMotion();
        }

        // #if エフェクトを掛けるかどうか
        if (this.s.effect) {
            this.initEffect();
        }

        // #if イベントを適用するか
        if (this.s.event.type !== null) {
            this.createEvent();
        }

        // #if 背景画像を作るか
        if (this.s.backImage.enabled) {
            this.createBackImg();
        }

        // #if ar設定がenabled : trueなら
        if (this.s.ar.enabled) {
            this.initAR();
        }

        // #if フォントオブジェクトを作成するか
        if (this.s.text.enabled) {
            this.createFontObject();
        }

        // #if arレンダーループか通常レンダーループを行うか
        if (this.s.ar.enabled) {
            this.renderARLoop();
        } else if (this.s.event.type == null || this.s.event.beforeRender === true || this.s.event.beforeRender == null && this.s.ar.enabled == null) {
            this.renderLoop();
        }


        // #if レイキャスターを使用するか
        if (this.s.ray.enabled) {
            this.createRay();
        }

        // #if コンソールに情報を表示するか(主に開発用)
        if (this.s.console.enable || this.s.console.enable == null) {
            this.consoleInfo();
        }

        // #if datguiを使用するか
        if (this.s.datgui.enabled) {
            this.datgui();
        }

        // #if devModeを使用するか
        // #todo 仕様が曖昧
        // #todo サイレントでエラー起こしやすい
        if (this.s.devMode.enabled) {
            this.initDev();
        }

        // #hint createRendererからこっちに持ってきた
        this.canvasArea.appendChild(this.renderer.domElement);


        if (this.ist(this.s.enableAnimation) || this.isu(this.s.enableAnimation)) {
            if (this.isd(this.s.animation)) {
                if (this.isf(this.s.event.enabled) || this.isu(this.s.event.enabled)) {
                    this.createAnimations(this.s.animation);
                }
            }
        }

    }

    onAddModel() {

        if (this.ist(this.s.enableRandomColor) && this.isd(this.s.enableRandomColor)) {
            this.colorChange({
                settingNumber: 0,
            });
        }

        // #if モーションを適用するか
        if (this.s.model.motion.enabled && this.s.event.type == null) {
            this.createMotion();
        }

        // #if イベントを適用するか
        if (this.s.event.type !== null) {
            this.createEvent();
        }

        if (this.ist(this.s.enableAnimation) || this.isu(this.s.enableAnimation)) {
            if (this.isd(this.s.animation)) {

                if (this.isf(this.s.event.enabled) || this.isu(this.s.event.enabled)) {

                    this.createAnimations(this.s.animation);

                }
            }
        }

    }


    initEffect() {
        var scope = this;

        scope.composer = new THREE.EffectComposer(scope.renderer);

        scope.renderPass = new THREE.RenderPass(scope.scene, scope.camera);

        scope.CopyShader = new THREE.ShaderPass(THREE.CopyShader);

        scope.composer.addPass(scope.renderPass);

        scope.s.effectName ? "" : scope.s.effectName = [];
        scope.effectList = scope.s.effectName;

        for (let i = 0; i < scope.effectList.length; i++) {

            if (!scope.effectList[i].enabled) {
                continue;
            }

            scope[`${scope.effectList[i].name}`] = new THREE.ShaderPass(THREE[`${scope.effectList[i].name}`]);

            for (let j = 0; j < scope.effectList[i].uniforms.length; j++) {

                var uniform = scope[`${scope.effectList[i].name}`].uniforms[`${scope.effectList[i].uniforms[j].name}`];
                switch (scope.effectList[i].uniforms[j].name) {
                    case "resolution":
                        uniform.value = new THREE.Vector2(scope.width, scope.height);
                        break;
                    case "time":
                        break;
                    default:
                        uniform.value = scope.effectList[i].uniforms[j].param;
                        break;
                }
            }
            scope.composer.addPass(scope[`${scope.effectList[i].name}`]);
            if (scope.effectList.length - 1 === i) {
                scope[`${scope.effectList[i].name}`].renderToScreen = true;
            }
        }


        // uniformsアニメーション
        for (let i = 0; i < scope.effectList.length; i++) {
            if (scope.effectList[i].animations == null) {
                continue;
            }
            for (let j = 0; j < scope.effectList[i].animations.length; j++) {
                var uniforms = scope[`${scope.effectList[i].name}`].uniforms;
                var animation = scope.effectList[i].animations[j];
                if (animation.event === "start") {
                    TweenMax.to(uniforms[animation.name], animation.duration, {
                        value: animation.to,
                        delay: animation.delay,
                        ease: animation.easing
                    });
                }
                if (animation.event === "click") {

                    animation.clickArea[0].addEventListener("click", function() {

                        if (animation.to === "random") {
                            var randTo = Math.random() * (animation.randomScale[1] - animation.randomScale[0]) + animation.randomScale[0];
                        }

                        if (animation.to !== null && animation.from == null) {

                            TweenMax.to(
                                uniforms[animation.name],
                                animation.duration, {
                                    value: animation.to === "random" ? randTo : animation.to,
                                    delay: animation.delay,
                                    ease: animation.easing,
                                    repeat: animation.repeat,
                                    yoyo: animation.yoyo,
                                }
                            );

                        } else if (animation.to !== null && animation.from !== null) {

                            TweenMax.fromTo(
                                uniforms[animation.name],
                                animation.duration, {
                                    value: animation.from,
                                }, {
                                    value: animation.to === "random" ? randTo : animation.to,
                                    delay: animation.delay,
                                    ease: animation.easing,
                                    repeat: animation.repeat,
                                    yoyo: animation.yoyo,
                                }
                            );

                        }


                    });

                }
            }
        }

    }


    createBackImg() {

        var setting = this.s.backImage;
        if (setting.type === "css") {
            this.renderer.domElement.style.backgroundImage = "url(" + setting.src + ")";
            this.renderer.domElement.style.backgroundSize = setting.size;
            this.renderer.domElement.style.backgroundPosition = "center";
        }

    }


    /**
     * カラーをランダムで変更する関数
     * @return {void} [description]
     * @see chroma.js https://gka.github.io/chroma.js/
     *
     * 引数 _s についての詳細説明です
     * @type {object} _s
     * @param {number} settingNumber scope.settingの値を使用する場合は必須。 scope.setting.randomColorの値を使用する場合はここに数値を入れる。( randomColorが複数ある可能性があるため何個目か明示してほしい )
     * @param {bool} returnScaleOnly scaleのみを返して個々の色変更を行わない場合は記入
     * @param {number} returnScaleColors colors関数で決まった数のカラーを返してほしい場合に記入
     * @param {Array} targetModels 対象となるモデル
     * @param {bool} isFetchColor dat.gui.jsで色管理している際に、modeごとの色の違いを表示するためのオプションが有効の場合に記入
     */
    colorChange(_s) {

        var scope = this;

        /**
         * 設定が格納されるオブジェクト
         * @type {object}
         */
        var setting;
        // @if _s.settingNumberが存在する場合はscope.settingの値を取り込んで使用する
        if (_s.settingNumber != null) {
            setting = scope.setting.randomColor[_s.settingNumber];
        } else if (_s.settingNumber == null) {

            let preset = _s;

            if (preset.domain == null) {
                var presetDomain = [];
                for (let i = 0, l = preset.color.length; i < l; i++) {
                    presetDomain[i] = i / (preset.color.length - 1);
                }
            }

            setting = {
                enabled: (preset.enabled != null) ? preset.enabled : true,
                target: "all",
                color: preset.color,
                domain: (preset.domain) ? preset.domain : presetDomain,
                mode: (preset.mode) ? preset.mode : "rgb",
                padding: (preset.padding) ? preset.padding : 0.0,
                gamma: (preset.gamma) ? preset.gamma : 1.0,
                enableBezier: (preset.enableBezier) ? preset.enableBezier : false,
                enableDomain: (preset.enableDomain) ? preset.enableDomain : true,
                enablePadding: (preset.enablePadding) ? preset.enablePadding : true,
                enableGamma: (preset.enableGamma) ? preset.enableGamma : true,
                enableClasses: (preset.enableClasses) ? preset.enableClasses : false,
                classes: (preset.classes) ? preset.classes : 4,
                enableCustomClasses: false,
                customClasses: [0.0, 0.25, 0.5, 0.75, 1.0],
                enableSetRGB: ((preset.enableSetRGB)) ? [preset.enableSetRGB[0], preset.enableSetRGB[1], preset.enableSetRGB[2]] : null,
                enableSetHSL: ((preset.enableSetHSL)) ? [preset.enableSetHSL[0], preset.enableSetHSL[1], preset.enableSetHSL[2]] : null,
                enableSetCMYK: ((preset.enableSetCMYK)) ? [preset.enableSetCMYK[0], preset.enableSetCMYK[1], preset.enableSetCMYK[2]] : null,
                setrgb: ((preset.setrgb)) ? [preset.setrgb[0], preset.setrgb[1], preset.setrgb[2]] : null,
                sethsl: ((preset.sethsl)) ? [preset.sethsl[0], preset.sethsl[1], preset.sethsl[2]] : null,
                setcmyk: ((preset.setcmyk)) ? [preset.setcmyk[0], preset.setcmyk[1], preset.setcmyk[2]] : null,
                setDisableList: (preset.setDisableList) ? preset.setDisableList : [],
                enableMix: (preset.enableMix) ? preset.enableMix : false,
                enableBlend: (preset.enableBlend) ? preset.enableBlend : false,

                // こちらから設定用のプロパティ
                returnScaleColors: (preset.returnScaleColors != null) ? preset.returnScaleColors : -1,
                returnScaleOnly: (preset.returnScaleOnly != null) ? preset.returnScaleOnly : false,
            };

        }

        /**
         * 設定が反映されるモデル( 現在はobject自体をもらっているけど、materialのほうがいいのかな？ )
         * @type {Array}
         */
        var targets;
        if (_s.targetModels == null) {
            targets = scope.model;
        } else {
            targets = _s.targetModels;
        }


        if (_s.isFetchColor) {
            var fetchObject = {};
        }

        /**
         * chroma.jsのscaleがここに格納される
         * @type {Object} scale
         */
        var scale;
        // @todo 6色以上の場合にエラーが起きないか確認したい
        if (setting.enableBezier) {
            scale = chroma.bezier(setting.color).scale();
        } else {
            scale = chroma.scale(setting.color);
        }

        // @if dat.gui.jsで色管理している際に、modeごとの色の違いを表示するためのオプションが有効の場合のみ
        if (_s.isFetchColor) {

            // @if bezierは色が6色以上だとエラーが起きるので分岐
            if (setting.color.length < 6) {
                fetchObject.bezier = chroma.bezier(setting.color).scale();
            }
            fetchObject.rgb = chroma.scale(setting.color).mode("rgb");
            fetchObject.hsl = chroma.scale(setting.color).mode("hsl");
            fetchObject.lch = chroma.scale(setting.color).mode("lch");
            fetchObject.lab = chroma.scale(setting.color).mode("lab");

            return fetchObject;

        }

        // 順番を変えてもあまり変化はなかった
        // モード設定
        if (setting.mode) {
            scale.mode(setting.mode);
        }
        // パディング設定
        if (setting.padding && setting.enablePadding) {
            scale.padding(setting.padding);
        }
        // ガンマ設定
        if (setting.gamma && setting.enableGamma) {
            scale.gamma(setting.gamma);
        }
        // ドメイン設定
        if (setting.domain && setting.enableDomain) {
            scale.domain(setting.domain);
        }
        // クラス設定
        if (setting.enableClasses) {
            // @if カスタムクラスがある場合は優先して使用する
            if (setting.customClasses != null && setting.enableCustomClasses) {
                scale.classes(setting.customClasses);
            } else if (setting.classes != null && setting.enableClasses) {
                scale.classes(setting.classes);
            }

        }

        // @if scaleのみ返す設定の場合はここで終了する
        if (_s.returnScaleOnly) {
            return scale;
        }

        // @if scaleからcolorsで返してほしい場合の処理
        if (_s.returnScaleColors > 0 && _s.returnScaleColors != null) {
            return scale.colors(_s.returnScaleColors);
        }

        /**
         * createColorFromScale関数用のオプション
         * @type {Object}
         */
        var options = {
            targets: targets,
            setting: setting,
            scale: scale,
        };

        // スケールから色を生成する関数
        scope.createColorFromScale(options);

    }

    /**
     * chroma.jsのscaleから色調の補正をしたうえでカラーを返す
     * @return {Array}
     * @see chroma.js https://gka.github.io/chroma.js/
     *
     * 引数 _s についての詳細説明です
     * @type {Object}
     * @param {Array} targets 対象となるモデルがここに格納されます。
     * @param {Object} setting 設定がここに格納されます
     *
     */
    createColorFromScale(_s) {

        var scope = this;

        if (_s == null) _s = {};

        /**
         * 対象となるモデルのマテリアルが格納される
         * @type {Array} materials
         */
        var materials = [];

        /**
         * 対象となるモデルが格納される
         * @type {Array} meshes
         */
        var meshes = [];

        // @desc 引数として渡されたモデル( or Scene or Group )から中のmeshのmaterialのみを配列に入れる
        _s.targets.traverse(function(object) {
            if (object.isMesh) {
                materials.push(object.material);
                meshes.push(object);
            }
        });

        /**
         * 設定値
         * @type {Object}
         */
        var setting = _s.setting;

        /**
         * グラデーションスケール
         * @type {Object}
         */
        var scale = _s.scale;

        var resultColors = [];

        for (var i = 0, l = materials.length; i < l; i++) {

            var rand = scope.random("simple");
            var col = scale(rand);

            if (setting) {

                // @todo ここの色変化は順番によってだいぶ変わってしまうので、どうにかしたい(レイヤー順序的な)

                // @desc rgb
                if (setting.setrgb && setting.setDisableList.indexOf("rgb") === -1) {
                    if (setting.setrgb[0] != null && setting.enableSetRGB[0] === true) {
                        col = col.set("rgb.r", setting.setrgb[0]);
                    }
                    if (setting.setrgb[1] != null && setting.enableSetRGB[1] === true) {
                        col = col.set("rgb.g", setting.setrgb[1]);
                    }
                    if (setting.setrgb[2] != null && setting.enableSetRGB[2] === true) {
                        col = col.set("rgb.b", setting.setrgb[2]);
                    }
                }

                // @desc cmyk
                if (setting.setcmyk && setting.setDisableList.indexOf("cmyk") === -1) {
                    if (setting.setcmyk[0] != null && setting.enableSetCMYK[0] === true) {
                        col = col.set("cmyk.c", setting.setcmyk[0]);
                    }
                    if (setting.setcmyk[1] != null && setting.enableSetCMYK[1] === true) {
                        col = col.set("cmyk.m", setting.setcmyk[1]);
                    }
                    if (setting.setcmyk[2] != null && setting.enableSetCMYK[2] === true) {
                        col = col.set("cmyk.y", setting.setcmyk[2]);
                    }
                    if (setting.setcmyk[3] != null && setting.enableSetCMYK[3] === true) {
                        col = col.set("cmyk.k", setting.setcmyk[3]);
                    }
                }



                // @desc hsl
                if (setting.sethsl && setting.setDisableList.indexOf("hsl") === -1) {
                    if (setting.sethsl[0] != null && setting.enableSetHSL[0] === true) {
                        col = col.set("hsl.h", setting.sethsl[0]);
                    }
                    if (setting.sethsl[1] != null && setting.enableSetHSL[1] === true) {

                        // @desc 彩度の値がマイナスになると、色がおかしくなるため 引き算 のときのみ 補正を行う
                        if (typeof setting.sethsl[1] != "number") {

                            if (setting.sethsl[1].slice(0, 1) === "-") {

                                if (col.get("hsl.s") - Number(setting.sethsl[1].slice(1, setting.sethsl[1].length)) < 0) {
                                    col = col.set("hsl.s", 0);
                                } else {
                                    col = col.set("hsl.s", setting.sethsl[1]);
                                }

                            } else {
                                col = col.set("hsl.s", setting.sethsl[1]);
                            }

                        } else {

                            col = col.set("hsl.s", setting.sethsl[1]);

                        }

                    }
                    if (setting.sethsl[2] != null && setting.enableSetHSL[2] === true) {
                        col = col.set("hsl.l", setting.sethsl[2]);
                    }
                }

                // @desc mix
                if (setting.mix && setting.enableMix) {
                    if (setting.mix[0] == null) {
                        // なにもしない
                    } else {

                        if (setting.mix[1] == null) {
                            setting.mix[1] = 0.5
                        };
                        if (setting.mix[2] == null) {
                            setting.mix[2] = "rgb"
                        };

                        col = col.mix(setting.mix[0], setting.mix[1], setting.mix[2]);

                    }
                }

                // @desc blend
                if (setting.blend && setting.enableBlend) {
                    if (setting.blend[0] == null || setting.blend[1] == null) {
                        // なにもしない
                    } else {

                        col = chroma.blend(col.hex(), setting.blend[0], setting.blend[1]);

                    }
                }

            }

            /**
             * 最終結果のカラーをここに格納する
             * @type {Array}
             */
            // var resultColor = [col.get("rgb.r"), col.get("rgb.g"), col.get("rgb.b")];

            /**
             * 個々の色結果の格納object
             * @type {Object}
             * @todo コスト高いか?
             *
             */
            var resultColor = {
                rgb_r: col.get("rgb.r"),
                rgb_g: col.get("rgb.g"),
                rgb_b: col.get("rgb.b"),
                hsl_h: col.get("hsl.h"),
                hsl_s: col.get("hsl.s"),
                hsl_l: col.get("hsl.l"),
                gl_r: col.get("rgb.r") / 255,
                gl_g: col.get("rgb.g") / 255,
                gl_b: col.get("rgb.b") / 255,
            };

            resultColors.push(resultColor);

        }

        /**
         * createAnimation関数の設定オブジェクト
         * @type {Object}
         */
        var options = {
            type: "color",
            enabled: true,
            targets: meshes,
            // targets : scope.model,
            // isTraverse : true,
            colors: resultColors,
            sort: {
                enabled: false,
                type: "color",
                isBeforeShuffle: true,
                positionDirection: "x",
                positionDirectionReverse: false,
                reverse: false,
                colorOption: "hsl.h",
                random: 1,
            },
            animation: {
                type: "set",
                lib: "TweenMax",
                yoyo: true,
                repeat: 0,
                ease: Power0.easeNone,
                params: {
                    type: "number",
                    tweenType: "fromTo",
                    opacity: 1,
                    position: {
                        x: [{
                                random: {
                                    type: "random",
                                    min: 0.0,
                                    max: 1.0,
                                    recalculate: true,
                                    invert: false,
                                    minusMode: 0,
                                    base: 0,
                                    mag: 1,
                                },
                                increments: {
                                    enabled: false,
                                    type: "mag",
                                    magNum: 0.1,
                                }
                            },
                            {
                                random: {
                                    type: "random",
                                    min: 0.0,
                                    max: 1.0,
                                    recalculate: true,
                                    invert: false,
                                    minusMode: 0,
                                    base: 0,
                                    mag: 1,
                                },
                                increments: {
                                    enabled: false,
                                    type: "mag",
                                    magNum: 0.1,
                                }
                            },
                        ],
                        z: [{
                                random: {
                                    type: "random",
                                    min: 0.0,
                                    max: 1.0,
                                    recalculate: true,
                                    invert: false,
                                    minusMode: 0,
                                    base: 0,
                                    mag: 1,
                                },
                                increments: {
                                    enabled: false,
                                    type: "mag",
                                    magNum: 0.1,
                                }
                            },
                            {
                                random: {
                                    type: "random",
                                    min: 0.0,
                                    max: 1.0,
                                    recalculate: true,
                                    invert: false,
                                    minusMode: 0,
                                    base: 0,
                                    mag: 1,
                                },
                                increments: {
                                    enabled: false,
                                    type: "mag",
                                    magNum: 0.1,
                                }
                            },
                        ],
                    },
                },
                duration: {
                    type: "number",
                    param: 3,
                    random: {
                        type: "random",
                        min: 0.5,
                        max: 1.0,
                        recalculate: true,
                        invert: false,
                        // minusMode : ,
                        base: 0,
                        mag: 10,
                    },
                    increments: {
                        enabled: false,
                        type: "mag",
                        magNum: 1,
                    },
                },
                delay: {
                    type: "number",
                    param: 1,
                    random: {
                        type: "random",
                        min: 0.0,
                        max: 1.0,
                        recalculate: true,
                        invert: false,
                        // minusMode : ,
                        base: 0,
                        mag: 1,
                    },
                    increments: {
                        enabled: true,
                        type: "mag",
                        magNum: 0.1,
                    },
                },
            },
        };

        scope.createAnimation(options);

    }

    /**
     * モーションの再生を行う関数
     * @param {Object} _s
     * @return {void}
     * @see Animation_system https://threejs.org/docs/#manual/en/introduction/Animation-system
     * @see AnimationAction https://threejs.org/docs/#api/en/animation/AnimationAction
     * @see AnimationClip https://threejs.org/docs/#api/en/animation/AnimationClip
     * @see AnimationMixer https://threejs.org/docs/#api/en/animation/AnimationMixer
     * @see JSONでInfinityを扱うには https://qiita.com/butchi_y/items/b6d239a3176f49a99098
     * @todo mixerは複数あったほうがいい？ , delay play , isSheduleとisRunningで透過度決定とか？ , 名前でアニメーション決定したい
     * @todo jsonで保存することも考えて、THREE.LoopOnceなどでなく、実際の数字で表示したほうがいいかも？
     */
    createMotion() {

        let scope = this;

        /**
         * アニメーション管理オブジェクト
         * @type {THREE.AnimationMixer}
         */
        scope.mixer;

        /**
         * アニメーションがここに入ります
         * @type {Array}
         */
        scope.animations;

        /**
         * アニメーションのアクションがここに入ります
         * @type {Array}
         */
        scope.actions = [];

        /**
         * モーション関係の設定をここに格納
         * @type {Object}
         */
        let set = scope.s.model.motion;

        if (scope.s.model.loader === "fbx") {
            scope.animations = scope.fbx.animations;
        } else if (scope.s.model.loader === "gltf") {
            scope.animations = scope.gltf.animations;
        }

        scope.mixer = new THREE.AnimationMixer(scope.model);

        for (let i = 0, len = scope.animations.length; i < len; i++) {

            /**
             * 個々のアニメーションデータの本体
             * @type {THREE.AnimationAction}
             */
            let action = scope.mixer.clipAction(scope.animations[i]);
            action.loop = set.loop || THREE.LoopRepeat;
            action.clampWhenFinished = scope.isd(set.clampWhenFinished) ? set.clampWhenFinished : true;
            action.repetitions = scope.isd(set.repetitions) ? set.repetitions : Infinity;
            action.timeScale = scope.isd(set.timeScale) ? set.timeScale : 1;
            action.weight = scope.isd(set.weight) ? set.weight : 1;

            if (scope.isd(set.startAt)) {
                // #todo randomをいれたい
                action.startAt(set.startAt);
            }

            if (scope.isd(set.setDuration)) {
                action.setDuration(set.setDuration);
            }

            scope.actions.push(action);
            action.play();

        }

    }

    /**
     * get propertys or arrays with property or objects with property
     * @param  {Array|Object}  objects               対象となるオブジェクトや配列
     * @param  {Array}         [typeArray="Mesh"]    欲しいオブジェクトのtype (Three.js)
     * @param  {String}        [property]            プロパティ付きの配列で返してほしい場合は、ここに . で区切ったプロパティを記入
     * @param  {String}        [resultType="Array"]  結果として帰ってくるもののタイプを決定
     * @param  {Array}         [resultObjectKeyName] resultTypeでObjectを指定した場合にここでkeyの名前を決定できる
     * @return {Array|Object} RES
     * @example getPropsData( this.model , ["Mesh"] , "material.color.r" , "Object" , ["red","object"] );
     * @todo performance check , multi property , default argument's transpiled code is slightly large , h loop
     */
    getPropsData(objects = this.scene, typeArray = ["Mesh"], property, resultType = "Array", resultObjectKeyName, enableEmb) {

        /**
         * result array
         * @type {Array}
         */
        const RES = [];

        /**
         * object's type list searched by this function
         * @type {Array}
         */
        const KEY_ARRAY = ["Mesh", "Object3D", "Group", "Scene", "AmbientLight", "DirectionalLight", "HemisphereLight", "SpotLight", "PointLight"];

        if (this.getType(objects) === "array") {

            for (let h = 0, lenh = objects.length; h < lenh; h++) {

                for (let i = 0, len = KEY_ARRAY.length; i < len; i++) {

                    if (typeArray.indexOf(KEY_ARRAY[i]) === -1) continue;
                    if (objects[h].type !== KEY_ARRAY[i]) continue;

                    if (property) {

                        switch (resultType) {
                            case "Array":
                                RES.push(this.getPropData(objects[h], property));
                                break;
                            case "MultiDimensionalArray":
                                RES.push(this.getPropData(objects[h], property, resultType));
                                break;
                            case "Object":
                                RES.push(this.getPropData(objects[h], property, resultType, resultObjectKeyName));
                                break;
                        }

                    } else {
                        RES.push(objects[h]);
                    }

                    break;

                }

            }

        } else {

            objects.traverse(obj => {

                for (let i = 0, len = KEY_ARRAY.length; i < len; i++) {

                    if (typeArray.indexOf(KEY_ARRAY[i]) === -1) continue;
                    if (obj.type !== KEY_ARRAY[i]) continue;

                    if (property) {

                        switch (resultType) {
                            case "Array":
                                RES.push(this.getPropData(obj, property, "Normal", null, enableEmb));
                                break;
                            case "MultiDimensionalArray":
                                RES.push(this.getPropData(obj, property, resultType, null, enableEmb));
                                break;
                            case "Object":
                                RES.push(this.getPropData(obj, property, resultType, resultObjectKeyName, enableEmb));
                                break;
                        }

                    } else {
                        RES.push(obj);
                    }

                    break;

                }

            });

        }

        return RES;

    }

    /**
     * get property or array with property or object with property
     * @param  {Object}  object                                    対象となるオブジェクトや配列
     * @param  {String}  [property]                                プロパティ付きの配列で返してほしい場合は、ここに . で区切ったプロパティを記入
     * @param  {String}  [resultType="Normal"]                     結果として帰ってくるもののタイプを決定
     * @param  {Array}   [resultObjectKeyName=["prop", "object"]]  resultTypeでObjectを指定した場合にここでkeyの名前を決定できる
     * @example getPropData( this.model.children[0] , "position.x" , "Normal" , ["prop","object"])
     * @return {Array|Object|String}
     */
    getPropData(object, property, resultType = "Normal", resultObjectKeyName = ["prop", "object"], enableEmb = false) {

        let res;
        /**
         * property splited by .
         * @type {Array}
         */
        const SPLIT_PROPS = property.split(".");

        /**
         * object copy for key property
         * @type {*}
         */
        let propData = object;
        for (let i = 0, l = SPLIT_PROPS.length; i < l; i++) {
            propData = propData[SPLIT_PROPS[i]];
        }

        switch (resultType) {
            case "Normal":
                res = propData;
                break;
            case "MultiDimensionalArray":
                res = [propData, object];
                break;
            case "Object":
                /**
                 * result object
                 * @type {Object}
                 */
                const RES_ITEM_OBJECT = {};
                RES_ITEM_OBJECT[resultObjectKeyName[0]] = propData;
                RES_ITEM_OBJECT[resultObjectKeyName[1]] = object;
                res = RES_ITEM_OBJECT;
                break;
        }

        // todo  more efficient
        // todo  recreate outer function
        if (enableEmb) {

            // 必要ないかも
            this.createNI(object);

            for (let i = 0, len = SPLIT_PROPS.length; i < len; i++) {

                if (i === (len - 1)) {
                    if (i === 0) {
                        object._nic[SPLIT_PROPS[0]] = object[SPLIT_PROPS[0]];
                    }
                    if (i === 1) {
                        object._nic[SPLIT_PROPS[0]][SPLIT_PROPS[1]] = object[SPLIT_PROPS[0]][SPLIT_PROPS[1]];
                    }
                    if (i === 2) {
                        object._nic[SPLIT_PROPS[0]][SPLIT_PROPS[1]][SPLIT_PROPS[2]] = object[SPLIT_PROPS[0]][SPLIT_PROPS[1]][SPLIT_PROPS[2]];
                    }
                    if (i === 3) {
                        object._nic[SPLIT_PROPS[0]][SPLIT_PROPS[1]][SPLIT_PROPS[2]][SPLIT_PROPS[3]] = object[SPLIT_PROPS[0]][SPLIT_PROPS[1]][SPLIT_PROPS[2]][SPLIT_PROPS[3]];
                    }

                    break;
                }

                if (i === 0) {
                    object._nic[SPLIT_PROPS[0]] = (this.getType(object[SPLIT_PROPS[0]]) === "object") ? {} : [];
                }
                if (i === 1) {
                    object._nic[SPLIT_PROPS[0]][SPLIT_PROPS[1]] = (this.getType(object[SPLIT_PROPS[0]][SPLIT_PROPS[1]]) === "object") ? {} : [];
                }
                if (i === 2) {
                    object._nic[SPLIT_PROPS[0]][SPLIT_PROPS[1]][SPLIT_PROPS[2]] = (this.getType(object[SPLIT_PROPS[0]][SPLIT_PROPS[1]][SPLIT_PROPS[2]]) === "object") ? {} : [];
                }
                if (i === 3) {
                    object._nic[SPLIT_PROPS[0]][SPLIT_PROPS[1]][SPLIT_PROPS[2]][SPLIT_PROPS[3]] = (this.getType(object[SPLIT_PROPS[0]][SPLIT_PROPS[1]][SPLIT_PROPS[2]][SPLIT_PROPS[3]]) === "object") ? {} : [];
                }

            }

        }

        return res;

    }

    /**
     * initialize _ni , _nia , _nib and _nic data if there are undefined or null
     * _ni : static data
     * _nia : after data
     * _nic : current data
     * _nib : before data
     * @param  {Object} object
     * @return {void}
     */
    createNI(object) {

        if (object._ni == null) object._ni = {};
        if (object._nia == null) object._nia = [];
        if (object._nib == null) object._nib = [];
        if (object._nic == null) object._nic = {};

    }

    /**
     * traverse Objects to execute createNI function
     * @param  {Object} objects
     * @return {void}
     */
    createTraverseNI(objects) {

        objects.traverse(obj => {
            this.createNI(obj);
        });

    }

    /**
     * 分割
     * @param  {[type]} _s [description]
     *
     * _sについての詳細
     * @param {Object} _s.objects
     * @param {Array} _s.type
     * @param {number|String} _s.num
     *
     * @return {[type]}    [description]
     */
    getDividedObjects(inputObjs, type, num) {

        let objects = this.getPropsData(this.scene, type, "material.color", "Object", ["prop", "object"], true);
        // let objects = this.getPropsData( this.model );
        console.log(objects);
        const OBJS_LENGTH = objects.length;
        const CALCNUM = this.getCalcStrNum(num);


    }

    /**
     * 複数のオブジェクトから一部を取り出したり、分割させたりする関数
     * @return {Array}
     *
     *
     * _sについての詳細
     * @param {Object} objects
     * @param {Object} position ( x , y , z ) それぞれ配列で[最小,最大]という並び
     * @param {Object} rotation ( x , y , z ) それぞれ配列で[最小,最大]という並び
     * @param {Object} scale ( x , y , z ) それぞれ配列で[最小,最大]という並び
     * @param {Object} morph ( 0 , 1 , 2 , 3 , 4 , 5 , 6 , 7 ) それぞれ配列で[最小,最大]という並び
     * @param {Object} name (Stringとregexpでの検索が可能)
     * @param {Object} normal
     * @param {bool} isShuffle
     *
     * @todo distance
     */
    getObjects(_s) {

        let scope = this;

        /**
         * 引数に渡された大本のオブジェクトが入る
         * @type {Object}
         */
        let root;

        let rootObjects;
        let resObjects;
        if (scope.isd(_s.objects)) {
            root = _s.objects;
        } else {
            root = scope.model;
        }
        rootObjects = [];

        rootObjects = scope.getTraversedArray(root, ["Mesh"]);

        if (rootObjects.length == 0) return;

        resObjects = rootObjects;

        let propsArray = ["position", "rotation", "scale", "morph"];

        for (let h = 0, lenh = propsArray.length; h < lenh; h++) {

            if (scope.isd(_s[propsArray[h]])) {

                if (scope.getType(_s[propsArray[h]]) === "object") {

                    Object.keys(_s[propsArray[h]]).forEach(function(eVal) {

                        resObjects = resObjects.filter(function(fVal) {

                            if (scope.getType(_s[propsArray[h]][eVal]) == "array") {

                                let upFlag = false;
                                let downFlag = false;

                                for (let i = 0, len = _s[propsArray[h]][eVal].length; i < len; i++) {

                                    // #hint 配列の中身が空やnullやundefinedであればtrueを返す
                                    // #todo regexpのtestとどっちがはやい?
                                    if (["undefined", "null"].includes(scope.getType(_s[propsArray[h]][eVal][i]))) {
                                        (i === 0) ? upFlag = true: downFlag = true;
                                    } else {

                                        if (propsArray[h] === "rotation") {

                                            if (i === 0) {
                                                upFlag = (fVal[propsArray[h]][eVal] >= THREE.Math.degToRad(_s[propsArray[h]][eVal][0])) ? true : false;
                                            } else if (i === 1) {
                                                downFlag = (fVal[propsArray[h]][eVal] <= THREE.Math.degToRad(_s[propsArray[h]][eVal][1])) ? true : false;
                                            }

                                        } else if (propsArray[h] === "morph") {

                                            // #todo 実際に確認

                                            if (i === 0) {
                                                upFlag = (fVal.morphTargetInfluences[eVal] >= _s[propsArray[h]][eVal][0]) ? true : false;
                                            } else if (i === 1) {
                                                downFlag = (fVal.morphTargetInfluences[eVal] <= _s[propsArray[h]][eVal][1]) ? true : false;
                                            }

                                        } else {

                                            if (i === 0) {
                                                upFlag = (fVal[propsArray[h]][eVal] >= _s[propsArray[h]][eVal][0]) ? true : false;
                                            } else if (i === 1) {
                                                downFlag = (fVal[propsArray[h]][eVal] <= _s[propsArray[h]][eVal][1]) ? true : false;
                                            }

                                        }
                                    }
                                }

                                return (upFlag === true && downFlag === true) ? true : false;

                            } else {

                                console.error("getObjects");

                            }


                        });

                        // #temp
                        console.log(resObjects);

                    });

                } else {
                    console.error("getObjects");
                }
            } // position block end

        }


        if (scope.isd(_s.name)) {

            let tempObjectsArray = [];

            for (let i = 0, len = _s.name.length; i < len; i++) {

                tempObjectsArray[i] = resObjects;

                tempObjectsArray[i] = resObjects.filter(function(fVal) {

                    if (["string", "number"].includes(scope.getType(_s.name[i]))) {

                        return (fVal.name.indexOf(_s.name[i]) > -1) ? true : false;

                    } else if (scope.getType(_s.name[i] === "regexp")) {

                        return (_s.name[i].test(fVal.name));

                    }

                });

            }

            let concatArray = [];
            if (tempObjectsArray.length === 1) {

                concatArray = tempObjectsArray[0];

            } else {

                for (let i = 0, len = tempObjectsArray.length; i < len; i++) {

                    Array.prototype.push.apply(concatArray, tempObjectsArray[i]);

                }

                // #hint _s.nameTypeの初期化、デフォルト値の設定
                if (scope.isu(_s.nameType)) _s.nameType = "add";

                if (_s.nameType === "add") {
                    concatArray = scope.manageArrayDuplication(concatArray, "WithoutDuplication");
                } else if (_s.nameType === "sub") {
                    concatArray = scope.manageArrayDuplication(concatArray, "Remove");
                }

            }

            resObjects = concatArray;

            // #temp
            console.log(resObjects);

        } // name block end

        if (scope.isd(_s.color)) {

            if (scope.ist(_s.color.enableGet) || scope.getType(_s.color.enableGet) === "undefined") {

                Object.keys(_s.color.get).forEach(function(gVal) {

                    Object.keys(_s.color.get[gVal]).forEach(function(cVal) {

                        resObjects = resObjects.filter(function(fVal) {

                            let matColor = fVal.material.color;
                            let color = chroma(matColor.r, matColor.g, matColor.b, "gl");
                            let upFlag = false;
                            let downFlag = false;

                            for (let i = 0, len = _s.color.get[gVal][cVal].length; i < len; i++) {

                                if (["undefined", "null"].includes(scope.getType(_s.color.get[gVal][cVal][i]))) {
                                    (i === 0) ? upFlag = true: downFlag = true;
                                } else {

                                    if (i === 0) {
                                        upFlag = (color.get(`${gVal}.${cVal}`) >= _s.color.get[gVal][cVal][0]) ? true : false;
                                    } else if (i === 1) {
                                        downFlag = (color.get(`${gVal}.${cVal}`) <= _s.color.get[gVal][cVal][1]) ? true : false;
                                    }

                                }

                            }

                            return (upFlag === true && downFlag === true);

                        });

                        // #temp
                        console.log(resObjects);


                    });

                });


            }

            // #todo distanceはまだです
            if (scope.ist(_s.color.enableDistance) || scope.getType(_s.color.enableDistance) == "undefined") {



            }

        }

        // (2次元or3次元)の距離とかもいいかも

        if (scope.isd(_s.normal)) {

            resObjects = scope.getArray(resObjects, {
                num: _s.normal.num,
                isShuffle: _s.normal.isShuffle,
                offset: _s.normal.offset,
            });

        }

        if (scope.ist(_s.isShuffle)) {

            resObjects = scope.getShuffledArray(resObjects);

        }


    }

    /**
     * まとまったアニメーションを作成する
     * @return {void}
     */
    createAnimations(options) {

        let scope = this;
        let animSet;
        if (scope.isd(options)) {
            animSet = options;
        } else {
            animSet = scope.s.animation;
        }

        for (let i = 0, len = animSet.length; i < len; i++) {
            scope.createAnimation(animSet[i]);
        }

        // this.getDividedObjects( scope.model , ["Mesh"] , "30%" );
        this.getDividedObjects(scope.model, ["Mesh"], "30%");

    }


    /**
     * アニメーションを作成する
     * @return {[type]} [description]
     *
     * _sの詳細情報
     * @type {Object} _s
     * @param {Object} targets 対象となるモデル
     * @param {String} type アニメーションの対象となるプロパティ ( color , position , rotation , scale , opacity )
     * @param {Array} resultColors 生成されたカラーの配列
     *
     * _s.sort設定  getCompareValueの設定値をここで宣言
     * @type {Object}
     * @prop {String} _s.sort.type ソートのタイプ position || rotation(未実装) || color || length || distance(未実装) || shuffle
     * @prop {String} _s.sort.PositionDirection typeがpositionの場合に方向でソートする場合はここで指定 x || y || z || xy || xz || yz
     * @prop {String} _s.sort.positionDirectionReverse positionDirectionで2文字の場合に方向を反転させる
     * @prop {String} _s.sort.colorOption ex) rgb.r   --  rgb,hsl,hsv,cmyk
     * @prop {bool} reverse ソートされる配列を反転する
     *
     * @see GreenSock_Ease_Visualizer https://greensock.com/ease-visualizer
     * @see GreenScok_doc https://greensock.com/docs
     *
     * @todo targetの設定がoptionからだと難しい , array操作系のやつを入れる , 共通で使用する設定を共有したい
     * @todo tween.jsも使用(tween関数としてラップしたい) , ターゲットのソートをもっと強化したい , アニメーションのプリセットが欲しい
     * @todo  アニメーション処理自体の外部化がしたい(外で設定したい) , optionを短くしたい , アニメーションを単一で動かす関数とすべて動かす関数の両方に分けたい(=iループを別関数にしたい)
     */
    createAnimation(_s) {

        let scope = this;
        let targets;

        // #desc enabledがfalseの場合はスキップさせる
        if (_s.enabled != null) {
            if (_s.enabled === false) {
                return;
            }
        }

        // #desc ターゲットオブジェクトの決定
        if (_s.isTraverse) {

            targets = [];

            _s.targets.traverse(function(object) {
                // #todo meshタイプのものしか対応してないのです
                if (object.isMesh) {
                    targets.push(object);
                }
            });

        } else if (_s.targets === "all") {

            targets = [];

            scope.model.traverse(function(object) {
                // @todo meshタイプのものしか対応してないのです
                if (object.isMesh) {
                    targets.push(object);
                }
            });

        } else {
            /**
             * アニメーションを行う対象をここに格納する
             * @type {Array}
             */
            targets = _s.targets;
        }

        // @desc THREE.Meshのプロパティにinfoを追加して、カラー情報などを格納させる
        for (let j = 0, l = targets.length; j < l; j++) {

            targets[j]._ni = {};
            // #todo コスパ悪い?(undefinedでなければ配列のアイテムごとにプロパティを上書きしてしまっているので...)
            // #todo 現在の色を基準にしてソートするための仕組みを入れてもいいかも
            if (!scope.isUndefined(_s.colors)) {
                if (Array.isArray(_s.colors)) {
                    targets[j]._ni.color = _s.colors[j];
                } else if (_s.colors) {
                    if (scope.isUndefined(targets[j]._ni.color)) {
                        targets[j]._ni.color = {};
                    }

                    // #todo chroma.js非依存にしたい
                    targets[j]._ni.color.gl_r = chroma(_s.colors).get("rgb.r") / 255;
                    targets[j]._ni.color.gl_g = chroma(_s.colors).get("rgb.g") / 255;
                    targets[j]._ni.color.gl_b = chroma(_s.colors).get("rgb.b") / 255;
                    targets[j]._ni.color.rgb_r = chroma(_s.colors).get("rgb.r");
                    targets[j]._ni.color.rgb_g = chroma(_s.colors).get("rgb.g");
                    targets[j]._ni.color.rgb_b = chroma(_s.colors).get("rgb.b");
                    targets[j]._ni.color.hsl_h = chroma(_s.colors).get("hsl.h");
                    targets[j]._ni.color.hsl_s = chroma(_s.colors).get("hsl.s");
                    targets[j]._ni.color.hsl_l = chroma(_s.colors).get("hsl.l");

                }
            } else if (!scope.isUndefined(targets[j].material.color)) {

                // #desc ソート機能がいつでも使えるようにする。ただ、処理が重くなってしまうかも?
                // #q ソート機能がcolorのときのみするべきか？

                if (scope.isUndefined(targets[j]._ni.color)) {
                    targets[j]._ni.color = {};
                }

                let gl = chroma(targets[j].material.color.r, targets[j].material.color.g, targets[j].material.color.b, "gl");
                targets[j]._ni.color.gl_r = targets[j].material.color.r;
                targets[j]._ni.color.gl_g = targets[j].material.color.g;
                targets[j]._ni.color.gl_b = targets[j].material.color.b;
                targets[j]._ni.color.rgb_r = gl.get("rgb.r");
                targets[j]._ni.color.rgb_g = gl.get("rgb.g");
                targets[j]._ni.color.rgb_b = gl.get("rgb.b");
                targets[j]._ni.color.hsl_h = gl.get("hsl.h");
                targets[j]._ni.color.hsl_s = gl.get("hsl.s");
                targets[j]._ni.color.hsl_l = gl.get("hsl.l");

            }

        }

        // @desc オブジェクトの補完( 判定に使ってるところもあるので慎重に... )
        if (scope.isUndefined(_s.sort)) _s.sort = {};
        if (scope.isUndefined(_s.sort.random)) _s.sort.random = {};
        if (scope.isUndefined(_s.animation)) _s.animation = {};


        // @if ソートを行うか
        if (_s.sort.enabled) {
            // @if ソートを行う前にシャッフルを行うか?
            if (_s.sort.isBeforeShuffle) {

                /**
                 * ソート前にシャッフルする場合のオプション
                 * @type {Object}
                 */
                let sortOption = {
                    enabled: true,
                    type: "shuffle",
                };
                targets = scope.getSortArray(targets, sortOption);
            }
            // #todo 初期パラメーターだけでなく、変更後のパラメーターやfromTo用のパラメーターからもソートができるとgood
            targets = scope.getSortArray(targets, _s.sort);
        }


        // @desc ここからtargets一つ一つへの処理
        for (let j = 0, l = targets.length; j < l; j++) {

            // @desc アニメーション用のランダムパラメーターの設定をここで行う
            if (_s.animation.type === "animation") {

                if (_s.animation.duration.type === "random") {

                    var duration = scope._returnRandom("duration", _s, j);

                } else if (_s.animation.duration.type === "number") {

                    var duration = _s.animation.duration.param;
                    let incrementsParams = _s.animation.duration.increments;
                    if (incrementsParams.enabled) {
                        if (incrementsParams.type === "add") {
                            duration = duration + j * incrementsParams.magNum;
                        } else if (incrementsParams.type === "mag") {
                            duration = duration * j * incrementsParams.magNum;
                        }
                    }

                } else {

                    console.error("createAnimation");
                    return;

                }

                if (_s.animation.delay.type === "random") {

                    var delay = scope._returnRandom("delay", _s, j);

                } else if (_s.animation.delay.type === "number") {

                    var delay = _s.animation.delay.param;
                    let incrementsParams = _s.animation.delay.increments;
                    if (incrementsParams.enabled) {
                        if (incrementsParams.type === "add") {
                            delay = delay + j * incrementsParams.magNum;
                        } else if (incrementsParams.type === "mag") {
                            delay = delay * j * incrementsParams.magNum;
                        }
                    }

                } else {

                    console.error("createAnimation");
                    return;

                }


                if (_s.animation.yoyo != null) {
                    var yoyo = _s.animation.yoyo;
                } else {
                    var yoyo = false;
                }

                if (_s.animation.repeat != null) {
                    var repeat = _s.animation.repeat;
                } else {
                    var repeat = 0;
                }

                if (_s.animation.repeatDelay != null) {
                    var repeatDelay = _s.animation.repeatDelay;
                } else {
                    var repeatDelay = 0;
                }

                if (!scope.isUndefined(_s.animation.ease)) {
                    // @todo tweenmax | tweenliteを読み込んでないとエラー吐くかも
                    var ease = _s.animation.ease;
                } else {
                    var ease = Power0.easeNone;
                }

            } // ここまでtypeがanimationのとき


            if (_s.animation.type == "animation") {

                /**
                 * TweenMaxが使用する第三引数のオブジェクトを前もって用意しておく。typeによって追加。
                 * @type {Object}
                 */
                var tweenOptions = {
                    delay,
                    yoyo,
                    repeat,
                    repeatDelay,
                    ease,
                };

                // #desc fromTo用のオブジェクト作成
                if (_s.animation.params.tweenType === "fromTo") {

                    /**
                     * TweenMaxのfromTo用のオブジェクト
                     * @type {Object}
                     */
                    var fromTweenOptions = {};
                }

                // #desc TweenMax|TweenLite用の設定
                if (_s.type === "color") {

                    var tweenTarget = targets[j].material.color;
                    // #todo 相対で色の変更ができたらいいかも( r + 10みたいな感じで )
                    tweenOptions.r = targets[j]._ni.color.gl_r;
                    tweenOptions.g = targets[j]._ni.color.gl_g;
                    tweenOptions.b = targets[j]._ni.color.gl_b;

                } else if (_s.type === "position" || _s.type === "rotation" || _s.type === "scale" || _s.type === "opacity" || _s.type === "morphTargetInfluences") {

                    // #hint tweenTarget 対象オブジェクトが入る TweenMax等でターゲットとして利用する
                    // #hint paramObject 設定オブジェクト側のanimation.param.???の場所を設定

                    if (_s.type === "position" || _s.type === "rotation" || _s.type === "scale" || _s.type === "morphTargetInfluences") {
                        var tweenTarget = targets[j][_s.type];
                        var paramObject = _s.animation.params[_s.type];
                    } else if (_s.type === "opacity") {

                        // #hint opacityのみ階層がひとつ少ないので別処理

                        var tweenTarget = targets[j].material;
                        var paramObject = _s.animation.params;
                    }

                    // #if tweenTypeがtoのとき
                    if (_s.animation.params.tweenType === "to" || _s.animation.params.tweenType == null) {

                        let props = ["x", "y", "z", "opacity", 0, 1, 2, 3, 4, 5, 6, 7];

                        for (let k = 0, l = props.length; k < l; k++) {

                            if (!scope.isUndefined(paramObject[props[k]])) {

                                if (paramObject[props[k]].type === "random") {
                                    if (_s.type === "opacity") {
                                        tweenOptions[props[k]] = scope._returnRandom(["params", _s.type], _s, j);
                                    } else {
                                        tweenOptions[props[k]] = scope._returnRandom(["params", _s.type, [props[k]]], _s, j);
                                    }
                                } else if (paramObject[props[k]].type === "number") {
                                    tweenOptions[props[k]] = paramObject[props[k]].number;
                                }

                            }

                        }

                    } else if (_s.animation.params.tweenType == "fromTo") {
                        // #if tweenTypeが fromToのとき

                        let props = ["x", "y", "z", "opacity", 0, 1, 2, 3, 4, 5, 6, 7];

                        for (let k = 0, l = props.length; k < l; k++) {

                            if (!scope.isUndefined(paramObject[props[k]])) {

                                if (paramObject[props[k]][1].type === "random") {
                                    if (_s.type === "opacity") {
                                        tweenOptions[props[k]] = scope._returnRandom(["params", _s.type, "1"], _s, j);
                                    } else {
                                        tweenOptions[props[k]] = scope._returnRandom(["params", _s.type, [props[k]], "1"], _s, j);
                                    }
                                } else if (paramObject[props[k]][1].type === "number") {
                                    tweenOptions[props[k]] = paramObject[props[k]][1].number;
                                }

                                if (paramObject[props[k]][0].type === "random") {
                                    if (_s.type === "opacity") {
                                        fromTweenOptions[props[k]] = scope._returnRandom(["params", _s.type, "0"], _s, j);
                                    } else {
                                        fromTweenOptions[props[k]] = scope._returnRandom(["params", _s.type, [props[k]], "0"], _s, j);
                                    }
                                } else if (paramObject[props[k]][0].type === "number") {
                                    fromTweenOptions[props[k]] = paramObject[props[k]][0].number;
                                }

                            }

                        }

                    }

                }

            } else if (_s.animation.type === "set") {
                // #todo 絶対の値のみなので相対でも設定できるようにしたい

                if (_s.type === "color") {

                    if (_s.animation.lib === "TweenMax" || scope.isUndefined(_s.animation.lib)) {
                        TweenMax.set(targets[j].material.color, {
                            r: targets[j]._ni.color.gl_r,
                            g: targets[j]._ni.color.gl_g,
                            b: targets[j]._ni.color.gl_b
                        })
                    } else if (_s.animation.lib === "TweenLite") {
                        TweenLite.set(targets[j].material.color, {
                            r: targets[j]._ni.color.gl_r,
                            g: targets[j]._ni.color.gl_g,
                            b: targets[j]._ni.color.gl_b
                        });
                    } else {
                        targets[j].material.color = new THREE.Color(targets[j]._ni.color.gl_r, targets[j]._ni.color.gl_g, targets[j]._ni.color.gl_b);
                    }

                } else if (_s.type === "position" || _s.type === "rotation" || _s.type === "scale" || _s.type === "opacity" || _s.type === "morphTargetInfluences") {

                    if (_s.type === "position" || _s.type === "rotation" || _s.type === "scale" || _s.type === "morphTargetInfluences") {
                        var setObject = _s.animation.params[_s.type];
                    } else if (_s.type === "opacity") {
                        var setObject = _s.animation.params;
                    }

                    let props = ["x", "y", "z", "opacity", 0, 1, 2, 3, 4, 5, 6, 7];

                    for (let k = 0, l = props.length; k < l; k++) {

                        if (setObject[props[k]] != null) {
                            if (setObject[props[k]].type === "random") {

                                // #if 相対でのパラメータの変更の場合
                                if (_s.animation.params[_s.type].enableRelative) {

                                    if (_s.animation.params[_s.type].relativeType === "+") {
                                        targets[j][_s.type][props[k]] += scope._returnRandom(["params", _s.type, [props[k]]], _s, j);
                                    } else if (_s.animation.params.position.relativeType === "*") {
                                        targets[j][_s.type][props[k]] *= scope._returnRandom(["params", _s.type, [props[k]]], _s, j);
                                    }

                                } else {
                                    // console.log(_s.type);
                                    targets[j][_s.type][props[k]] = scope._returnRandom(["params", _s.type, [props[k]]], _s, j);
                                }
                            } else if (setObject[props[k]].type === "number") {
                                targets[j][_s.type][props[k]] = setObject[props[k]].number;
                            }
                        }

                    }

                }


            }

            // #desc typeがanimationのときのみ、ここで設定
            if (_s.animation.type === "animation") {

                if (_s.animation.params.tweenType == null || _s.animation.params.tweenType === "to") {
                    if (_s.animation.lib === "TweenMax" || _s.animation.lib === undefined) {

                        TweenMax.to(
                            tweenTarget,
                            duration,
                            tweenOptions
                        );
                    } else if (_s.animation.lib === "TweenLite") {
                        TweenLite.to(
                            tweenTarget,
                            duration,
                            tweenOptions
                        );
                    } else if (_s.animation.lib === "tween.js") {
                        // #todo 作業
                    }
                } else if (_s.animation.params.tweenType === "fromTo") {
                    if (_s.animation.lib === "TweenMax") {
                        TweenMax.fromTo(
                            tweenTarget,
                            duration,
                            fromTweenOptions,
                            tweenOptions,
                        );
                    } else if (_s.animation.lib === "TweenLite") {
                        TweenLite.fromTo(
                            tweenTarget,
                            duration,
                            fromTweenOptions,
                            tweenOptions,
                        );
                    } else if (_s.animation.lib === "tween.js") {
                        // #todo 作業
                    }
                }

            }

        } // j loop end

    }

    /**
     * 内部で使用される関数 決められたプロパティのランダム値を生成する
     * @param  {[type]} paramName [description]
     * @return {[type]}           [description]
     */
    _returnRandom(paramName, _s, j) {

        var scope = this;

        let param;

        let randomOptions = {};

        if (scope.getType(paramName) === "array") {
            var randomParams = _s.animation;
            var incrementsParams = _s.animation;
            for (let i = 0, l = paramName.length; i < l; i++) {
                randomParams = randomParams[paramName[i]];
                incrementsParams = incrementsParams[paramName[i]];
                if (i === (l - 1)) {
                    randomParams = randomParams.random;
                    incrementsParams = incrementsParams.increments;
                }
            }
        } else {
            var randomParams = _s.animation[paramName].random;
            var incrementsParams = _s.animation[paramName].increments;
        }



        if (randomParams.min != null) randomOptions.min = randomParams.min;
        if (randomParams.max != null) randomOptions.max = randomParams.max;
        if (randomParams.recalculate != null) randomOptions.recalculate = randomParams.recalculate;
        if (randomParams.invert != null) randomOptions.invert = randomParams.invert;
        if (randomParams.minusMode != null) randomOptions.minusMode = randomParams.minusMode;

        param = scope.random(
            randomParams.type,
            randomOptions
        );

        if (randomParams.base != null) param += randomParams.base;
        if (randomParams.mag != null) param *= randomParams.mag;


        // #todo もっとincrementsを有効に活用したい( ステップとか、 )
        if (incrementsParams.enabled) {
            if (incrementsParams.type === "add") {
                param = param + j * incrementsParams.magNum;
            }
            if (incrementsParams.type === "mag") {
                param = param * j * incrementsParams.magNum;
            }
        }

        return param;

    }

    /**
     * モデルのポジションに合わせて配列を返す
     * カラーに関してはchroma.jsが必須
     * @param  {Array} array ソートする配列
     * @param {Object} options ソートの方法設定
     * @return {Array} resultArray ソートし終わった配列を返す
     *
     * options
     * getCompareValueの設定値をここで宣言
     * @type {Object}
     * @param {String} options.type  position || rotation(未実装) || color || length || distance(未実装)
     * @param {String} options.PositionDirection x || y || z
     * @param {String} options.colorOption ex) rgb.r   --  rgb,hsl,hsv,cmyk
     * @param {bool} options.reverse
     */
    getSortArray(array, options) {

        var scope = this;

        if (options == null) {
            console.error("getSortArray");
            return;
        }
        if (array == null) {
            console.error("getSortArray");
            return;
        }

        /**
         * ソート対象の配列
         * @type {Array}
         */
        var target = array;

        /**
         * ソートオプション
         * @type {Object}
         */
        var setting = options;

        // @if shuffleのときのみ別ルート
        if (setting.type === "shuffle") {

            for (var i = array.length - 1; i > 0; i--) {
                var r = Math.floor(Math.random() * (i + 1));
                var tmp = array[i];
                array[i] = array[r];
                array[r] = tmp;
            }

            var resultArray = array;

        } else {

            /**
             * getCompareValueから帰ってくるソートされた配列がここに格納される。sortでthisにoptionsを入れてるので結構イレギュラーなので注意。
             * @type {Array}
             */
            var resultArray = target.sort(scope.getCompareValue.bind(setting));

        }


        return resultArray;

    }

    /**
     * getPositionArrayのサポートをする関数
     * @param  {Object} a
     * @param  {Object} b
     * @return {number}
     */
    getCompareValue(a, b) {

        if (this.type === "position") {

            // @desc 一方向( x | y | z )
            if (this.positionDirection.length === 1) {

                var aParam = a.position[this.positionDirection];
                var bParam = b.position[this.positionDirection];

                // @desc 二方向( xy | yz | xz )
            } else if (this.positionDirection.length === 2) {

                var pd = this.positionDirection;

                if (this.positionDirectionReverse) {
                    var aParam = a.position[pd.charAt(0)] + (-a.position[pd.charAt(1)]);
                    var bParam = b.position[pd.charAt(0)] + (-b.position[pd.charAt(1)]);
                } else {
                    var aParam = a.position[pd.charAt(0)] + a.position[pd.charAt(1)];
                    var bParam = b.position[pd.charAt(0)] + b.position[pd.charAt(1)];
                }

            }

        } else if (this.type === "length") {

            var aParam = a.position.length();
            var bParam = b.position.length();

        } else if (this.type === "color") {

            //@todo colorsがない場合の対応もしたい

            // var aCol = a.material.color;
            // var bCol = b.material.color;
            //
            // var aChroma = chroma( aCol.r , aCol.g , aCol.b , "gl" );
            // var bChroma = chroma( bCol.r , bCol.g , bCol.b , "gl" );
            //
            // if( this.colorOption == "num" ){
            //     var aParam = aChroma.num();
            //     var bParam = bChroma.num();
            // }else{
            //     var aParam = aChroma.get( this.colorOption );
            //     var bParam = bChroma.get( this.colorOption );
            // }

            // 設定値のcolorOptionをmixData.colorのデータプロパティ名に変換
            var colorOption = this.colorOption.replace(".", "_");

            var aParam = a._ni.color[colorOption];
            var bParam = b._ni.color[colorOption];

        }



        /**
         * sort関数に対して返す数字をここに格納
         * @type {Number}
         */
        let comparison = 0;
        if (aParam > bParam) {
            comparison = 1;
        } else if (aParam < bParam) {
            comparison = -1;
        }

        // @if 反転するか
        if (this.reverse) {
            comparison = -(comparison);
        }

        return comparison;

    }

    /**
     * イベントのまとめ役の関数
     * @return {[type]} [description]
     */
    createEvent() {

        var scope = this;
        scope.eventFlag = false;

        // イベントタイプが show の場合
        if (scope.s.event.type === "show") {

            scope.scroll;

            // 初期値
            let showSetting = scope.s.event.show;
            if (scope.isu(showSetting.breakPoint)) showSetting.breakPoint = 0.3;
            if (scope.isu(showSetting.breakPointType)) showSetting.breakPointType = "ratio";
            if (scope.isu(showSetting.breakTarget)) showSetting.breakTarget = "window";

            scope.eventScroll.apply(scope);
            window.addEventListener("scroll", scope.eventScroll.bind(scope));

        }

        if (scope.s.event.type === "click") {

            if (scope.s.event.click.clickArea != null) {

                scope.s.event.click.clickArea.addEventListener("click", scope.eventClick.bind(scope));

            }

        }

        if (scope.s.event.type === "hover") {

            if (scope.s.event.hover.hoverArea != null) {

                scope.s.event.hover.hoverArea.addEventListener("mouseenter", scope.eventHover.bind(scope));

            }

        }

    }

    /**
     * スクロールイベント関係
     * @return {[type]} [description]
     */
    eventScroll() {

        var scope = this;

        /**
         * スクロールの値を取得
         * @type {float}
         * @deprecated スクロール値はNasikusa自体で持つようにしている + スクロール値を使ってない...
         */
        scope.scroll = window.pageYOffset || document.documentElement.scrollTop;

        /**
         * ウィンドウの高さを取得
         * @type {[type]}
         */
        scope.windowHeight = window.innerHeight;

        // rectの更新
        scope.canvasRect = scope.s.renderArea.getBoundingClientRect();

        /**
         * ウィンドウの一番下のところに来たかどうか。 == 0 で来ている。
         * @type {[type]}
         */
        var underLine = scope.canvasRect.top - scope.windowHeight;

        /**
         * underLineにどれくらい足すか（スクリーンからどれくらい見えるか）
         * @type {[type]}
         */
        var plusLine;

        if (scope.s.event.show.breakPointType === "pixel") {
            plusLine = scope.s.event.show.breakPoint;
        } else if (scope.s.event.show.breakPointType === "ratio") {
            if (scope.s.event.show.breakTarget === "window") {
                plusLine = scope.windowHeight * scope.s.event.show.breakPoint;
            } else if (scope.s.event.show.breakTarget === "canvas") {
                plusLine = scope.canvasRect.height * scope.s.event.show.breakPoint;
            }
        }

        if ((underLine + plusLine) < 0) {

            scope.onFireEvent();

        }

    }

    eventClick() {

        var scope = this;

        scope.onFireEvent();

    }

    eventHover() {

        var scope = this;

        scope.onFireEvent();

    }

    /**
     * イベントが発火した際の動作をここで記入します。
     * @return {void}
     */
    onFireEvent() {

        let scope = this;

        if (scope.eventFlag === false) {

            /**
             *
             *
             */
            scope.eventFlag = true;

            // @todo 外部関数などにしたい（分離したい）
            if (scope.s.model.motion.enabled) {
                scope.createMotion();
            }
            if (scope.s.model.randomColor.enabled && scope.s.model.randomColor.enabled !== null) {
                scope.colorChange();
            }
            // 設定のbeforerenderがfalseの場合は、ここでレンダリングを開始する
            if (!scope.s.event.beforeRender) {
                scope.renderLoop();
            }

            if (scope.ist(scope.s.enableAnimation)) {
                let options = scope.s.animation;
                scope.createAnimations(options);
            }

        }

    }






    //=====================================================
    //=====================================================
    //
    // これより下は ARJS の機能です
    //
    //=====================================================
    //=====================================================



    initAR() {

        var scope = this;

        scope.onRenderFcts = [];

        scope.camera = new THREE.Camera();
        scope.scene.add(scope.camera);

        /**
         *  ARレンダーループ内で使用
         */
        scope.lastTimeMsec = null;

        /**
         * arToolkitSource
         */
        scope.arToolkitSource = new THREEx.ArToolkitSource({
            sourceType: "webcam",
        });

        scope.arToolkitSource.init(function onReady() {
            console.log(scope.arToolkitSource);
            scope.onARResize();
        });

        window.addEventListener("resize", function() {
            scope.onARResize();
        });

        /**
         * arToolkitContext
         */
        scope.arToolkitContext = new THREEx.ArToolkitContext({
            cameraParametersUrl: "/assets/img/ar/camera_para.dat",
            // detectionMode: 'color',
            // detectionMode: 'mono_and_matrix',
            detectionMode: "mono",
            maxDetectionRate: 60,
            // canvasWidth: 160*3,
            // canvasHeight: 160*3,
        });

        scope.arToolkitContext.init(function onCompleted() {
            scope.camera.projectionMatrix.copy(scope.arToolkitContext.getProjectionMatrix());
        });


        scope.onRenderFcts.push(function() {
            if (scope.arToolkitSource.ready === false) return;
            scope.arToolkitContext.update(scope.arToolkitSource.domElement);
            scope.scene.visible = scope.camera.visible;
        });


        scope.markerRoot = new THREE.Group;
        scope.scene.add(scope.markerRoot);

        scope.artoolkitMarker = new THREEx.ArMarkerControls(scope.arToolkitContext, scope.camera, {
            type: "pattern",
            patternUrl: "/assets/img/ar/patt.hiro",
            changeMatrixMode: "cameraTransformMatrix"
        });

        scope.scene.visible = false;

        scope.smoothedRoot = new THREE.Group;
        scope.scene.add(scope.smoothedRoot);
        scope.smoothedControls = new THREEx.ArSmoothedControls(scope.smoothedRoot, {
            lerpPosition: 0.4,
            lerpQuaternion: 0.3,
            lerpScale: 1,
        });

        scope.arWorldRoot = scope.smoothedRoot;

        scope.onRenderFcts.push(function() {
            scope.renderer.render(scope.scene, scope.camera);
        });

        scope.lastTimeMsec = null;


    }

    onARResize() {

        var scope = this;

        scope.arToolkitSource.onResize();
        scope.arToolkitSource.copySizeTo(scope.renderer.domElement);
        if (scope.arToolkitContext.arController !== null) {
            scope.arToolkitSource.copySizeTo(scope.arToolkitContext.arController.canvas);
        }

    }


    /**
     * ARレンダリングを行う関数
     * @return {void}
     */
    renderARLoop() {

        var scope = this;


        scope.delta = scope.clock.getDelta();

        if (scope.camera != null && scope.controls != null && ["orbit", "deviceOrientation"].indexOf(scope.setting.controls.type) > -1 && scope.setting.controls.enabled) {
            scope.controls.update();
        }

        if (scope.setting.model.motion.enabled) {
            scope.mixer.update(scope.delta);
        }

        if (scope.setting.datgui.enabled && scope.guiOpt != null) {
            scope.__reflectRealTimeUpdateToGuiParam();
        }

        requestAnimationFrame(function animate(nowMsec) {
            requestAnimationFrame(animate);
            scope.lastTimeMsec = scope.lastTimeMsec || nowMsec - 1000 / 60;
            var deltaMsec = Math.min(200, nowMsec - scope.lastTimeMsec);
            scope.lastTimeMsec = nowMsec;
            // call each update function
            scope.onRenderFcts.forEach(function(onRenderFct) {
                onRenderFct(deltaMsec / 1000, nowMsec / 1000);
            });
        });

    }


} // end class
