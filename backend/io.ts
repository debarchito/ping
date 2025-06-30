import type { HttpServer } from "vite";
import { Server } from "socket.io";

export default function injectSocketIO(server: HttpServer) {
  const io = new Server(server);

  io.on("connection", () => {
    //
  });
}
