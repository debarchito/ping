import type { PageServerLoad, Actions } from "./$types";
import { redirect, fail } from "@sveltejs/kit";
import { isValidPassword } from "$lib/utils";
import isEmail from "validator/lib/isEmail";

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.user) {
    return redirect(307, "/rooms");
  }

  return {};
};

export const actions: Actions = {
  "sign-in": async ({ locals, request }) => {
    if (locals.user) {
      return fail(405, { message: "Method Not Allowed" });
    }

    const formData = await request.formData();
    const email = formData.get("email")?.toString() || "";
    const password = formData.get("password")?.toString() || "";

    if (!isEmail(email) || !isValidPassword(password)) {
      return fail(400, { message: "Invalid credentials" });
    }

    try {
      await locals.pb.collection("users").authWithPassword(email, password);
    } catch (err) {
      console.log("[! /sign-in] =>", err);
      return fail(400, { message: "Invalid credentials" });
    }

    return redirect(307, "/rooms");
  },
};
