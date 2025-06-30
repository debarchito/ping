import type { Socket } from "socket.io";
import type { HttpServer } from "vite";
import { Server } from "socket.io";

export default function injectSocketIO(server: HttpServer) {
  const io = new Server(server);
  const roomUsers = new Map<string, Map<string, { username: string; isAuthenticated: boolean }>>();

  io.on("connection", (socket) => {
    socket.on(
      "join_room",
      (data: { roomId: string; username: string; userId?: string; isAuthenticated: boolean }) => {
        const { roomId, username, isAuthenticated } = data;

        socket.join(roomId);

        if (!roomUsers.has(roomId)) {
          roomUsers.set(roomId, new Map());
        }
        roomUsers.get(roomId)!.set(socket.id, { username, isAuthenticated });

        if (isAuthenticated) {
          socket.to(roomId).emit("user_joined", {
            roomId,
            username,
          });
        }
      },
    );

    socket.on(
      "send_message",
      (message: {
        content: string;
        user: {
          name: string;
          id: string;
        };
        roomId: string;
        userId: string;
        created: string;
      }) => {
        const messageWithId = {
          ...message,
          id: Date.now().toString(),
        };

        io.to(message.roomId).emit("new_message", messageWithId);
      },
    );

    socket.on(
      "leave_room",
      (data: { roomId: string; username: string; userId: string; isAuthenticated: boolean }) => {
        const { roomId, username, isAuthenticated } = data;

        handleUserLeaving(socket, roomId, username, isAuthenticated);
      },
    );

    socket.on("disconnect", () => {
      roomUsers.forEach((users, roomId) => {
        if (users.has(socket.id)) {
          const { username, isAuthenticated } = users.get(socket.id)!;
          handleUserLeaving(socket, roomId, username, isAuthenticated);
        }
      });
    });

    function handleUserLeaving(
      socket: Socket,
      roomId: string,
      username: string,
      isAuthenticated: boolean,
    ) {
      socket.leave(roomId);

      const roomUserMap = roomUsers.get(roomId);
      if (roomUserMap) {
        roomUserMap.delete(socket.id);
        if (roomUserMap.size === 0) {
          roomUsers.delete(roomId);
        }
      }

      if (isAuthenticated) {
        socket.to(roomId).emit("user_left", {
          roomId,
          username,
        });
      }
    }
  });

  return io;
}
