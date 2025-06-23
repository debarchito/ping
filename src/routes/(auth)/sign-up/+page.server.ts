import { isValidUsername, isValidPassword } from "$lib/utils";
import type { PageServerLoad, Actions } from "./$types";
import * as table from "$lib/server/db/schema.js";
import { redirect, fail } from "@sveltejs/kit";
import * as auth from "$lib/server/auth";
import { hash } from "@node-rs/argon2";
import { db } from "$lib/server/db";

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.session) {
    return redirect(302, "/room");
  }

  return {};
};

export const actions: Actions = {
  "sign-up": async (event) => {
    if (event.locals.session) {
      return fail(405, { message: "Method Not Allowed" });
    }

    const formData = await event.request.formData();
    const username = formData.get("username");
    const password = formData.get("password");

    if (!username || !password || typeof username !== "string" || typeof password !== "string") {
      return fail(400, { message: "Username and password are required and must be strings" });
    }

    if (!isValidUsername(username)) {
      return fail(400, {
        message: "Username must be 3 to 32 chars and only use a-z, 0-9, _ or -",
      });
    }

    if (!isValidPassword(password)) {
      return fail(400, {
        message:
          "Password must be at least 8 chars and include a-z, A-Z, 0-9, and a special character",
      });
    }

    try {
      const user = await db.query.user.findFirst({
        where: (table, { eq }) => eq(table.username, username),
      });

      if (user) {
        return fail(400, { message: "A user with this username already exists" });
      }

      const userId = auth.generateSessionToken();
      const passwordHash = await hash(password, {
        memoryCost: 19456,
        timeCost: 2,
      });

      await db.insert(table.user).values({
        id: userId,
        username,
        passwordHash,
      });

      const token = auth.generateSessionToken();
      const session = await auth.createSession(token, userId);

      auth.setSessionTokenCookie(event, token, session.expiresAt);
    } catch (err) {
      console.log("[! /sign-up] =>", err);
      return fail(500, { message: "Oops...something went wrong" });
    }

    return redirect(302, "/room");
  },
};
