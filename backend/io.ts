import type { HttpServer } from "vite";
import PocketBase from "pocketbase";
import { Server } from "socket.io";
import pretty from "pino-pretty";
import pino from "pino";

export default async function injectSocketIO(server: HttpServer) {
  const io = new Server(server);
  const logger = pino(pretty({ colorize: true }));

  const pb = new PocketBase(process.env.POCKETBASE_URL);
  await pb
    .collection("_superusers")
    .authWithPassword(
      process.env.POCKETBASE_SUPERUSER_EMAIL!,
      process.env.POCKETBASE_SUPERUSER_PASSWORD!,
    );

  const encoder = new TextEncoder();
  const passwordData = encoder.encode(process.env.POCKETBASE_SUPERUSER_PASSWORD || "");
  const serverTokenBuffer = await crypto.subtle.digest("SHA-256", passwordData);
  const serverToken = Array.from(new Uint8Array(serverTokenBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const roomUsers = new Map<
    string,
    Map<string, { userId: string | null; name: string; isAuthenticated: boolean }>
  >();

  io.on("connection", (socket) => {
    socket.on("join_room", async (data: { roomId: string; userId?: string | null }) => {
      const { roomId, userId } = data;
      let name = "guest";
      let isAuthenticated = false;

      if (userId) {
        try {
          const user = await pb.collection("users").getOne(userId);
          name = user.name;
          isAuthenticated = true;
          logger.info(`authenticated user ${name} joined room ${roomId}`);
        } catch {
          logger.warn(`invalid userId ${userId}, joining as guest`);
        }
      } else {
        logger.info(`guest joined room ${roomId}`);
      }

      socket.join(roomId);

      if (!roomUsers.has(roomId)) {
        roomUsers.set(roomId, new Map());
      }

      roomUsers.get(roomId)?.set(socket.id, {
        userId: userId ?? null,
        name,
        isAuthenticated,
      });

      if (isAuthenticated) {
        socket.to(roomId).emit("user_joined", { roomId, name });
      }
    });

    socket.on(
      "send_message",
      (message: {
        roomId: string;
        userId: string;
        content: string;
        created: string;
        token?: string;
      }) => {
        if (!message.token || message.token !== serverToken) {
          logger.warn(`unauthorized message attempt: missing or invalid server token`);
          return;
        }

        const users = roomUsers.get(message.roomId);
        let name = "<malformed>";

        if (users) {
          for (const [_, userInfo] of users.entries()) {
            if (userInfo.userId === message.userId) {
              name = userInfo.name;
              break;
            }
          }
        }

        const messageWithId = {
          id: Date.now().toString(),
          roomId: message.roomId,
          content: message.content,
          created: message.created,
          userName: name,
        };

        io.to(message.roomId).emit("new_message", messageWithId);
        logger.info(`server message sent to room ${message.roomId} from ${name}`);
      },
    );

    socket.on("disconnect", () => {
      for (const [roomId, users] of roomUsers.entries()) {
        if (users.has(socket.id)) {
          const userInfo = users.get(socket.id);
          if (userInfo) {
            const { name, isAuthenticated } = userInfo;

            users.delete(socket.id);

            if (isAuthenticated) {
              socket.to(roomId).emit("user_left", { roomId, username: name });
            }

            logger.info(`disconnected ${name} from room ${roomId}`);

            if (users.size === 0) {
              roomUsers.delete(roomId);
              logger.info(`room ${roomId} has been closed - no users left`);
            }
          }
        }
      }
    });
  });

  return io;
}
