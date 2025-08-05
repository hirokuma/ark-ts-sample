import { SingleKey, Wallet } from '@arkade-os/sdk';

const esploraUrl = 'http://localhost:3002';
const arkServerUrl = 'http://localhost:7170';

export function address() {
  (async () => {
    // use your private key in hex format
    const identity = SingleKey.fromHex('00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff');

    // create a wallet instance
    const wallet = await Wallet.create({
      identity,
      arkServerUrl,
      esploraUrl,
    });

    // You can receive bitcoin offchain instantly! No inbound liquidity!
    const offchainAddress = await wallet.getAddress();
    console.log('Ark Address:', offchainAddress);

    const boardingAddress = await wallet.getBoardingAddress();
    console.log('Boarding Address:', boardingAddress);

    wallet.notifyIncomingFunds(async (incomingFunds) => {
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
  })();
}

address();
