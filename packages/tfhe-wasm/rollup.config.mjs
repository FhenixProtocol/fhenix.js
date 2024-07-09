import commonjs from '@rollup/plugin-commonjs';
import wasm from '@rollup/plugin-wasm';
import resolve from '@rollup/plugin-node-resolve';

export default [
  // browser-friendly UMD build
  // {
  //   input: "./index.js",
  //   output: {
  //     name: 'fhenix-tfhe',
  //     file: 'dist/fhenix-tfhe.umd.js',
  //     format: 'umd',
  //     sourcemap: true
  //   },
  //   plugins: [
  //     commonjs(),  // so Rollup can convert modules to an ES module
  //     wasm({targetEnv: "auto-inline"}),
  //     resolve({
  //       browser: true,
  //       exportConditions: ["import", "default"],
  //       mainFields: ["module", "main", "browser"],
  //       modulesOnly: false,
  //       preferBuiltins: false,
  //     })
  //   ]
  // },

  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify
  // `file` and `format` for each target)
  {
    input: "./tfhe.js",
    plugins: [
      commonjs(),

      wasm({targetEnv: "auto-inline", include: "tfhe_bg.wasm"}),
      resolve({
        browser: true,
        extensions: ['.js', '.wasm'],
        // exportConditions: ["import", "default"],
        // mainFields: ["module", "main"],
        modulesOnly: false,
        preferBuiltins: false,
      })
    ],
    output: [
      { file: 'dist/fhenix-tfhe.esm.js', format: 'esm', sourcemap: true, exports: "named" },
    ]
  },
  //
  {
    input: "./tfhe.js",
    plugins: [
      commonjs(),  // so Rollup can convert modules to an ES module
      wasm(),
      resolve({
        exportConditions: ["require", "default"],
        mainFields: ["module", "main"],
        modulesOnly: false,
        preferBuiltins: false,
      })
    ],
    output: [
      { file: 'dist/fhenix-tfhe.cjs.js', format: 'cjs', sourcemap: true, exports: 'named' },
    ]
  }
];
