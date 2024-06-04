import commonjs from '@rollup/plugin-commonjs';
import wasm from '@rollup/plugin-wasm';
import resolve from '@rollup/plugin-node-resolve';

export default [
  // browser-friendly UMD build
  {
    input: "./lib/esm/index.js",
    output: {
      banner: "const __$G = (typeof globalThis !== 'undefined' ? globalThis: typeof window !== 'undefined' ? window: typeof global !== 'undefined' ? global: typeof self !== 'undefined' ? self: {});",
      name: 'fhenixjs',
      file: 'dist/fhenix.umd.js',
      format: 'umd',
      sourcemap: true
    },
    plugins: [
      commonjs(),  // so Rollup can convert modules to an ES module
      wasm({targetEnv: "auto-inline"}),
      resolve({
        browser: true,
        exportConditions: ["import", "default"],
        mainFields: ["module", "main", "browser"],
        modulesOnly: false,
        preferBuiltins: false,
      })
    ]
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify
  // `file` and `format` for each target)
  {
    input: "./lib/esm/index.js",
    plugins: [
      commonjs(),

      wasm({targetEnv: "auto-inline"}),
      resolve({
        browser: true,
        extensions: ['.js', '.ts', '.wasm'],
        exportConditions: ["import", "default"],
        mainFields: ["module", "main"],
        modulesOnly: false,
        preferBuiltins: false,
      })
    ],
    external: ['bufferutil', 'utf-8-validate', 'node-tfhe', 'tfhe'],
    output: [
      { file: 'dist/fhenix.esm.js', format: 'esm', sourcemap: true },
    ]
  },
  //
  {
    input: "./lib/commonjs/index.js",
    plugins: [
      wasm(),
      resolve({
        exportConditions: ["import", "default"],
        mainFields: ["module", "main"],
        modulesOnly: false,
        preferBuiltins: false,
      })
    ],
    external: ['ethers', 'bufferutil', 'utf-8-validate', 'node-tfhe'],
    output: [
      { file: 'dist/fhenix.cjs.js', format: 'cjs', sourcemap: true },
    ]
  }
];
