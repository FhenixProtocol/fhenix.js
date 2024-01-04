const { merge } = require("webpack-merge");
const [clientConfig, serverConfig] = require("./webpack.common");
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = [merge(clientConfig, {
  mode: "development",
  devtool: "inline-source-map",
}),
  merge(serverConfig, {
    mode: "development",
    devtool: "inline-source-map",
  }),
];