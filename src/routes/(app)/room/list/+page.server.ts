import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, url }) => {
  const page = Number(url.searchParams.get("p")) || 1;
  const perPage = Number(url.searchParams.get("n")) || 10;
  const search =
    url.searchParams
      .get("search")
      ?.trim()
      ?.replace(/(["\\])/g, "\\$1") || "";

  const filter = search
    ? `name~"${search}" || displayName~"${search}" || description~"${search}"`
    : "";

  const rooms = await locals.pb.collection("rooms").getList(page, perPage, {
    sort: "-created",
    filter: filter,
  });

  return {
    user: locals.user,
    rooms: rooms.items,
    totalItems: rooms.totalItems,
    totalPages: rooms.totalPages,
    page: rooms.page,
    perPage: rooms.perPage,
    search: search,
  };
};
