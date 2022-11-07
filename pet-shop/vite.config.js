import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        cart: resolve(__dirname, "src/pages/cart.html"),
        admin: resolve(__dirname, "src/pages/admin.html"),
        details: resolve(__dirname, "src/pages/details.html"),
      },
    },
  },
});
