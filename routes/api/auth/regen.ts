import { Handlers } from "$fresh/server.ts";
import { deleteCookie } from "$std/http/cookie.ts";
import { generateAuthToken, getUser, getUserAuthToken } from "@/utils/db/kv.ts";

export const handler: Handlers = {
  async GET(req, _ctx) {
    const token = getUserAuthToken(req);

    if (token == undefined) {
      return new Response(JSON.stringify({ error: "Not logged in" }), {
        status: 400,
      });
    }

    const user = await getUser(req);

    if (user == undefined) {
      deleteCookie(req.headers, "authToken");
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 400,
      });
    }

    await generateAuthToken(user.email, true);

    deleteCookie(req.headers, "authToken");

    return new Response(JSON.stringify({ status: 200 }), {
      status: 200,
    });
  },
};
