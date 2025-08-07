import { SingleKey, Wallet } from '@arkade-os/sdk';

import { PrivateKey } from './key.js';

const esploraUrl = 'http://localhost:3002';
const arkServerUrl = 'http://localhost:7170';

export function watch() {
  (async () => {
    // use your private key in hex format
    const identity = SingleKey.fromHex(PrivateKey);

    // create a wallet instance
    const wallet = await Wallet.create({
      identity,
      arkServerUrl,
      esploraUrl,
    });

    await wallet.notifyIncomingFunds((incomingFunds: Wallet.IncomingFunds) => {
      console.log('Incoming Funds:', incomingFunds);
      // Handle incoming funds here
        switch (incomingFunds.type) {
          case 'vtxo':
            for (const vtxo of incomingFunds.vtxos) {
              console.log(`Received payment of ${vtxo.value} sats`);
              console.log(JSON.stringify(vtxo, null, 2));            }
            break;
          case 'utxo':
            for (const utxo of incomingFunds.coins) {
              console.log(`Received UTXO of ${utxo.value} sats`);
              console.log(JSON.stringify(utxo, null, 2));
            }
            break;
        }
    });
  })().catch((error) => {
    console.error('Error:', error instanceof Error ? error.message : error);
  });
}

watch();
