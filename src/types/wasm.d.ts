declare module "*.wasm" {
  const wasm: () => Promise<WebAssembly.Module | WebAssembly.Instance>;
  export default wasm;
}
