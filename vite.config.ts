import { socketIOServer } from "./plugins/socket-io-plugin-vite.js";
import devtoolsJson from "vite-plugin-devtools-json";
import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss(), sveltekit(), devtoolsJson(), socketIOServer],
});
