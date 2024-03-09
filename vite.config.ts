import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      name: "r3f-form",
      fileName: "index",
      formats: ["es"],
    },
    rollupOptions: {
      external: [
        "react",
        "@react-three/fiber",
        "@react-three/drei",
        "troika-three-text",
        "react-dom",
        "three",
        "react/jsx-runtime",
      ],
      output: {
        globals: {
          react: "React",
        },
      },
    },
  },
  plugins: [dts({ exclude: "src/utils.ts" }), react()],
});
