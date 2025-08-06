import { OnchainWallet, SingleKey, Unroll, Wallet } from '@arkade-os/sdk';

import { PrivateKey } from './key.js';

const esploraUrl = 'http://localhost:3002';
const arkServerUrl = 'http://localhost:7170';

export function unilateralExit() {
  (async () => {
    // use your private key in hex format
    const identity = SingleKey.fromHex(PrivateKey);

    // create a wallet instance
    const wallet = await Wallet.create({
      identity,
      arkServerUrl,
      esploraUrl,
    });

    const onchainWallet = new OnchainWallet(wallet.identity, 'regtest');
    console.log('Address:', onchainWallet.address);

    // unroll a specific VTXO

    // VTXO #0:
    //   ID: 6843fd9ec8281735827c4c39b2f506aea693291039a092239423e13732f9cd0f:0
    //   Amount: 149885000 sats
    //   Batch ID: undefined
    //   Status: settled
    const outpoint = {
      txid: '6843fd9ec8281735827c4c39b2f506aea693291039a092239423e13732f9cd0f',
      vout: 0,
    };

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
  });
}

unilateralExit();
