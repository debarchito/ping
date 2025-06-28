import type { PageServerLoad, Actions } from "./$types";
import { redirect, fail } from "@sveltejs/kit";
import { isValidPassword } from "$lib/utils";
import isEmail from "validator/lib/isEmail";

export const load: PageServerLoad = async ({ locals, url }) => {
  if (locals.user) {
    const redirectTo = url.searchParams.get("redirectTo");
    if (redirectTo) return redirect(307, `/${redirectTo.slice(1)}`);
    return redirect(307, "/rooms");
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

    const redirectTo = url.searchParams.get("redirectTo");
    if (redirectTo) return redirect(307, `/${redirectTo.slice(1)}`);
    return redirect(307, "/rooms");
  },
};
