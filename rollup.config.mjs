import pluginCommonjs from '@rollup/plugin-commonjs';
import pluginJson from '@rollup/plugin-json';
import pluginNodeResolve from '@rollup/plugin-node-resolve';
import pluginTypescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: {
    file: 'lib/index.cjs',
    format: 'cjs',
  },
  plugins: [
    pluginTypescript(),
    pluginNodeResolve(),
    pluginCommonjs(),
    pluginJson(),
  ],
  external: [],
};
