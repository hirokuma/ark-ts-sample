import { SingleKey, Wallet } from '@arkade-os/sdk';

import { balance } from './balance.js';
import { PrivateKey } from './key.js';

const esploraUrl = 'http://localhost:3002';
const arkServerUrl = 'http://localhost:7170';

export function sending() {
  (async () => {
    // use your private key in hex format
    const identity = SingleKey.fromHex(PrivateKey);

    // create a wallet instance
    const wallet = await Wallet.create({
      identity,
      arkServerUrl,
      esploraUrl,
    });

    const txid = await wallet.sendBitcoin({
      address:
        'tark1qqjcfvnahpsykg5yajxdcmkazufyals6ad7ku5nrpnzj6xn9tmhd2eecwdns9yxw6up2s63r5ns2mvz5v8l8ewf96epd3p892uraphdepyhucz',
      amount: 50000, // Amount in satoshis
      memo: 'Test transaction from Arkade SDK',
    });
    console.log('Transaction ID:', txid);
  })().catch((error) => {
    console.error('Error:', error instanceof Error ? error.message : error);
  });
}

sending();
balance();
