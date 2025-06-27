import { isValidUsername, isValidPassword } from "$lib/utils";
import type { PageServerLoad, Actions } from "./$types";
import { redirect, fail } from "@sveltejs/kit";
import isEmail from "validator/lib/isEmail";

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.user) {
    return redirect(302, "/room");
  }

  return {};
};

export const actions: Actions = {
  "sign-in": async (event) => {
    if (event.locals.user) {
      return fail(405, { message: "Method Not Allowed" });
    }

    const formData = await event.request.formData();
    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || !password || typeof email !== "string" || typeof password !== "string") {
      return fail(400, { message: "Username and password are required and must be strings" });
    }

    if (!isEmail(email) || !isValidPassword(password)) {
      return fail(400, {
        message: "Invalid credentials",
      });
    }

    try {
      await event.locals.pb.collection("users").authWithPassword(email, password);
    } catch (err) {
      console.log("[! /sign-in] =>", err);
      return fail(400, { message: "Invalid credentials" });
    }

    return redirect(307, "/room");
  },
};
