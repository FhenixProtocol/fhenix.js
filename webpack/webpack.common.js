const path = require("path");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const webpack = require("webpack");
const { merge } = require("webpack-merge");
const nodeExternals = require("webpack-node-externals");

let commonConfig = {
  entry: path.resolve(__dirname, "../", "src", "index.ts"),
  output: {
    path: path.resolve(__dirname, "../", "dist"),
    globalObject: "this",
    library: {
      name: "fhenixjs",
      type: "umd2",
    },
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  experiments: {
    asyncWebAssembly: true,
    topLevelAwait: true,
  },
};

let clientConfig = merge(commonConfig, {
  target: "web",
  module: {
    rules: [
      {
        test: /\.ts?$/,
        exclude: [/node_modules/],
        use: [{ loader: "ts-loader" }],
      },
      {
        test: /\.wasm$/,
        type: "asset/inline",
      },
    ],
  },
  resolve: {
    alias: {
      "node-tfhe": "tfhe/tfhe",
    },
    fallback: {
      "tfhe_bg.wasm": require.resolve("tfhe/tfhe_bg.wasm"),
      "node-tfhe": require.resolve("tfhe/tfhe"),
    },
  },
  output: {
    filename: "browser.js",
  },
  plugins: [new NodePolyfillPlugin()],
});

const ifdefLoaderOpts = {
  DEBUG: true,
  version: 3,
};

let serverConfig = merge(commonConfig, {
  target: "node",
  externalsPresets: { node: true },
  output: {
    filename: "index.node.js",
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        exclude: [/node_modules/],
        use: [
          { loader: "ts-loader" },
          { loader: "ifdef-loader", options: ifdefLoaderOpts },
        ],
      },
    ],
  },
  externals: [
    {
      "utf-8-validate": "commonjs utf-8-validate",
      bufferutil: "commonjs bufferutil",
      "node-tfhe": "commonjs node-tfhe",
    },
  ],
});

module.exports = [clientConfig, serverConfig];
