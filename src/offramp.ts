import { Ramps, SingleKey, Wallet } from '@arkade-os/sdk';

import { PrivateKey } from './key.js';

const esploraUrl = 'http://localhost:3002';
const arkServerUrl = 'http://localhost:7170';

export function offRamp() {
  (async () => {
    // use your private key in hex format
    const identity = SingleKey.fromHex(PrivateKey);

    // create a wallet instance
    const wallet = await Wallet.create({
      identity,
      arkServerUrl,
      esploraUrl,
    });

    const bitcoindAddress = 'bcrt1qgswrj2m99ccen6gr8cw5s3457rn7c74swncy7a';
    const refundSats = 5000n; // bigint

    const ramp = new Ramps(wallet);
    const txid = await ramp.offboard(bitcoindAddress, refundSats);
    console.log('Commitment transaction ID:', txid);
  })().catch((error) => {
    console.error('Error:', error instanceof Error ? error.message : error);
  });
}

offRamp();
