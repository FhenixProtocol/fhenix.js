/** @type {import('next').NextConfig} */

module.exports = {
  webpack: (config, { isServer }) => {

    patchWasmModuleImport(config, isServer);

    if (!isServer) {
      config.output.environment = { ...config.output.environment, asyncFunction: true };
    }
    return config
  }
}

function patchWasmModuleImport(config, isServer) {
  config.experiments = Object.assign(config.experiments || {}, {
    asyncWebAssembly: true,
    layers: true,
    topLevelAwait: true
  });

  config.optimization.moduleIds = 'named';

  config.module.rules.push({
    test: /\.wasm$/,
    type: 'asset/resource',
  });

  // TODO: improve this function -> track https://github.com/vercel/next.js/issues/25852
  if (isServer) {
    config.output.webassemblyModuleFilename = './../static/wasm/tfhe_bg.wasm';
  } else {
    config.output.webassemblyModuleFilename = 'static/wasm/tfhe_bg.wasm';
  }
}
