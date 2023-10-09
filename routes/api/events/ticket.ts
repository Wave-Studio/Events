import { Handlers } from "$fresh/server.ts";
import { Event, kv, User } from "@/utils/db/kv.ts";
import { isUUID } from "@/utils/db/misc.ts";
import * as Yup from "yup";

export const handler: Handlers = {
  async POST(req) {
    const { eventID, email, showtimeID } = await req.json();

    try {
      Yup.string().email().validateSync(email);
    } catch {
      return new Response(JSON.stringify({ error: "Invalid email" }), {
        status: 400,
      });
    }

    if (!isUUID(eventID)) {
      return new Response(JSON.stringify({ error: "Invalid event" }), {
        status: 400,
      });
    }

    if (!isUUID(showtimeID)) {
      return new Response(JSON.stringify({ error: "Invalid showtime" }), {
        status: 400,
      });
    }

    const event = await kv.get<Event>(["event", eventID]);

    if (event.value == undefined) {
      return new Response(JSON.stringify({ error: "Unknown event" }), {
        status: 400,
      });
    }

    const showtime = event.value.showTimes.find((s) => s.id === showtimeID);

    if (showtime == undefined) {
      return new Response(JSON.stringify({ error: "Unknown showtime" }), {
        status: 400,
      });
    }

    if (showtime.soldTickets >= (showtime.maxTickets ?? 75)) {
      return new Response(JSON.stringify({ error: "Sold out" }), {
        status: 400,
      });
    }

    const eventUser = await kv.get<User>(["user", email]);

    const user = eventUser.value ?? {
      onboarded: false,
      tickets: [],
    };

    if (
      user.tickets.map((t) => t.substring(0, t.lastIndexOf("_"))).includes(`${eventID}_${showtimeID}`) &&
      !event.value.multiPurchase
    ) {
      return new Response(JSON.stringify({ error: "Already purchased" }), {
        status: 400,
      });
    }

    return new Response(JSON.stringify({ error: "Unknown error occured" }), {
      status: 400,
    });
  },
};
