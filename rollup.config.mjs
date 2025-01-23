import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import wasm from '@rollup/plugin-wasm';

export default [
  // browser-friendly UMD build
  {
    input: "./lib/esm/index.js",
    output: {
      banner: "const __$G = (typeof globalThis !== 'undefined' ? globalThis: typeof window !== 'undefined' ? window: typeof global !== 'undefined' ? global: typeof self !== 'undefined' ? self: {});",
      name: 'cofhejs',
      file: 'dist/cofhe.umd.js',
      format: 'umd',
      sourcemap: true
    },
    plugins: [
      commonjs(),  // so Rollup can convert modules to an ES module
      wasm({targetEnv: "auto-inline"}),
      resolve({
        browser: true,
        extensions: ['.js', '.ts', '.wasm'],
        exportConditions: ["import", "default"],
        mainFields: ["module", "main", "browser"],
        modulesOnly: false,
        preferBuiltins: false,
      })
    ]
  },
  {
    input: "./lib/esm/index.js",
    plugins: [
      commonjs(),  // so Rollup can convert modules to an ES module
      wasm({targetEnv: "auto-inline"}),
      resolve({
        browser: true,
        extensions: ['.js', '.ts', '.wasm'],
        // exportConditions: ["import", "default"],
        // mainFields: ["module", "main"],
        modulesOnly: false,
        preferBuiltins: false,
      })
    ],
    output: [
      { file: 'dist/cofhe.esm.js', format: 'esm', sourcemap: true },
    ]
  }
];
