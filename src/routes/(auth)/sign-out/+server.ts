import type { RequestHandler } from "./$types";
import { redirect } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ locals }) => {
  if (!locals.user) {
    return redirect(307, "/sign-in");
  }

  locals.pb.authStore.clear();
  locals.user = null;

  return redirect(307, "/sign-in");
};

export const GET: RequestHandler = POST;
