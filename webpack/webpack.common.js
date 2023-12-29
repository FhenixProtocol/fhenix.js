const path = require("path");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = {
  entry: path.resolve(__dirname, "../","src", "index.ts"),
  output: {
    path: path.resolve(__dirname, '../', 'dist'),
    filename: "browser.js",
    globalObject: "this",
    library: {
      name: "fhenixjs",
      type: "umd2",
    },
    clean: true,
  },
  experiments: {
    asyncWebAssembly: true,
    topLevelAwait: true,
  },
  module: {
    rules: [
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
    alias: {
      "node-tfhe": "tfhe/tfhe",
    },
    fallback: {
      "tfhe_bg.wasm": require.resolve("tfhe/tfhe_bg.wasm"),
      "node-tfhe": require.resolve("tfhe/tfhe"),
    },
  },
  plugins: [
    new NodePolyfillPlugin()
  ],
};
