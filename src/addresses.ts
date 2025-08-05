import { Script, ScriptNum, p2tr, taprootListToTree, OP } from '@scure/btc-signer';
import { TAPROOT_UNSPENDABLE_KEY, Bytes } from '@scure/btc-signer/utils';
import { bech32m } from 'bech32';
import bip68 from 'bip68';

type XOnlyPubKey = Bytes;

/**
 * Creates a default mainnet Ark address with collaborative and exit script paths
 * @param serverPubKey - Server's x-only public key (32 bytes)
 * @param myPubKey - User's x-only public key (32 bytes)
 * @param timelock - Number of blocks required for unilateral exit
 * @param isTestnet - Whether to use testnet prefix
 * @returns bech32m encoded Ark address
 */
function makeDefaultArkAddress(
  serverPubKey: XOnlyPubKey,
  myPubKey: XOnlyPubKey,
  timelock: number,
  isTestnet: boolean,
): string {
  // create collaborative spending path
  const forfeit = Script.decode([serverPubKey, OP.CHECKSIGVERIFY, myPubKey, OP.CHECKSIG]);

  // encode timelock as bip68 sequence
  const sequence = ScriptNum().encode(BigInt(bip68.encode({ blocks: timelock })));

  // create unilateral exit path
  const exit = Script.decode([sequence, OP.CHECKSEQUENCEVERIFY, OP.DROP, myPubKey, OP.CHECKSIG]);

  // generate P2TR output key with unspendable key path
  const vtxoTaprootKey = p2tr(
    TAPROOT_UNSPENDABLE_KEY,
    taprootListToTree([{ script: forfeit }, { script: exit }]),
    undefined,
    true,
  ).tweakedPubkey;

  // combine server pubkey and vtxo taproot key
  const addressData = new Uint8Array(65);
  addressData[0] = 0; // version
  addressData.set(serverPubKey, 1);
  addressData.set(vtxoTaprootKey, 33);

  return bech32m.encode(
    isTestnet ? 'tark' : 'ark', // network prefix
    bech32m.toWords(addressData), // convert to 5-bit words
    1023, // extends bech32m byte limit
  );
}
