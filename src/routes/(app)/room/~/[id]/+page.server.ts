import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url, locals }) => {
  const id = url.pathname.split("/").pop() || "";
  console.log(id);

  try {
    await locals.pb.collection("rooms").getOne(id);
    return { status: 200, message: "Success", payload: {} };
  } catch (err) {
    console.log("[ /room/id] =>", err);
    return { status: 404, message: "Not Found", payload: null };
  }
};
