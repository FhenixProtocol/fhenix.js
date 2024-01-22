<p align="center">
  <img src="./media/fhnx_cover.svg#gh-light-mode-only" type="image/svg+xml" width="75%" class="light-logo" />
  <img src="./media/fhnx_cover.svg#gh-dark-mode-only" type="image/svg+xml" width="75%" class="dark-logo" />
</p>

<p align="center">
  The JavaScript SDK for Fhenix
</p>

<p align="center">
  <img alt="npm" src="https://img.shields.io/npm/v/fhenixjs" />
  <img alt="ci" style="margin-left: 0.3em" src="https://github.com/fhenixprotocol/fhenix.js/actions/workflows/test.yml/badge.svg?branch=main" />
</p>

<p align="center">
  <a href="https://docs.fhenix.io" target="_blank"><strong>Explore the Docs »</strong></a>
</p>

## General

fhenix.js allows developers to add support for encrypted data when developing dApps on Fhenix.
fhenix.js includes easy helpers for encryption, unsealing and helpers to create apps that utilize private data.

## Installation

```bash
# Using npm
npm install fhenixjs
```

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

### Permits & Access Control

We recommend the helper `Permit` structure, which is a built-in method for providing access control for your FHE-enabled view functions.

#### Credits

This project is based on [fhevmjs](https://github.com/zama-ai/fhevmjs) by Zama and utilizes [tfhe.rs](https://github.com/zama-ai/tfhe-rs) to provide FHE functionality

#### Need support?

Todo: discord link, telegram link, etc.
