import { isValidUsername, isValidPassword } from "$lib/utils";
import type { PageServerLoad, Actions } from "./$types";
import { redirect, fail } from "@sveltejs/kit";
import * as auth from "$lib/server/auth";
import { verify } from "@node-rs/argon2";
import { db } from "$lib/server/db";

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.session) {
    return redirect(302, "/new");
  }
  return {};
};

export const actions: Actions = {
  "sign-in": async (event) => {
    const formData = await event.request.formData();
    const username = formData.get("username");
    const password = formData.get("password");

    if (!username || !password || typeof username !== "string" || typeof password !== "string") {
      return fail(400, { message: "Username and password are required and must be strings" });
    }

    if (!isValidUsername(username) || !isValidPassword(password)) {
      return fail(400, {
        message: "Incorrect username and/or password",
      });
    }

    try {
      const user = await db.query.user.findFirst({
        where: (table, { eq }) => eq(table.username, username),
      });

      if (!user) {
        return fail(400, { message: "Incorrect username and/or password" });
      }

      const isValidPassword = await verify(user.passwordHash, password, {
        memoryCost: 19456,
        timeCost: 2,
      });

      if (!isValidPassword) {
        return fail(400, { message: "Incorrect username and/or password" });
      }

      const token = auth.generateSessionToken();
      const session = await auth.createSession(token, user.id);

      auth.setSessionTokenCookie(event, token, session.expiresAt);
    } catch (err) {
      console.log("[! /sign-in] =>", err);
      return fail(500, { message: "Oops...something went wrong" });
    }

    return redirect(302, "/new");
  },
};
