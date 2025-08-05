import { SingleKey, Wallet } from '@arkade-os/sdk';

import { PrivateKey } from './key.js';

const esploraUrl = 'http://localhost:3002';
const arkServerUrl = 'http://localhost:7170';

export function history() {
  (async () => {
    // use your private key in hex format
    const identity = SingleKey.fromHex(PrivateKey);

    // create a wallet instance
    const wallet = await Wallet.create({
      identity,
      arkServerUrl,
      esploraUrl,
    });

    // Get transaction history
    const history = await wallet.getTransactionHistory();
    console.log('Number of transactions:', history.length);

    history.forEach((tx: Wallet.Transaction, index: number) => {
      console.log(`Transaction #${index + 1}:`);
      console.log(`  Type: ${tx.type}`);
      console.log(`  Amount: ${tx.amount} sats`);
      console.log(`  Settled: ${tx.settled ? 'Yes' : 'No'}`);
      console.log(`  Created At: ${tx.createdAt}`);

      // boarding tx
      if (tx.key.boardingTxid) {
        console.log(`  Boarding TXID: ${tx.key.boardingTxid}`);
      }
      // offchain tx
      if (tx.key.arkTxid) {
        console.log(`  Ark TXID: ${tx.key.arkTxid}`);
      }
      // commitment tx
      if (tx.key.commitmentTxid) {
        console.log(`  Commitment TXID: ${tx.key.commitmentTxid}`);
      }
    });
  })().catch((error) => {
    console.error('Error:', error instanceof Error ? error.message : error);
  });
}

history();
