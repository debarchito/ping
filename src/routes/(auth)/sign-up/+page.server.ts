import { isValidName, isValidPassword } from "$lib/utils";
import type { PageServerLoad, Actions } from "./$types";
import { redirect, fail } from "@sveltejs/kit";
import isEmail from "validator/lib/isEmail";

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.user) {
    return redirect(302, "/rooms");
  }

  return {};
};

export const actions: Actions = {
  "sign-up": async (event) => {
    if (event.locals.user) {
      return fail(405, { message: "Method Not Allowed" });
    }

    const formData = await event.request.formData();
    const email = formData.get("email");
    const username = formData.get("username");
    const password = formData.get("password");

    if (
      !email ||
      !username ||
      !password ||
      typeof email !== "string" ||
      typeof username !== "string" ||
      typeof password !== "string"
    ) {
      return fail(400, {
        message: "Email, username and password are required and must be strings",
      });
    }

    if (!isEmail(email)) {
      return fail(400, {
        message: "Invalid email",
      });
    }

    if (!isValidName(username)) {
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
      await event.locals.pb.collection("users").create({
        name: username,
        password,
        passwordConfirm: password,
        email,
      });
      await event.locals.pb.collection("users").authWithPassword(email, password);
    } catch (err: unknown) {
      console.log("[! /sign-up] =>", err);
      if (typeof err === "object" && err !== null && "status" in err && err.status === 400) {
        return fail(400, { message: "Invalid credentials" });
      }
      return fail(500, { message: "Oops...something went wrong" });
    }

    return redirect(307, "/rooms");
  },
};
