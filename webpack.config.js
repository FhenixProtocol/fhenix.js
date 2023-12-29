// const webpack = require("webpack");
const path = require("path");
// const PATHS = require("./paths.cjs");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
// const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");
// const webpack = require('webpack');

const web = {
  entry: path.resolve(__dirname, "src", "index.ts"),
  output: {
    //path: PATHS.build,
    path: path.resolve(__dirname, 'dist'),
    filename: "browser.js",
    globalObject: "this",
    library: {
      name: "fhenixjs",
      type: "umd2",
    },
    clean: true,
  },
  devtool: "source-map",
  experiments: {
    asyncWebAssembly: true,
    topLevelAwait: true,
  },

  mode: "production",
  module: {
    rules: [
      // Check for TypeScript files
      {
        test: /\.ts?$/,
        exclude: [/node_modules/],
        use: ["ts-loader"],
        generator: {
          filename: "[name][ext]",
        },
      },
      {
        test: /\.wasm$/,
        type: 'asset/inline',
      }
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    extensionAlias: {
      ".js": [".ts", ".tsx", ".js"],
      ".mjs": [".mts", ".mjs"],
    },
    alias: {
      "node-tfhe": "tfhe/tfhe",
    },
    fallback: {
      "tfhe_bg.wasm": require.resolve("tfhe/tfhe_bg.wasm"),
      "node-tfhe": require.resolve("tfhe/tfhe"),
      // buffer: require.resolve("buffer/"),
      // crypto: require.resolve("crypto-browserify"),
      // stream: require.resolve("stream-browserify"),
      // path: require.resolve("path-browserify"),
    },
  },
  plugins: [
    new NodePolyfillPlugin()
    // new HtmlWebpackPlugin(),
    // new WasmPackPlugin({
    //   crateDirectory: path.resolve(__dirname, ".")
    // }),
    // Have this example work in Edge which doesn't ship `TextEncoder` or
    // `TextDecoder` at this time.
    // new webpack.ProvidePlugin({
    //   TextDecoder: ['text-encoding', 'TextDecoder'],
    //   TextEncoder: ['text-encoding', 'TextEncoder']
    // })
],
};

module.exports = web;
