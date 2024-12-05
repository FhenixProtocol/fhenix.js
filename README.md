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

## fhenix.js sdk

`fhenixsdk` is designed to make interacting with FHE enabled blockchains typesafe and as streamlined as possible by providing utility functions for inputs, permits (permissions), and outputs. The sdk is an opinionated implementation of the underling `PermitV2` class, therefor if the sdk is too limiting for your use case (e.g. multiple active users), you can easily drop down into the core `PermitV2` class to extend its functionality.

NOTE: `fhenixsdk` is still in beta, and while we will try to avoid it, we may release breaking changes in the future if necessary.

The sdk can be imported by:
```typescript
import { fhenixsdk } from "fhenix.js"
```

Before interacting with your users' permits, you must first initialize the sdk:
```typescript
await fhenixsdk.initialize({
  provider: userProvider,   // Implementation of AbstractAccount in `types.ts`
  signer: userSigner,       // Implementation of AbstractSigner in `types.ts`
  projects: [...],          // List of projects that your user's permits must allow access to, eg "FHERC20" to read token balances.
  contracts: [...]          // List of contract addresses that your user's permits must allow access to.
})
```

NOTE: When the user changes, it is recommended to re-initialize the sdk with the updated `provider` and `signer`


then, to create a new Permit, simply:
```typescript
await fhenixsdk.createPermit({
  type: "self",
  issuer: userAddress,
  projects: ["FHERC20"]
})

// Alternatively, you can create a permit with the default options:
// type: "self"
// issuer: address of signer passed into `fhenixsdk.initialize`
// projects: list of projects passed into `fhenixsdk.initialize`
// contracts: list of contracts passed into `fhenixsdk.initialize`
await fhenixsdk.createPermit()
```

### Permissions
Now that the user has an active permit, we can extract the relevant `Permission` data from that permit:
```typescript
const permit = fhenixsdk.getPermit()
const permission = permit.getPermission()
```

which can then be used as an argument for a solidity function:
```solidity
function getCounterPermitSealed(
  PermissionV2 memory permission
) public view withPermission(permission) returns (SealedUint memory) {
  return FHE.sealoutputTyped(userCounter[permission.issuer], permission.sealingKey);
}
```
NOTE: We will return to this `SealedUint` output struct in the "Output data" section below.

You can read more about how Permits enable Fhenix to privately fetch encrypted data from on-chain by taking a look at our [docs](https://docs.fhenix.zone/docs/devdocs/FhenixJS/Permits) or the [`PermissionedV2.sol` contract](https://github.com/FhenixProtocol/fhenix-contracts/blob/main/contracts/access/PermissionedV2.sol).


### Input data
Passing data to the contracts involves an additional step where the user's encryptable variables are encrypted. FHE enabled contracts require private data to be passed in as `EncryptedUintXX` (or the other variants), which requires pre-encryption using the FHE enabled network's publicKey. 

For a solidity function:
```solidity
function add(inEuint32 calldata encryptedValue) public {
  euint32 value = FHE.asEuint32(encryptedValue);
  userCounter[msg.sender] = userCounter[msg.sender] + value;
}
```

We need to pass an encrypted value into `inEuint32`. Using `fhenixsdk` this is accomplished by:
```typescript
const encryptableValue = Encryptable.uint32(5);
const encryptedArgs = client.encrypt(encryptableValue)
//    ^? encryptedArgs - [EncryptedUint32]
```

These args can now be sent to the contract. `.encrypt` will also replace `"permission"` with the user's currently active permit `permission` referenced above. It will also recursively encrypt any nested input data (`[...]` / `{...}`):
```typescript
const encrypted = client.encrypt(
  "permission", // <== Will be replaced by the user's active `PermitV2.getPermission()`
  Encryptable.uint8(5),
  [Encryptable.uint128("50"), Encryptable.bool(true)],
  50n,
  "hello"
)
// typeof encrypted - [PermissionV2, EncryptedUint8, [EncryptedUint128, EncryptedBool], bigint, string]
```

### Output data (sealed)
Encrypted data is sealed before it is returned to the users, at which point it can be unsealed on the client. By using the structs `SealedUint` / `SealedBool` / `SealedAddress` provided in `FHE.sol`, the sealed output variables can be automatically decrypted into the correct type using `fhenixsdk.unseal`.

A function with the following return type:
```solidity
function getSealedData(PermissionedV2 memory permission) view returns (uint256, string memory, SealedUint memory, SealedUint memory, SealedBool memory);
```

can be unsealed with `fhenixsdk`:
```typescript
const data = await contract.getSealedData(permission);

const unsealed = await client.unseal(data)
//    ?^ - [bigint, string, bigint, bigint, bool]
```

As with `fhenixsdk.encrypt` above, `unseal` will also recursively unseal any nested data structures.

### Notes

- `fhenixsdk` uses `zustand` behind the scenes to persist your user's Permits. These zustand stores can be imported directly to be used as part of hooks. In the future we will also expose hooks to streamline interacting with the sdk in your react enabled dApps.
- We plan to provide viem hooks inspired by `scaffold-eth`'s `useScaffoldContractRead` and `useScaffoldContractWrite` to automatically encrypt input data, inject permissions, and unseal output data.

```typescript
const provider = new JsonRpcProvider("http://localhost:8545");

const client = new FhenixClientV2();
await client.initialize({
  send: provider.send,
  signTypedData: (await provider.getSigner()).signTypedData
})

// Create PermitV2 (will trigger a wallet signature in web3 frontend)
await client.createPermit({
  type: 'self',
  issuer: account,
  projects: ["COUNTER", "FHERC20"],
})

// Encrypt (will encrypt any nested encryptables)
const encrypted = client.encryptTyped([
  Encryptable.uint8(5),
  [Encryptable.uint128("50"), Encryptable.bool(true)],
  50n,
  "hello"
])
// encrypted - [EncryptedUint8, [EncryptedUint128, EncryptedBool], bigint, string]

// Inject permission (read operation)
const sealed = await counter.connect(bob).getCount(client.getPermission())
// sealed - SealedUint({ data: ciphertext, utype: 0-5 })

// Unseal (will unseal any nested SealedItems)
const unsealed = await client.unsealTyped([
  sealed, 
  MockSealedUint, 
  MockSealedBool, 
  { hello: "world", sealed: MockSealedAddress }
])
// unsealed - [bigint, bigint, bool, { hello: string, sealed: string }]
```

## `FhenixClient` and `FhenixClientSync`

We have updated our Permit system to V2. Opting in to V2 Permits will break existing FhenixClient / FhenixClientSync usage. It is recommended to use the V2 sdk to enable V2 Permits.

### Usage

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
