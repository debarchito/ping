import { text, json, type Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
import { env } from "$env/dynamic/private";
import PocketBase from "pocketbase";
import pretty from "pino-pretty";
import pino from "pino";

function isFormContentType(request: Request) {
  return ["application/x-www-form-urlencoded", "multipart/form-data", "text/plain"].includes(
    request.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase() ?? "",
  );
}

function csrf(allowedPaths: string[] = [], allowedOrigins: string[] = []): Handle {
  return async ({ event, resolve }) => {
    const { request, url } = event;
    const requestOrigin = request.headers.get("origin");
    const isSameOrigin = requestOrigin === url.origin;
    const isAllowedOrigin = allowedOrigins.includes(requestOrigin ?? "");
    const forbidden =
      isFormContentType(request) &&
      ["POST", "PUT", "PATCH", "DELETE"].includes(request.method) &&
      !isSameOrigin &&
      !isAllowedOrigin &&
      !allowedPaths.includes(url.pathname);

    if (forbidden) {
      const message = `Cross-site ${request.method} form submissions are forbidden`;

      if (request.headers.get("accept") === "application/json") {
        return json({ message }, { status: 403 });
      }

      return text(message, { status: 403 });
    }

    return resolve(event);
  };
}

function pocketbase(): Handle {
  return async ({ event, resolve }) => {
    event.locals.pb = new PocketBase(env.POCKETBASE_URL);
    event.locals.pb.authStore.loadFromCookie(event.request.headers.get("cookie") || "");
    event.locals.logger = pino(pretty({ colorize: true }));

    try {
      if (event.locals.pb.authStore.isValid) {
        await event.locals.pb.collection("users").authRefresh();
        event.locals.user = structuredClone(event.locals.pb.authStore.record);
      }
    } catch {
      event.locals.pb.authStore.clear();
      event.locals.user = null;
    }

    const response = await resolve(event);

    response.headers.set(
      "set-cookie",
      event.locals.pb.authStore.exportToCookie({
        secure: true,
        sameSite: "lax",
        path: "/",
      }),
    );

    return response;
  };
}

export const handle: Handle = sequence(csrf(), pocketbase());
