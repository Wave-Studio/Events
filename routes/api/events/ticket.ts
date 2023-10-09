import { Handlers } from "$fresh/server.ts";
import {
  Event,
  getUser,
  kv,
  PlanMaxEvents,
  Roles,
  User,
} from "@/utils/db/kv.ts";
import * as Yup from "yup";

export const handler: Handlers = {
  async POST(req) {
    const { eventID, email } = await req.json();

    try {
      Yup.string().email().validateSync(email);
    } catch {
      return new Response(JSON.stringify({ error: "Invalid email" }), {
        status: 400,
      });
    }

    const event = await kv.get<Event>(["event", eventID]);

    if (event.value == undefined) {
      return new Response(JSON.stringify({ error: "Unknown event" }), {
        status: 400,
      });
    }

    if (event.value.maxTickets ?? 75 >= event.value.soldTickets) {
      return new Response(JSON.stringify({ error: "Sold out" }), {
        status: 400,
      });
    }

    const eventUser = await kv.get<User>(["user", btoa(email)]);

	const user = eventUser.value ?? {
		onboarded: false,
		tickets: [],
	}

	if (user.tickets.map((t) => t.split("_")[0]).includes(eventID) && event.value.multiPurchase) {
	  return new Response(JSON.stringify({ error: "Already purchased" }), {
		status: 400,
	  });
	}

    return new Response(JSON.stringify({ error: "Unknown error occured" }), {
      status: 400,
    });
  },
};
