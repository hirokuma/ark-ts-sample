import { OnchainWallet, SingleKey, Unroll, Wallet } from '@arkade-os/sdk';

import { PrivateKey } from './key.js';

const esploraUrl = 'http://localhost:3002';
const arkServerUrl = 'http://localhost:7170';

// unroll a specific VTXO
export function unilateralExit(txid: string, vout: number) {
  (async () => {
    // use your private key in hex format
    const identity = SingleKey.fromHex(PrivateKey);

    // create a wallet instance
    const wallet = await Wallet.create({
      identity,
      arkServerUrl,
      esploraUrl,
    });

    const onchainWallet = new OnchainWallet(wallet.identity, 'regtest', wallet.onchainProvider);
    console.log('Address:', onchainWallet.address);

    const outpoint = { txid, vout };
    const session = await Unroll.Session.create(
      outpoint,
      onchainWallet, // the onchain wallet paying for miner fees
      onchainWallet.provider, // the onchain explorer
      wallet.indexerProvider, // the ark indexer to fetch virtual transactions
    );

    // iterates through each step will execute them one by one
    for await (const step of session) {
      switch (step.type) {
        // WAIT means we waited for the previous transaction to be confirmed
        case Unroll.StepType.WAIT:
          console.log(`Waiting for transaction ${step.txid} to be confirmed`);
          break;
        // UNROLL means we put a transaction onchain
        case Unroll.StepType.UNROLL:
          console.log(`Broadcasting transaction ${step.tx.id}`);
          break;
        // DONE means we unrolled all transactions, the VTXO outpoint is not virtual anymore
        // the loop end after this step
        case Unroll.StepType.DONE:
          console.log(`Unrolling complete for VTXO ${step.vtxoTxid}`);
          break;
      }
    }
  })().catch((error) => {
    console.error('Error:', error instanceof Error ? error.message : error);
    console.error('stack:', error.stack);
  });
}

if (process.argv.length < 3) {
  console.log('Usage: node dist/unilateral_exit.js <txid>:<index>');
  process.exit(1);
}
const outpoint = process.argv[2].split(':');
if (outpoint.length !== 2) {
  console.log('Invalid outpoint format');
  process.exit(1);
}
unilateralExit(outpoint[0], parseInt(outpoint[1], 10));
