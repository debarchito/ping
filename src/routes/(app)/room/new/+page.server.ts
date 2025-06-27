import type { PageServerLoad, Actions } from "./$types";
import { redirect, fail } from "@sveltejs/kit";
import { isValidName } from "$lib/utils";

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) {
    return redirect(307, "/sign-in");
  }

  return {};
};

export const actions: Actions = {
  "create-room": async (event) => {
    if (!event.locals.user) {
      return fail(403, { message: "Method Not Allowed" });
    }

    const formData = await event.request.formData();
    const roomname = formData.get("roomname");
    const roomDescription = formData.get("room-description");
    let roomId: string;

    if (
      !roomname ||
      !roomDescription ||
      typeof roomname !== "string" ||
      typeof roomDescription !== "string"
    ) {
      return fail(400, { message: "Roomname and room description required and must be strings" });
    }

    if (!isValidName(roomname)) {
      return fail(400, {
        message: "Roomname must be 3 to 64 chars",
      });
    }

    if (!(roomDescription.length <= 200)) {
      return fail(400, {
        message: "Room description can be at most 200 chars",
      });
    }

    try {
      const existingRooms = await event.locals.pb.collection("rooms").getList(1, 1, {
        filter: `name = "${roomname}"`,
      });

      if (existingRooms.items.length > 0) {
        return fail(400, { message: "A room with this roomname already exists" });
      }

      const room = await event.locals.pb.collection("rooms").create({
        userId: event.locals.user.id,
        name: roomname,
        description: roomDescription,
      });

      roomId = room.id;
    } catch (err) {
      console.log("[! /room/new] =>", err);
      return fail(500, { message: "Oops...something went wrong" });
    }

    return redirect(307, `/room/${roomId}`);
  },
};
