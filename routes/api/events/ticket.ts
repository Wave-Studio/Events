import { Handlers } from "$fresh/server.ts";
import { Event, kv, User, getUserAuthToken } from "@/utils/db/kv.ts";
import * as Yup from "yup";

export const handler: Handlers = {
  async POST(req) {
    const { eventID, email, showtimeID, fieldData, firstName, lastName } =
      await req.json();

    const basicParamValidation = Yup.object({
      eventID: Yup.string().uuid().required(),
      email: Yup.string().email().required(),
      showtimeID: Yup.string().uuid().required(),
      firstName: Yup.string().required().min(1),
      lastName: Yup.string().required().min(1),
    });

    try {
      basicParamValidation.validateSync({
        eventID,
        email,
        showtimeID,
        firstName,
        lastName,
      });
    } catch {
      return new Response(JSON.stringify({ error: "Invalid parameters" }), {
        status: 400,
      });
    }

    try {
      JSON.parse(fieldData);

      if (!Array.isArray(JSON.parse(fieldData))) {
        throw new Error();
      }
    } catch {
      return new Response(JSON.stringify({ error: "Invalid field data" }), {
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

    if (user.onboarded) {
      const authToken = getUserAuthToken(req);

      if (authToken != user.authToken) {
        if (authToken == undefined) {
          return new Response(
            JSON.stringify({
              error: "You must log in to register for this event!",
            }),
            {
              status: 400,
            },
          );
        } else {
          return new Response(
            JSON.stringify({
              error:
                "You are not logged in as the user you are trying to register for!",
            }),
            {
              status: 400,
            },
          );
        }
      }
    }

    if (
      user.tickets
        .map((t) => t.substring(0, t.lastIndexOf("_")))
        .includes(`${eventID}_${showtimeID}`) &&
      !showtime.multiPurchase
    ) {
      return new Response(JSON.stringify({ error: "Already purchased" }), {
        status: 400,
      });
    }

    const ticket = `${eventID}_${showtimeID}_${crypto.randomUUID()}`;

    await kv
      .atomic()
      .set(["user", email], {
        ...user,
        tickets: [...user.tickets, ticket],
      })
      .set(["event", eventID], {
        ...event.value,
        showTimes: event.value.showTimes.map((s) => {
          if (s.id === showtimeID) {
            return {
              ...s,
              soldTickets: s.soldTickets + 1,
            };
          }

          return s;
        }),
      })
      .set(["ticket", eventID, showtimeID, ticket], {
        hasBeenUsed: false,
        userEmail: email,
        firstName,
        lastName,
        fieldData: JSON.parse(fieldData),
      })
      .commit();

    return new Response(JSON.stringify({ ticket }), {
      status: 200,
    });
  },
};
