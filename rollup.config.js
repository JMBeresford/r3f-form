import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import multiInput from "rollup-plugin-multi-input";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";

const extensions = [".js", ".jsx", ".ts", ".tsx"];
const root = process.platform === "win32" ? path.resolve("/") : "/";
const external = (id) => !id.startsWith(".") && !id.startsWith(root);

export default [
  {
    input: ["src/**/*.ts", "src/**/*.tsx", "!src/index.ts", "!src/types.ts"],
    output: { dir: `dist`, format: "esm" },
    external,
    plugins: [
      multiInput.default(),
      babel({
        exclude: "node_modules/**",
        extensions,
        babelHelpers: "runtime",
        presets: [
          "@babel/preset-env",
          "@babel/preset-react",
          "@babel/preset-typescript",
        ],
        plugins: [
          [
            "@babel/transform-runtime",
            { regenerator: false, useESModules: true },
          ],
        ],
      }),
      resolve({ extensions }),
    ],
  },
  {
    input: `./src/index.ts`,
    output: { dir: `dist`, format: "esm", preserveModules: true },
    external,
    plugins: [
      babel({
        exclude: "node_modules/**",
        extensions,
        babelHelpers: "runtime",
        presets: [
          "@babel/preset-env",
          "@babel/preset-react",
          "@babel/preset-typescript",
        ],
        plugins: [
          [
            "@babel/transform-runtime",
            { regenerator: false, useESModules: true },
          ],
        ],
      }),
      resolve({ extensions }),
    ],
  },
  {
    input: ["src/**/*.ts", "src/**/*.tsx", "!src/index.ts", "!src/types.ts"],
    output: { dir: `dist`, format: "cjs" },
    external,
    plugins: [
      multiInput.default({
        transformOutputPath: (output) => output.replace(/\.[^/.]+$/, ".cjs.js"),
      }),

      babel({
        exclude: "node_modules/**",
        extensions,
        babelHelpers: "runtime",
        presets: [
          "@babel/preset-env",
          "@babel/preset-react",
          "@babel/preset-typescript",
        ],
        plugins: [
          [
            "@babel/transform-runtime",
            { regenerator: false, useESModules: false },
          ],
        ],
      }),
      typescript({ compilerOptions: { module: "esnext" } }),
      resolve({ extensions }),
      terser(),
    ],
  },
  {
    input: `./src/index.ts`,
    output: { file: `dist/index.cjs.js`, format: "cjs" },
    external,
    plugins: [
      babel({
        exclude: "node_modules/**",
        extensions,
        babelHelpers: "runtime",
        presets: [
          "@babel/preset-env",
          "@babel/preset-react",
          "@babel/preset-typescript",
        ],
        plugins: [
          [
            "@babel/transform-runtime",
            { regenerator: false, useESModules: false },
          ],
        ],
      }),
      typescript({ compilerOptions: { module: "esnext" } }),
      resolve({ extensions }),
      terser(),
    ],
  },
];
