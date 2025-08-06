import { Ramps, SingleKey, Wallet } from '@arkade-os/sdk';

import { PrivateKey } from './key.js';

const esploraUrl = 'http://localhost:3002';
const arkServerUrl = 'http://localhost:7170';

export function onRamp() {
  (async () => {
    // use your private key in hex format
    const identity = SingleKey.fromHex(PrivateKey);

    // create a wallet instance
    const wallet = await Wallet.create({
      identity,
      arkServerUrl,
      esploraUrl,
    });

    const ramp = new Ramps(wallet);
    const boardingUtxos = await wallet.getBoardingUtxos();
    for (const utxo of boardingUtxos) {
      try {
        const txid = await ramp.onboard([utxo]);
        console.log('Commitment transaction ID:', txid);
      } catch (error) {
        console.error('Error during onboarding:', error instanceof Error ? error.message : error);
      }
    }
  })().catch((error) => {
    console.error('Error:', error instanceof Error ? error.message : error);
  });
}

onRamp();
