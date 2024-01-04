const { merge } = require("webpack-merge");
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const [clientConfig, serverConfig] = require("./webpack.common");
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const TerserPlugin = require("terser-webpack-plugin");

module.exports = [
  merge(clientConfig, {
    mode: "production",
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin(),
      ],
    },
}),
  merge(serverConfig, {
    mode: "production",
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin(),
      ],
    },
  }),
];