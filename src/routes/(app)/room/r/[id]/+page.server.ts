import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url, locals }) => {
  const id = url.pathname.split("/").pop() || "";

  try {
    const room = await locals.pb.collection("rooms").getOne(id);
    const messages = await locals.pb.collection("messages").getList(1, 10, {
      filter: `roomId = "${id}"`,
      sort: "-created",
      expand: "userId",
    });

    return {
      status: 200,
      message: "Success",
      payload: {
        user: locals.user,
        room,
        messages: {
          items: messages.items.map((message) => {
            return {
              ...message,
              user: message.expand?.userId || { name: "Unknown User" },
            };
          }),
        },
      },
    };
  } catch (err) {
    console.log("[ /room/id] =>", err);
    return { status: 404, message: "Not Found", payload: null };
  }
};
