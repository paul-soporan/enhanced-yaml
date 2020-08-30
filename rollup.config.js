import ts from '@wessberg/rollup-plugin-ts';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { publishConfig } from './package.json';

/** @type {import('rollup').RollupOptions} */
const config = {
  input: './src/index.ts',
  output: [
    { file: publishConfig.main, format: 'cjs' },
    { file: publishConfig.module, format: 'esm' },
  ],
  plugins: [
    ts({ exclude: ['.yarn/cache/**'] }),
    commonjs({ extensions: ['.js', '.ts'] }),
    resolve({ resolveOnly: [/(?!)/] }),
  ],
};

export default config;
