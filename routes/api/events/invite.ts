import { Handlers } from "$fresh/server.ts";
import { Event, getUser, kv } from "@/utils/db/kv.ts";
import { isUUID } from "@/utils/db/misc.ts";
import { FullEventValidation } from "@/utils/types/events.ts";

export const handler: Handlers = {
  async POST(req, _ctx) {
    const user = await getUser(req);
    if (!user) {
      return new Response(JSON.stringify({ error: "Not logged in" }), {
        status: 401,
      });
    }

    const {
      eventID,
    }: { eventID: string } = await req.json();

    if (!isUUID(eventID)) {
      return new Response(JSON.stringify({ error: "Invalid UUID" }), {
        status: 400,
      });
    }

    // this is likley all posible in one request using atomic transactions
    // but my pretty basic knowlegde of how they work has convinced me it's
    // not worth figuring out -LS

    const event = await kv.get<Event>(["event", eventID]);


	
    const res = await kv.set(["event", eventID], combinedEvent);

    return new Response(JSON.stringify({ success: res.ok }), {
      status: 200,
    });
  },
};
