import { SingleKey, Wallet } from '@arkade-os/sdk';

import { PrivateKey } from './key.js';

const esploraUrl = 'http://localhost:3002';
const arkServerUrl = 'http://localhost:7170';

export function settle() {
  (async () => {
    // use your private key in hex format
    const identity = SingleKey.fromHex(PrivateKey);

    // create a wallet instance
    const wallet = await Wallet.create({
      identity,
      arkServerUrl,
      esploraUrl,
    });

    // Get all VTXOs and check their status
    const vtxos = await wallet.getVtxos();
    const pendingVtxos = vtxos.filter(
      (vtxo: Wallet.ExtendedVirtualCoin) => vtxo.virtualStatus.state === 'preconfirmed',
    );
    const settledVtxos = vtxos.filter(
      (vtxo: Wallet.ExtendedVirtualCoin) => vtxo.virtualStatus.state === 'settled',
    );

    console.log('Preconfirmed VTXOs:', pendingVtxos.length);
    console.log('Settled VTXOs:', settledVtxos.length);
  })().catch((error) => {
    console.error('Error:', error instanceof Error ? error.message : error);
  });
}

settle();
