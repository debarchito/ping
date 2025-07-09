import injectSocketIO from "../backend/io.js";
import type { ViteDevServer } from "vite";

export const socketIOServer = {
  name: "socketIOServer",
  async configureServer(server: ViteDevServer) {
    await injectSocketIO(server.httpServer!);
  },
};
