import { Handlers } from "$fresh/server.ts";
import {
  Event,
  Roles,
  User,
  getUser,
  kv,
  PlanMaxEvents,
} from "@/utils/db/kv.ts";
import * as Yup from "yup";

const dateTransformer = (_: undefined, originalValue: string) => {
  const date = new Date(originalValue);

  if (isNaN(date.getTime())) {
    return undefined;
  }

  return date;
};

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
        startDate: Yup.date().transform(dateTransformer).required(),
        startTime: Yup.date().transform(dateTransformer),
        endTime: Yup.date().transform(dateTransformer),
        lastPurchaseDate: Yup.date().transform(dateTransformer),
        id: Yup.string().uuid().required(),
      }),
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
      }),
    ),
  price: Yup.number().required(),

  soldTickets: Yup.number().required(),
  owner: Yup.string().max(200),
  published: Yup.boolean().required(),
});

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

    if (!user) {
      return new Response(JSON.stringify({ error: "Not logged in" }), {
        status: 401,
      });
    }

    // Will prob be modified if we do support purchasing more event slots - Bloxs
    if (user.events.length >= PlanMaxEvents[user.plan] && Deno.env.get("DENO_DEPLOYMENT_ID") != undefined) {
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
      validation.validateSync(event, { strict: false });
    } catch (e) {
      return new Response(JSON.stringify(e), {
        status: 400,
      });
    }

    // I feel like this may not be the best way to do this
    // for some reason when using atoimic transatcions, it sets the user object to version 2, idk why
    // const response = await kv
    //   .atomic()
    //   .set(["event", eventID], {
    //     ...event,
    //     members: [{ email: user.email, role: Roles.OWNER }],
    //   } as Event)
    //   .set(["user", user.email], {
    //     ...user,
    //     events: [...user.events, eventID],
    //   } as User)
    //   .commit();

    // if (response.ok) {
    //   return new Response(JSON.stringify({ success: true, eventID }), {
    //     status: 200,
    //   });
    // }

    const response = await Promise.all([
      await kv.set(["event", eventID], {
        ...event,
        members: [{ email: user.email, role: Roles.OWNER }],
      } as Event),

      await kv.set(["user", btoa(user.email)], {
        ...user,
        events: [...user.events, eventID],
      } as User),
    ]);



		if (response.every(res => res.ok)) {
			return new Response(
				JSON.stringify({ success: true, eventID }),
				{
					status: 200,
				}
			);
		}

    return new Response(JSON.stringify({ error: "Unknown error occured" }), {
      status: 400,
    });
  },
};
