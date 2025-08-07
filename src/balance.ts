import { SingleKey, Wallet } from '@arkade-os/sdk';

import { PrivateKey } from './key.js';

const esploraUrl = 'http://localhost:3002';
const arkServerUrl = 'http://localhost:7170';

export function balance() {
  (async () => {
    // use your private key in hex format
    const identity = SingleKey.fromHex(PrivateKey);

    // create a wallet instance
    const wallet = await Wallet.create({
      identity,
      arkServerUrl,
      esploraUrl,
    });

    // Get the balance of the wallet
    const balance = await wallet.getBalance();
    console.log('Wallet Balance:', balance);

    console.log('----------------------------------------------');

    const vtxos = await wallet.getVtxos();
    console.log('Number of VTXOs:', vtxos.length);

    vtxos.forEach((vtxo: Wallet.ExtendedVirtualCoin, index: number) => {
      console.log(`VTXO #${index}:`);
      console.log(`  ID: ${vtxo.txid}:${vtxo.vout}`);
      console.log(`  Amount: ${vtxo.value} sats`);
      console.log(`  Batch ID: ${vtxo.virtualStatus.batchTxID}`);
      console.log(`  Status: ${vtxo.virtualStatus.state}`); // "preconfirmed" | "settled" | "swept" | "spent";
      // console.log('  JSON VTXO----------------');
      // console.log(`${JSON.stringify(vtxo)}`);
    });

    console.log('----------------------------------------------');

    // Get boarding UTXOs
    const boardingUtxos = await wallet.getBoardingUtxos();
    console.log('Number of boarding UTXOs:', boardingUtxos.length);

    // Log important information about each boarding UTXO
    boardingUtxos.forEach((utxo: Wallet.BoardingUTXO, index: number) => {
      console.log(`Boarding UTXO #${index + 1}:`);
      console.log(`  TXID: ${utxo.txid}`);
      console.log(`  Output Index: ${utxo.vout}`);
      console.log(`  Amount: ${utxo.value} sats`);
      console.log(
        `  Status: ${utxo.status.confirmed ? 'Confirmed' : 'Unconfirmed'}`,
      );
      // console.log('  JSON UTXO----------------');
      // console.log(`${JSON.stringify(utxo)}`);
    });
  })().catch((error) => {
    console.error('Error:', error instanceof Error ? error.message : error);
  });
}

balance();
