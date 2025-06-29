import { isValidName, isValidPassword } from "$lib/utils";
import type { PageServerLoad, Actions } from "./$types";
import { redirect, fail } from "@sveltejs/kit";
import isEmail from "validator/lib/isEmail";

export const load: PageServerLoad = async ({ locals, url }) => {
  if (locals.user) {
    const redirectTo = url.searchParams.get("redirectTo");
    if (redirectTo) return redirect(307, `/${redirectTo.slice(1)}`);
    return redirect(307, "/room/list");
  }

  return {};
};

export const actions: Actions = {
  default: async ({ locals, request, url }) => {
    if (locals.user) {
      return fail(405, { message: "Method Not Allowed" });
    }

    const formData = await request.formData();
    const email = formData.get("email")?.toString() || "";
    const username = formData.get("username")?.toString() || "";
    const password = formData.get("password")?.toString() || "";

    if (!isEmail(email)) {
      return fail(400, { message: "Invalid email format" });
    }

    if (!isValidName(username)) {
      return fail(400, {
        message: "Username must be 3 to 64 chars and only use a-z, 0-9, _ or -",
      });
    }

    if (!isValidPassword(password)) {
      return fail(400, {
        message:
          "Password must be at least 8 chars and include a-z, A-Z, 0-9, and a special character",
      });
    }

    try {
      await locals.pb.collection("users").create({
        name: username,
        password,
        passwordConfirm: password,
        email,
      });

      await locals.pb.collection("users").authWithPassword(email, password);
    } catch (err: unknown) {
      console.log("[! /sign-up] =>", err);
      if (typeof err === "object" && err !== null && "status" in err && err.status === 400) {
        return fail(400, { message: "Unusable credentials" });
      }
      return fail(500, { message: "Oops...something went wrong" });
    }

    const redirectTo = url.searchParams.get("redirectTo");
    if (redirectTo) return redirect(307, `/${redirectTo.slice(1)}`);
    return redirect(307, "/room/list");
  },
};
