import type { PageServerLoad, Actions } from "./$types";
import { redirect, fail } from "@sveltejs/kit";
import { isValidPassword } from "$lib/utils";
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
    const email = formData.get("email")?.toString() || "";
    const password = formData.get("password")?.toString() || "";

    if (!isEmail(email) || !isValidPassword(password)) {
      return fail(401, { message: "Invalid credentials." });
    }

    try {
      await locals.pb.collection("users").authWithPassword(email, password);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      locals.logger.error(err);

      if (err?.status === 400 && err?.data?.message === "Failed to authenticate.") {
        return fail(401, { message: "Invalid credentials." });
      }

      return fail(500, { message: "An unexpected error occurred. Please try again later." });
    }

    const redirectTo = url.searchParams.get("redirect-to");
    if (redirectTo) return redirect(307, `/${redirectTo.slice(1)}`);
    return redirect(307, "/room/list");
  },
};
