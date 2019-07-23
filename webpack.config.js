module.exports = {
    mode: process.env.NODE_ENV || "development",
    entry: "./egmath.ts",
    output: {
        filename: "egmath.js",
        path: __dirname + "/dist"
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"]
    },
    module: {
        rules: [{
            test: /\.ts?$/,
            use: [
                { loader: "babel-loader" },
                {
                    loader: "ts-loader",
                    options: { reportFiles: ['lib/*.ts', 'ds/*.ts'] }
                }
            ],
            exclude: /node_modules/
        }]
    },
};