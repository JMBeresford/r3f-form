import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import multiInput from 'rollup-plugin-multi-input';
import glslify from 'rollup-plugin-glslify';
import terser from '@rollup/plugin-terser';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];
const root = process.platform === 'win32' ? path.resolve('/') : '/';
const external = (id) => !id.startsWith('.') && !id.startsWith(root);

export default [
  {
    input: ['src/**/*.ts', 'src/**/*.tsx', '!src/index.ts'],
    output: { dir: `dist`, format: 'esm' },
    external,
    plugins: [
      multiInput.default(),

      glslify(),
      babel({
        exclude: 'node_modules/**',
        extensions,
        babelHelpers: 'runtime',
        presets: [
          '@babel/preset-env',
          '@babel/preset-react',
          '@babel/preset-typescript',
        ],
        plugins: [
          [
            '@babel/transform-runtime',
            { regenerator: false, useESModules: true },
          ],
        ],
      }),
      resolve({ extensions }),
    ],
  },
  {
    input: `./src/index.ts`,
    output: { dir: `dist`, format: 'esm', preserveModules: true },
    external,
    plugins: [
      glslify(),
      babel({
        exclude: 'node_modules/**',
        extensions,
        babelHelpers: 'runtime',
        presets: [
          '@babel/preset-env',
          '@babel/preset-react',
          '@babel/preset-typescript',
        ],
        plugins: [
          [
            '@babel/transform-runtime',
            { regenerator: false, useESModules: true },
          ],
        ],
      }),
      resolve({ extensions }),
    ],
  },
  {
    input: ['src/**/*.ts', 'src/**/*.tsx', '!src/index.ts'],
    output: { dir: `dist`, format: 'cjs' },
    external,
    plugins: [
      multiInput.default({
        transformOutputPath: (output) => output.replace(/\.[^/.]+$/, '.cjs.js'),
      }),

      glslify(),
      babel({
        exclude: 'node_modules/**',
        extensions,
        babelHelpers: 'runtime',
        presets: [
          '@babel/preset-env',
          '@babel/preset-react',
          '@babel/preset-typescript',
        ],
        plugins: [
          [
            '@babel/transform-runtime',
            { regenerator: false, useESModules: false },
          ],
        ],
      }),
      resolve({ extensions }),
      terser(),
    ],
  },
  {
    input: `./src/index.ts`,
    output: { file: `dist/index.cjs.js`, format: 'cjs' },
    external,
    plugins: [
      glslify(),
      babel({
        exclude: 'node_modules/**',
        extensions,
        babelHelpers: 'runtime',
        presets: [
          '@babel/preset-env',
          '@babel/preset-react',
          '@babel/preset-typescript',
        ],
        plugins: [
          [
            '@babel/transform-runtime',
            { regenerator: false, useESModules: false },
          ],
        ],
      }),
      resolve({ extensions }),
      terser(),
    ],
  },
];
