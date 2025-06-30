import { isValidName, redirectToMeOnSignIn } from "$lib/utils";
import type { PageServerLoad, Actions } from "./$types";
import { redirect, fail } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ locals, url }) => {
  if (!locals.user) {
    return redirect(307, redirectToMeOnSignIn(url));
  }

  return {};
};

export const actions: Actions = {
  "create-room": async ({ locals, request }) => {
    if (!locals.user) {
      return fail(405, { message: "Method Not Allowed" });
    }

    const formData = await request.formData();
    const roomname = formData.get("roomname")?.toString() || "";
    const roomDescription = formData.get("room-description")?.toString() || "";
    let roomId: string;

    if (!isValidName(roomname)) {
      return fail(400, {
        message: "Room name must be 3 to 64 chars and only use a-z, 0-9, _ or -",
      });
    }

    if (!(roomDescription.length >= 1 && roomDescription.length <= 200)) {
      return fail(400, {
        message: "Room description can be at most 200 chars",
      });
    }

    try {
      const existingRoom = await locals.pb.collection("rooms").getList(1, 1, {
        filter: `name = "${roomname}"`,
      });

      if (existingRoom.items.length > 0) {
        return fail(400, { message: "A room with this name already exists" });
      }

      const room = await locals.pb.collection("rooms").create({
        userId: locals.user.id,
        name: roomname,
        description: roomDescription,
      });

      roomId = room.id;
    } catch (err) {
      console.log("[! /room/create] =>", err);
      return fail(500, { message: "Oops...something went wrong" });
    }

    return redirect(307, `/room/r/${roomId}`);
  },
};
