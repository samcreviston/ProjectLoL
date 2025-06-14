import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src/",
  base: "/",

  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        account: resolve(__dirname, "src/account/index.html"),
        module: resolve(__dirname, "src/module/index.html"),
      },
    },
  },
});
