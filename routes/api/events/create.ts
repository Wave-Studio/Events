import { Handlers } from "$fresh/server.ts";
import { Event, Roles, User, getUser, kv } from "@/utils/db/kv.ts";
import * as Yup from "yup";

const validation = Yup.object({
  name: Yup.string().min(3).max(75).required(),
  supportEmail: Yup.string().email().required(),
  description: Yup.string().max(1500),
  venue: Yup.string().max(150),

  // temp set to 1 max showtime, will increase with pro plan and future updates
  showTimes: Yup.array()
    .min(1)
    .max(1)
    .required()
    .of(
      Yup.object({
        // 65 is a guess of how long a normal JS date can be
        startDate: Yup.string().max(65).required(),
        startTime: Yup.string().max(65),
        endTime: Yup.string().max(65),
        lastPurchaseDate: Yup.string().max(65),
        id: Yup.string().uuid().required(),
      })
    ),

  multiEntry: Yup.boolean().required(),
  multiPurchase: Yup.boolean().required(),
  maxTickets: Yup.number(),
  additionalFields: Yup.array()
    .min(0)
    .max(12)
    .required()
    .of(
      Yup.object({
        id: Yup.string().uuid().required(),
        name: Yup.string().min(3).max(35),
        description: Yup.string().min(3).max(150),
        type: Yup.string().matches(/^(text|email|number|toggle)$/g),
      })
    ),
  price: Yup.number().required(),

  soldTickets: Yup.number().required(),
  owner: Yup.string().max(200),
  published: Yup.boolean().required(),
});

export const handler: Handlers = {
  async POST(req) {
    const user = await getUser(req);

    if (!user) {
      return new Response(JSON.stringify({ error: "No user found" }), {
        status: 401,
      });
    }

    const event: Event = await req.json();
    // console.log(event)
    const eventID = crypto.randomUUID();

    try {
      validation.validateSync(event);
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

    return new Response(
      JSON.stringify({ error: "Lukas was too lazy to finish this - Bloxs" }),
      {
        status: 400,
      }
    );
  },
};
