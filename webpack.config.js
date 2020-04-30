const path = require("path");
module.exports = {
    watch : true,
    // mode : "development",
    mode : "production",
    entry : "./src/Nasi.js",
    output : {
        filename : "bundle.js",
        path : path.join(__dirname , "build")
    },
    // module : {
    //     rules : [{
    //         test : /\.js$/,
    //         use : "babel-loader",
    //         exclude : /node_modules/,
    //     }],
    // }
}
