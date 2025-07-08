import {
  isValidName,
  isValidDisplayName,
  isValidRoomDescription,
  redirectToMeOnSignIn,
} from "$lib/utils";
import type { PageServerLoad, Actions } from "./$types";
import { redirect, fail } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ locals, url }) => {
  if (!locals.user) {
    return redirect(307, redirectToMeOnSignIn(url));
  }

  return {};
};

export const actions: Actions = {
  default: async ({ locals, request }) => {
    if (!locals.user) {
      return fail(405, { message: "Method not allowed." });
    }

    const formData = await request.formData();
    const name = formData.get("name")?.toString() || "";
    const displayName = formData.get("displayName")?.toString() || "";
    const description = formData.get("description")?.toString() || "";
    let roomId: string;

    if (!isValidName(name)) {
      return fail(401, {
        message: "Room name must be between 3 to 64 chars and only use a-z, 0-9, _ or -.",
      });
    }

    if (displayName && !isValidDisplayName(displayName)) {
      return fail(401, {
        message: "Display name must be between 3 to 64 chars.",
      });
    }

    if (description && !isValidRoomDescription(description)) {
      return fail(401, {
        message: "Room description must be between 1 to 200 chars.",
      });
    }

    try {
      const room = await locals.pb.collection("rooms").create({
        userId: locals.user.id,
        name,
        displayName,
        description,
      });

      roomId = room.id;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      locals.logger.error(err);

      if (err?.status === 400 && err?.data?.data?.name?.code === "validation_not_unique") {
        return fail(401, { message: "A room with this name already exists." });
      }

      return fail(500, { message: "An unexpected error occurred. Please try again later." });
    }

    return redirect(307, `/room/r/${roomId}`);
  },
};
