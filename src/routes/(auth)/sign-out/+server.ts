import type { RequestHandler } from "./$types";
import * as auth from "$lib/server/auth";
import { redirect } from "@sveltejs/kit";

export const DELETE: RequestHandler = async (event) => {
  if (!event.locals.session) {
    return redirect(302, "/sign-in");
  }

  await auth.invalidateSession(event.locals.session.id);
  auth.deleteSessionTokenCookie(event);

  event.locals.user = null;
  event.locals.session = null;

  return redirect(302, "/sign-in");
};

export const GET: RequestHandler = DELETE;
export const POST: RequestHandler = DELETE;
