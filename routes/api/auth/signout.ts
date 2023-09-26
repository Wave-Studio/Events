import { Handlers } from "$fresh/server.ts";
import { deleteCookie } from "$std/http/cookie.ts";

export const handler: Handlers = {
  GET(req, _ctx) {
    const resp = new Response(JSON.stringify({ "status": 200 }), {
      status: 204,
    });
    deleteCookie(req.headers, "authToken");

    return resp;
  },
};
