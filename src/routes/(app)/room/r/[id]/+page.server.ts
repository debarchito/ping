import type { PageServerLoad, Actions } from "./$types";
import { env } from "$env/dynamic/private";
import { io } from "socket.io-client";

const ip = env.ENV == "production" ? env.PING_IP : env.PING_DEV_IP;
const socket = io(ip, {
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  transports: ["websocket", "polling"],
  rejectUnauthorized: env.DEPLOYED === "1",
});

socket.on("connect", () => console.log("[socket.io] Connected to service"));
socket.on("connect_error", (err) => console.log("[socket.io] Connection error:", err));

export const load: PageServerLoad = async ({ url, locals }) => {
  const id = url.pathname.split("/").pop() || "";

  try {
    const room = await locals.pb.collection("rooms").getOne(id);
    const messages = await locals.pb.collection("messages").getList(1, 10, {
      filter: `roomId = "${id}"`,
      sort: "-created",
      expand: "userId",
    });

    return {
      status: 200,
      message: "Success",
      payload: {
        user: locals.user,
        room,
        messages: {
          totalItems: messages.totalItems,
          page: messages.page,
          totalPages: messages.totalPages,
          perPage: messages.perPage,
          items: messages.items
            .map((message) => {
              return {
                ...message,
                user: message.expand?.userId || { name: "<malformed>" },
              };
            })
            .reverse(),
        },
      },
    };
  } catch (err) {
    locals.logger.error(err);

    return { status: 404, message: "Not Found", payload: null };
  }
};

export const actions: Actions = {
  "load-more": async ({ request, locals }) => {
    const formData = await request.formData();
    const id = formData.get("roomId")?.toString() ?? "";
    const page = parseInt(formData.get("page")?.toString() ?? "1");
    const perPage = parseInt(formData.get("perPage")?.toString() ?? "10");

    try {
      const messages = await locals.pb.collection("messages").getList(page, perPage, {
        filter: `roomId = "${id}"`,
        sort: "-created",
        expand: "userId",
      });

      return {
        status: 200,
        message: "Success",
        payload: {
          messages: {
            totalItems: messages.totalItems,
            page: messages.page,
            totalPages: messages.totalPages,
            perPage: messages.perPage,
            items: messages.items
              .map((message) => {
                return {
                  ...message,
                  user: message.expand?.userId || { name: "<malformed>" },
                };
              })
              .reverse(),
          },
        },
      };
    } catch (err) {
      locals.logger.error(err);

      return { status: 500, message: "Failed to load messages", payload: null };
    }
  },
  message: async ({ request, locals }) => {
    if (!locals.user) {
      return {
        status: 401,
        message: "Method not allowed",
        payload: null,
      };
    }

    const formData = await request.formData();
    const userId = formData.get("userId")?.toString();
    const roomId = formData.get("roomId")?.toString();
    let content = formData.get("content")?.toString();

    if (!userId || !roomId || !content) {
      return {
        status: 400,
        message: "Missing required fields",
        payload: null,
      };
    }

    content = content
      .replace(/[<>\\]/g, (char) => {
        const replacements = {
          "<": "&lt;",
          ">": "&gt;",
          "\\": "&#92;",
        };
        return replacements[char as keyof typeof replacements];
      })
      .replace(
        /(?<![\\])\[(.*?)\]/g,
        '<a href="$1" class="underline" target="_blank" rel="noopener noreferrer">$1</a>',
      )
      .replace(/(?<![\\])\*(.*?)(?<![\\])\*/g, "<strong>$1</strong>")
      .replace(/(?<![\\])_(.*?)(?<![\\])_/g, "<em>$1</em>")
      .replace(/(?<![\\])~(.*?)(?<![\\])~/g, "<del>$1</del>")
      .replace(/(?<![\\])__(.*?)(?<![\\])__/g, "<u>$1</u>")
      .replace(/\\\*/g, "*")
      .replace(/\\_/g, "_")
      .replace(/\\~/g, "~")
      .replace(/\\__/g, "__")
      .replace(/\\\[/g, "[")
      .replace(/\\\]/g, "]");

    try {
      const message = await locals.pb.collection("messages").create({
        userId,
        roomId,
        content,
      });

      const encoder = new TextEncoder();
      const passwordData = encoder.encode(env.POCKETBASE_SUPERUSER_PASSWORD || "");
      const serverTokenBuffer = await crypto.subtle.digest("SHA-256", passwordData);
      const serverToken = Array.from(new Uint8Array(serverTokenBuffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      socket.emit("send_message", {
        roomId,
        userId,
        content,
        created: new Date().toISOString(),
        token: serverToken,
      });

      return {
        status: 200,
        message: "Message sent successfully",
        payload: { message },
      };
    } catch (err) {
      locals.logger.error(err);

      return { status: 500, message: "Failed to send message", payload: null };
    }
  },
};
