import { isValidName, isValidPassword } from "$lib/utils";
import type { PageServerLoad, Actions } from "./$types";
import { redirect, fail } from "@sveltejs/kit";
import isEmail from "validator/lib/isEmail";

export const load: PageServerLoad = async ({ locals, url }) => {
  if (locals.user) {
    const redirectTo = url.searchParams.get("redirect-to");
    if (redirectTo) return redirect(307, `/${redirectTo.slice(1)}`);
    return redirect(307, "/room/list");
  }

  return {};
};

export const actions: Actions = {
  default: async ({ locals, request, url }) => {
    if (locals.user) {
      return fail(405, { message: "Method not allowed." });
    }

    const formData = await request.formData();
    const name = formData.get("name")?.toString() || "";
    const email = formData.get("email")?.toString() || "";
    const password = formData.get("password")?.toString() || "";

    if (!isValidName(name)) {
      return fail(401, {
        message: "Username must be 3 to 64 chars and only use a-z, 0-9, _ or -.",
      });
    }

    if (!isEmail(email)) {
      return fail(401, { message: "Invalid email format." });
    }

    if (!isValidPassword(password)) {
      return fail(401, {
        message:
          "Password must be at least 8 chars and include a-z, A-Z, 0-9, and a special character",
      });
    }

    try {
      await locals.pb.collection("users").create({
        name,
        email,
        password,
        passwordConfirm: password,
      });

      await locals.pb.collection("users").authWithPassword(email, password);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      locals.logger.error(err);

      if (err?.status === 400 && err?.data?.message === "Failed to create record.") {
        return fail(401, { message: "Unusable credentials." });
      }

      return fail(500, { message: "An unexpected error occurred. Please try again later." });
    }

    const redirectTo = url.searchParams.get("redirect-to");
    if (redirectTo) return redirect(307, `/${redirectTo.slice(1)}`);
    return redirect(307, "/room/list");
  },
};
