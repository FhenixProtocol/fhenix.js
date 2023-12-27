import { expect } from '@esm-bundle/chai';
import { FhenixClient } from '../bundle/fhevm.min.js';

const sum = (a, b) => {
  return a + b;
}

it('sums up 2 numbers', async () => {
  await FhenixClient();
  //await FhenixClient.Create({initSdk: true});

  expect(sum(1, 1)).to.equal(2);
  expect(sum(3, 12)).to.equal(15);
});
