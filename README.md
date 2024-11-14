<p align="center">
  <img src="./media/fhnx_cover.svg#gh-light-mode-only" type="image/svg+xml" width="75%"/>
</p>

<p align="center">
  The JavaScript SDK for Fhenix
</p>

<p align="center">
  <img alt="npm" src="https://img.shields.io/npm/v/fhenixjs" />
  <img alt="ci" style="margin-left: 0.3em" src="https://github.com/fhenixprotocol/fhenix.js/actions/workflows/test.yml/badge.svg?branch=main" />
</p>

<p align="center">
  <a href="https://fhenixjs.fhenix.zone" target="_blank"><strong>Explore the Docs »</strong></a>
</p>

## General

fhenix.js allows developers to add support for encrypted data when developing dApps on Fhenix.
fhenix.js includes easy helpers for encryption, unsealing and helpers to create apps that utilize private data.

## Installation

### NodeJS

(only node 20+ is supported until I fix this)

```bash
# Using npm
npm install fhenixjs
```

### Browser Installation (or simpler bundling)

For browsers or environments that don't want to mess with WASM bundling, we recommend installing the prepackaged versions directly
which is available in the ./dist/ folder in this repo.

You can also install from a CDN e.g.

`https://cdn.jsdelivr.net/npm/fhenixjs@0.3.0-alpha.1/dist/fhenix.umd.min.js`

#### ESM

You can install as a module:

```
<script type="module">
    import { fhenixjs } from "./dist/fhenix.esm.min.js";
</script>
```

#### UMD

Or from a UMD:

```
<script id="fhenixjs" src="./dist/fhenix.umd.min.js"></script>
```

#### NextJS WASM Bundling

FhenixJS uses WASM for all the FHE goodness. If you're using the non-prepackaged version you'll need to configure next.js to properly use WASM via the `next.config.js` file. 

Otherwise, you can use the prepackaged version above that avoids having to bundle WASM.

Here's a working config I managed to conjure up from various Github and StackOverflow issues (please suggest improvements):

```javascript
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
```

#### Other Bundlers/Frameworks

If you have any problems with bundlers or frameworks, please open an issue in this repo and/or reach out on Discord/TG.

Also, if you had to fiddle with a bundler or config to get it working, please share the config with us so we can add it as a reference for others!


#### Mobile Support

Completely untested. Maybe yes, maybe no, maybe both.

## Usage

```javascript
// initialize your web3 provider
const provider = new JsonRpcProvider("http://localhost:8545");

// initialize Fhenix Client
const client = new FhenixClient({ provider });

// to encrypt data for a Fhenix contract
let encrypted = await client.encrypt(5, EncryptionTypes.uint8);
// ... call contract with `encrypted`

// to unseal data from a Fhenix contract
const cleartext = client.unseal(contractAddress, sealed);
```

### Sync Fhenix Client

If you need to use the `encrypt_xxxx()` functions of FhenixClient synchronously (ex: top level of a component / in a hook), then you may want to use `FhenixClientSync`.

```javascript
// Created using a static method instead of the `new` keyword
const clientSync = await FhenixClientSync.create({ provider });

// to encrypt data for a Fhenix contract (sync)
let encrypted = clientSync.encrypt(5, EncryptionTypes.uint8);
// ... call contract with `encrypted`
```

`FhenixClientSync` and `FhenixClient` share all functionality other than the async/sync `encrypt_xxxx()` functions.

By default, `FhenixClientSync` is configured to only use the default security zone 0. If you need to interact with additional security zones, they can be initialized when creating the sync client as follows:

```javascript
const clientSync = await FhenixClientSync.create({
  provider,
  securityZones: [0, 1],
});
```

### Permits & Access Control

We recommend the helper `Permit` structure, which is a built-in method for providing access control for your FHE-enabled view functions.

#### Credits

This project is based on [fhevmjs](https://github.com/zama-ai/fhevmjs) by Zama and utilizes [tfhe.rs](https://github.com/zama-ai/tfhe-rs) to provide FHE functionality

#### Need support?

Open an issue or Pull Request on Github! Or reach out to us on [Discord](https://discord.com/invite/FuVgxrvJMY) or Telegram.
