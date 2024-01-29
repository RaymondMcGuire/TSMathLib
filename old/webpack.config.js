/*
 * @Author: Xu.Wang 
 * @Date: 2020-03-27 20:18:12 
 * @Last Modified by: Xu.Wang
 * @Last Modified time: 2020-04-05 01:34:58
 */
module.exports = {
    mode: process.env.NODE_ENV || "development",
    entry: "./examples/src/tsmath.ts",
    output: {
        filename: "tsmath.js",
        path: __dirname + "/dist"
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"]
    },
    module: {
        rules: [{
            test: /\.ts?$/,
            use: [{
                    loader: "babel-loader"
                },
                {
                    loader: "ts-loader",
                    options: {
                        reportFiles: ['src/*.ts', 'ds/*.ts']
                    }
                }
            ],
            exclude: /node_modules/
        }]
    },
};