import { Handlers } from "$fresh/server.ts";
import {
  Event,
  Roles,
  User,
  getUser,
  kv,
  PlanMaxEvents,
} from "@/utils/db/kv.ts";
import { FullEventValidation } from "@/utils/types/events.ts";

const generateEventId = async (): Promise<string> => {
  const id = crypto.randomUUID();

  const event = await kv.get<Event>(["event", id]);

  if (event.value != undefined) {
    return generateEventId();
  }

  return id;
};

export const handler: Handlers = {
  async POST(req) {
    const user = await getUser(req);

    if (user == undefined) {
      return new Response(JSON.stringify({ error: "Not logged in" }), {
        status: 401,
      });
    }

    // Will prob be modified if we do support purchasing more event slots - Bloxs
    if (
      user.events.length >= PlanMaxEvents[user.plan] &&
      Deno.env.get("DENO_DEPLOYMENT_ID") != undefined
    ) {
      return new Response(
        JSON.stringify({
          error: "You have reached the maximum number of events",
        }),
        {
          status: 400,
        },
      );
    }

    const event: Event = await req.json();
    const eventID = await generateEventId();

    try {
      FullEventValidation.validateSync(event, { strict: false });
    } catch (e) {
      return new Response(JSON.stringify(e), {
        status: 400,
      });
    }

    // I feel like this may not be the best way to do this
    const response = await kv
      .atomic()
      .set(["event", eventID], {
        ...event,
        members: [{ email: user.email, role: Roles.OWNER }],
      } as Event)
      // ascii to base64
      .set(["user", user.email], {
        ...user,
        events: [...user.events, eventID],
      } as User)
      .commit();

    if (response.ok) {
      return new Response(JSON.stringify({ success: true, eventID }), {
        status: 200,
      });
    }

    // const response = await Promise.all([
    //   await kv.set(["event", eventID], {
    //     ...event,
    //     members: [{ email: user.email, role: Roles.OWNER }],
    //   } as Event),

    //   await kv.set(["user", btoa(user.email)], {
    //     ...user,
    //     events: [...user.events, eventID],
    //   } as User),
    // ]);

    // if (response.every((res) => res.ok)) {
    //   return new Response(JSON.stringify({ success: true, eventID }), {
    //     status: 200,
    //   });
    // }

    return new Response(JSON.stringify({ error: "Unknown error occurred" }), {
      status: 400,
    });
  },
};
