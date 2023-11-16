import { Handlers } from "$fresh/server.ts";
import {
  Event,
  getUser,
  getUserAuthToken,
  kv,
  Roles,
  User,
  Plan,
} from "@/utils/db/kv.ts";
import * as Yup from "yup";
import { EventRegisterError } from "@/utils/event/register.ts";

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
      fieldData: Yup.array().required(),
    });

    try {
      basicParamValidation.validateSync(
        {
          eventID,
          email,
          showtimeID,
          firstName,
          lastName,
          fieldData,
        },
        {
          strict: true,
        },
      );
    } catch (e) {
      return new Response(
        JSON.stringify({
          error: { message: e.message, code: EventRegisterError.OTHER },
        }),
        {
          status: 400,
        },
      );
    }

    const event = await kv.get<Event>(["event", eventID]);

    if (event.value == undefined) {
      return new Response(
        JSON.stringify({
          error: {
            message: "Unknown event",
            code: EventRegisterError.TO_HOMEPAGE,
          },
        }),
        {
          status: 400,
        },
      );
    }

    const showtime = event.value.showTimes.find((s) => s.id === showtimeID);

    if (showtime == undefined) {
      return new Response(
        JSON.stringify({
          error: {
            message: "Unknown showtime",
            code: EventRegisterError.RELOAD,
          },
        }),
        {
          status: 400,
        },
      );
    }

    if (showtime.lastPurchaseDate != undefined) {
      const lastPurchaseDate = new Date(showtime.lastPurchaseDate).valueOf();

      if (lastPurchaseDate < Date.now()) {
        return new Response(
          JSON.stringify({
            error: {
              message: "The registration window for this event time has ended",
              code: EventRegisterError.RELOAD,
            },
          }),
          {
            status: 400,
          },
        );
      }
    }

    if (showtime.soldTickets >= (showtime.maxTickets ?? 75)) {
      return new Response(
        JSON.stringify({
          error: {
            message: "This event time is sold out",
            code: EventRegisterError.OTHER,
          },
        }),
        {
          status: 400,
        },
      );
    }

    const eventUser = await kv.get<User>(["user", email]);

    const user =
      eventUser.value ??
      ({
        onboarded: false,
        tickets: [],
        events: [],
        plan: Plan.BASIC,
        email,
      } satisfies User);

    if (user.onboarded) {
      const authToken = getUserAuthToken(req);

      if (authToken != user.authToken) {
        if (authToken == undefined) {
          return new Response(
            JSON.stringify({
              error: {
                message: "You must log in to register for this event!",
                code: EventRegisterError.PREVIOUSLY_LOGGED_IN,
              },
            }),
            {
              status: 400,
            },
          );
        } else {
          const loggedInUser = await getUser(req);

          const organizer = event.value.members.find(
            (m) => m.email == loggedInUser?.email,
          );

          if (
            organizer == undefined ||
            ![Roles.OWNER, Roles.ADMIN, Roles.MANAGER, Roles.SCANNER].includes(
              organizer.role,
            ) ||
            loggedInUser == undefined
          ) {
            return new Response(
              JSON.stringify({
                error: {
                  message:
                    "You are not logged in as the user you are trying to register for",
                  code: EventRegisterError.PURCHASED_NOT_LOGGED_IN,
                },
              }),
              {
                status: 400,
              },
            );
          }
        }
      }
    }

    if (
      user.tickets
        .map((t) => t.substring(0, t.lastIndexOf("_")))
        .includes(`${eventID}_${showtimeID}`) &&
      !showtime.multiPurchase
    ) {
      return new Response(
        JSON.stringify({
          error: {
            message: "Already purchased",
            code: EventRegisterError.PURCHASED,
          },
        }),
        {
          status: 400,
        },
      );
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
        fieldData: fieldData,
      })
      .commit();

    return new Response(JSON.stringify({ ticket }), {
      status: 200,
    });
  },
};
