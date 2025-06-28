import injectSocketIO from "../backend/io.js";
import type { ViteDevServer } from "vite";

export const socketIOServer = {
  name: "socketIOServer",
  configureServer(server: ViteDevServer) {
    injectSocketIO(server.httpServer!);
  },
};
