import ts from '@wessberg/rollup-plugin-ts';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { name, publishConfig } from './package.json';

/** @type {import('rollup').RollupOptions} */
const config = {
  input: './src/index.ts',
  output: [
    {
      file: publishConfig.main,
      format: 'umd',
      name,
      globals: {
        yaml: 'yaml',
        'yaml/types': 'types',
        'yaml/util': 'util',
      },
    },
    {
      file: publishConfig.module,
      format: 'esm',
    },
  ],
  plugins: [
    ts({ exclude: ['.yarn/cache/**'] }),
    commonjs({ extensions: ['.js', '.ts'] }),
    resolve({
      resolveOnly: ['lodash'],
    }),
  ],
};

export default config;
