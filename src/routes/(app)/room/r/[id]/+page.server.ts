import type { PageServerLoad, Actions } from "./$types";

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
          totalItems: messages.totalItems,
          page: messages.page,
          totalPages: messages.totalPages,
          perPage: messages.perPage,
          items: messages.items
            .map((message) => {
              return {
                ...message,
                user: message.expand?.userId || { name: "Unknown User" },
              };
            })
            .reverse(),
        },
      },
    };
  } catch (err) {
    console.log("[ /room/r/[id]] =>", err);
    return { status: 404, message: "Not Found", payload: null };
  }
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const formData = await request.formData();
    const id = formData.get("roomId") as string;
    const page = parseInt(formData.get("page") as string) || 1;
    const perPage = parseInt(formData.get("perPage") as string) || 10;

    try {
      const messages = await locals.pb.collection("messages").getList(page, perPage, {
        filter: `roomId = "${id}"`,
        sort: "-created",
        expand: "userId",
      });

      const a = {
        status: 200,
        message: "Success",
        payload: {
          messages: {
            totalItems: messages.totalItems,
            page: messages.page,
            totalPages: messages.totalPages,
            perPage: messages.perPage,
            items: messages.items
              .map((message) => {
                return {
                  ...message,
                  user: message.expand?.userId || { name: "Unknown User" },
                };
              })
              .reverse(),
          },
        },
      };
      console.log(JSON.stringify(a, null, 2));
      return a;
    } catch (err) {
      console.log("[/room/r/[id]] =>", err);
      return { status: 500, message: "Failed to load messages", payload: null };
    }
  },
};
