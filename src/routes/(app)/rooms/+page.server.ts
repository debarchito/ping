import type { PageServerLoad, Actions } from "./$types";

export const load: PageServerLoad = async ({ locals, url }) => {
  const page = Number(url.searchParams.get("p")) || 1;
  const perPage = Number(url.searchParams.get("n")) || 10;
  const search = url.searchParams.get("search") || "";

  const filter = search
    ? `name~"${search}" || displayName~"${search}" || description~"${search}"`
    : "";

  const rooms = await locals.pb.collection("rooms").getList(page, perPage, {
    sort: "-created",
    filter: filter,
  });

  return {
    rooms: rooms.items,
    totalItems: rooms.totalItems,
    totalPages: rooms.totalPages,
    page: rooms.page,
    perPage: rooms.perPage,
    search: search,
  };
};

export const actions: Actions = {
  search: async ({ request, locals, url }) => {
    const data = await request.formData();
    const search =
      data.get("search")?.toString()?.trim()?.replace(/\//g, "\\/").replace(/"/g, `\\"`) || "";

    if (search && (search.length > 100 || search.length < 1)) {
      return {
        status: 400,
        error: "Search query must be between 1 and 100 characters",
      };
    }

    const page = Number(url.searchParams.get("p")) || 1;
    const perPage = Number(url.searchParams.get("n")) || 10;

    const filter = search ? `name~"${search}" || description~"${search}"` : "";
    const rooms = await locals.pb.collection("rooms").getList(page, perPage, {
      sort: "-created",
      filter: filter,
    });

    return {
      rooms: rooms.items,
      totalItems: rooms.totalItems,
      totalPages: rooms.totalPages,
      page: rooms.page,
      perPage: rooms.perPage,
      search: search,
    };
  },
};
