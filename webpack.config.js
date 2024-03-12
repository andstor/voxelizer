const webpack = require("webpack");
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const path = require("path");
const mode = 'production';

const pkg = require('./package.json');
const date = (new Date()).toDateString();

const banner = `${pkg.name} v${pkg.version} ${date}
${pkg.homepage}

@author ${pkg.author.name} <${pkg.author.email}>
@copyright ${date.slice(-4)} ${pkg.author.name}
@license ${pkg.license}
@version ${pkg.version}
@build [hash]`;

let umdConfig = {
    mode: mode,
    devtool: 'source-map',
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, "lib"),
        filename: "voxelizer.js",
        globalObject: 'this',
        library: {
            name: 'Voxelizer',
            type: 'umd',
        },
    },
    module: {
      rules: [
          {
              test: /\.js$/,
              exclude: /(node_modules)/,
              use: {
                  loader: "babel-loader",
              }
          }
      ]
    },
    plugins: [
        new NodePolyfillPlugin(),
        new webpack.BannerPlugin({banner: banner}),
    ],
    externals: {
      three: 'THREE',
    }
};

module.exports = umdConfig;
