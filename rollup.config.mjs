import terser from '@rollup/plugin-terser';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';
import pkg from './package.json' assert { type: "json" };

const date = (new Date()).toDateString();
const banner = `${pkg.name} v${pkg.version} ${date}
${pkg.homepage}

@author ${pkg.author.name} <${pkg.author.email}>
@copyright ${date.slice(-4)} ${pkg.author.name}
@license ${pkg.license}
@version ${pkg.version}
@build [hash]`;

const globals = {
  'three': 'THREE',
  'three-mesh-bvh': 'threeMeshBvh',
  'ndarray': 'ndarray',
  'ndarray-fill': 'ndarrayFill',
  'xml2js': 'xml2js',
  'binvox': 'binvox',
  'ndarray-unpack': 'unpack'
}

export default {
  input: 'src/index.js',
  output: [
    {
      name: pkg.name,
      file: pkg.umd,
      format: 'umd',
      sourcemap: true,
      globals: globals,
    },
    {
      name: pkg.name,
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
      globals: globals,
      exports: 'auto',
    },
    {
      name: pkg.name,
      file: pkg.module,
      format: 'es',
      sourcemap: true,
      globals: globals,
    },
  ],
  plugins: [
    json(),
    resolve({ preferBuiltins: false, browser: true }),  // Resolve Node.js module dependencies
    commonjs(),
    babel({
      babelHelpers: 'bundled',  // Include Babel helpers
      exclude: 'node_modules/**' // Exclude Babel transpilation of  dependencies
    }),
    nodePolyfills(),
    terser()  // Minify the output for production
  ],
  external: ['three'], // Mark 'three' as external
  moduleContext: {
    'node_modules/sax/lib/sax.js': 'window'
  }
};
