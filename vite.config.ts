import { socketIOServer } from "./plugins/socket-io-plugin-vite.js";
import devtoolsJson from "vite-plugin-devtools-json";
import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import fs from "node:fs";

export default defineConfig({
  plugins: [tailwindcss(), sveltekit(), devtoolsJson(), socketIOServer],
  server: {
    https: {
      key: fs.readFileSync(`${import.meta.dirname}/cert/key.pem`),
      cert: fs.readFileSync(`${import.meta.dirname}/cert/cert.pem`),
    },
    proxy: {},
  },
});
