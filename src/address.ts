import { SingleKey, Wallet } from '@arkade-os/sdk';

import { PrivateKey } from './key.js';

const esploraUrl = 'http://localhost:3002';
const arkServerUrl = 'http://localhost:7170';

export function address() {
  (async () => {
    // use your private key in hex format
    const identity = SingleKey.fromHex(PrivateKey);

    // create a wallet instance
    const wallet = await Wallet.create({
      identity,
      arkServerUrl,
      esploraUrl,
    });

    const offchainAddress = await wallet.getAddress();
    console.log('Ark Address:', offchainAddress);

    const boardingAddress = await wallet.getBoardingAddress();
    console.log('Boarding Address:', boardingAddress);
  })().catch((error) => {
    console.error('Error:', error instanceof Error ? error.message : error);
  });
}

address();
