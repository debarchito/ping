import type { PageServerLoad, Actions } from "./$types";
import * as table from "$lib/server/db/schema.js";
import { redirect, fail } from "@sveltejs/kit";
import { isValidRoomname } from "$lib/utils";
import * as auth from "$lib/server/auth";
import { db } from "$lib/server/db";

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.session) {
    return redirect(302, "/sign-in");
  }

  return {};
};

export const actions: Actions = {
  "create-room": async (event) => {
    if (!event.locals.session) {
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

    if (!isValidRoomname(roomname)) {
      return fail(400, {
        message: "Roomname must be 3 to 32 chars",
      });
    }

    if (!(roomDescription.length <= 200)) {
      return fail(400, {
        message: "Room description can be at most 200 chars",
      });
    }

    try {
      const room = await db.query.room.findFirst({
        where: (table, { eq }) => eq(table.roomname, roomname),
      });

      if (room) {
        return fail(400, { message: "A room with this roomname already exists" });
      }

      roomId = auth.generateSessionToken();

      await db.insert(table.room).values({
        id: roomId,
        userId: event.locals.session.userId,
        roomname,
        description: roomDescription,
      });
    } catch (err) {
      console.log("[! /new] =>", err);
      return fail(500, { message: "Oops...something went wrong" });
    }

    return redirect(302, `/room/${roomId}`);
  },
};
