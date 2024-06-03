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
  optimization: {
    mangleWasmImports: true,
  }
};

const ifdefLoaderOptsClient = {
  DEBUG: false,
  version: 3,
};

let clientConfig = merge(commonConfig, {
  target: "web",
  module: {
    rules: [
      {
        test: /\.ts?$/,
        exclude: [/node_modules/],
        use: [
          { loader: "ts-loader" },
          { loader: "ifdef-loader", options: ifdefLoaderOptsClient },
        ],
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

const ifdefLoaderOptsServer = {
  DEBUG: true,
  version: 3,
};

let serverConfig = merge(commonConfig, {
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
          { loader: "ifdef-loader", options: ifdefLoaderOptsServer },
        ]
      },
      {
        test: /\.wasm$/,
        type: "asset/inline",
      }
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
  // externals: [nodeExternals({
  //   // this WILL include `jquery` and `webpack/hot/dev-server` in the bundle, as well as `lodash/*`
  //   allowlist: ['node-tfhe', "tfhe", "*.wasm"]
  // })],
});

module.exports = [clientConfig, serverConfig];
