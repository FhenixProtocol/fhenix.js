import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import wasm from '@rollup/plugin-wasm';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default [
  // browser-friendly UMD build
  // {
  //   input: 'src/index.ts',
  //   output: {
  //     name: 'browser',
  //     dir: 'dist/browser/',
  //     // dir: pkg.browser,
  //     format: 'amd'
  //   },
  //   plugins: [
  //     resolve(),   // so Rollup can find `ms`
  //     commonjs(),  // so Rollup can convert modules to an ES module
  //     typescript(), // so Rollup can convert TypeScript to JavaScript
  //     wasm()
  //   ]
  // },

  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify
  // `file` and `format` for each target)
  // {
  //   input: 'src/index.ts',
  //   plugins: [
  //     wasm(),
  //     typescript() // so Rollup can convert TypeScript to JavaScript
  //   ],
  //   external: ['ethers', 'bufferutil', 'utf-8-validate', 'node-tfhe'],
  //   output: [
  //     { dir: 'dist', format: 'cjs' },
  //     { dir: 'dist', format: 'es' }
  //   ]
  // }
  getConfig({ browser: true }),
  getConfig({ browser: true, suffix: ".umd", format: "umd", name: "fhenixjs" }),
];

function getConfig(opts) {
  if (opts == null) { opts = { }; }

  const file = `./dist/fhenixjs${ (opts.suffix || "") }.js`;
  const exportConditions = [ "import", "default" ];
  const mainFields = [ "module", "main" ];
  if (opts.browser) { mainFields.unshift("browser"); }

  return {
    input: "./lib.esm/index.js",
    output: {
      file,
      banner: "const __$G = (typeof globalThis !== 'undefined' ? globalThis: typeof window !== 'undefined' ? window: typeof global !== 'undefined' ? global: typeof self !== 'undefined' ? self: {});",
      name: (opts.name || undefined),
      format: (opts.format || "esm"),
      sourcemap: true
    },
    context: "__$G",
    treeshake: true,
    plugins: [
      nodeResolve({
        exportConditions,
        mainFields,
        modulesOnly: true,
        preferBuiltins: false
      })
    ],
  };
}
