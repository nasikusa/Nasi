/**
 * コンストラクターとして使われているものの名前をここに記入
 * @type {Array}
 */
const keywords = ["precision", "alpha", "premultipliedAlpha", "antialias", "stencil", "preserveDrawingBuffer", "depth", "logarithmicDepthBuffer"];



/**
 * 準備したパラメータをつけてインスタンス化させるメソッド
 * @param {Object} obj     コンストラクタやプロパティやメソッドを混ぜて格納したオブジェクト
 * @param {Array} keywords コンストラクタのキーワード
 * @param {String} instance this[xxx]のインスタンスとなるオブジェクト
 * @param {String} root     THREE[xxx]の親となるオブジェクト
 * @todo thisだけでなく、普通に返り値としてインスタンスを返す形もやりたい , lightなど複数のものだとthis指定が厳しい?
 */
function createInstance( obj , keywords , instance , root ){

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

    let result = new THREE[root](opt);

    for (let i = 0, len = keys.length; i < len; i++) {

        /**
         * 対象のプロパティorメソッドの型を取得する
         * @type {String}
         */
        const type = Nasi.getType(result[keys[i]]);

        if (type === "function") {

            /**
             * 引数として入る値の型を取得する
             * @type {String}
             */
            const argType = Nasi.getType(obj[keys[i]]);

            if (argType === "array") {
                result[keys[i]].apply(this, obj[keys[i]]);
            } else {
                result[keys[i]](obj[keys[i]]);
            }

        } else if( type === "object" ){

            // empty
            const objectKeys = Object.keys(result[keys[i]]);
            for( let j = 0 , len2 = objectKeys.length ; j < len2 ; j++ ){
                result[keys[i]][objectKeys[j]] = obj[keys[i]][objectKeys[j]];
            }

        } else if (type != null) {
            result[keys[i]] = obj[keys[i]];
        }
    }
}


export {createInstance};
