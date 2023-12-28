import { expect } from '@esm-bundle/chai';
import { FhenixClient } from '../src/index';
// let fhenixjs = require('../dist/browser.js');

//import { JsonRpcProvider } from 'ethers';

const sum = (a, b) => {
  return a + b;
}

it('sums up 2 numbers', async () => {
  //new FhenixClient();
  //const provider = new JsonRpcProvider('http://localhost:1234');
  await FhenixClient.Create({initSdk: false});

  expect(sum(1, 1)).to.equal(2);
  expect(sum(3, 12)).to.equal(15);
});
