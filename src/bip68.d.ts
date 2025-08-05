declare module 'bip68' {
  const bip68: { encode: (opts: { blocks: number }) => number; decode: (n: number) => { blocks: number } };
  export default bip68;
}
// declare module 'bip68';
