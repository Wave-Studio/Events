import { Handlers } from "$fresh/server.ts";
import { Event, getUser, kv, Roles } from "@/utils/db/kv.ts";
import * as Yup from "yup";
import { EventRegisterError } from "@/utils/event/register.ts";
import { sendEmail } from "@/utils/email/client.ts";

const ticketHTML = await Deno.readTextFile(`${Deno.cwd()}/out/event.html`);

export const handler: Handlers = {
  async POST(req) {
    const {
      eventID,
      email,
      showtimeID,
      fieldData,
      firstName,
      lastName,
      tickets,
    }: {
      eventID: string;
      email: string;
      showtimeID: string;
      fieldData: { id: string; value: string }[];
      firstName: string;
      lastName: string;
      tickets: number;
    } = await req.json();

    const url = new URL(req.url);

    const basicParamValidation = Yup.object({
      eventID: Yup.string().uuid().required(),
      email: Yup.string().email().required(),
      showtimeID: Yup.string().uuid().required(),
      firstName: Yup.string().required().min(1),
      lastName: Yup.string().required().min(1),
      fieldData: Yup.array().required(),
      tickets: Yup.number().required().min(1).max(10),
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
          tickets,
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

    if (
      fieldData.length != event.value.additionalFields.length ||
      fieldData
        .map((f) => f.id)
        .some(
          (id) => !event.value.additionalFields.map((f) => f.id).includes(id),
        )
    ) {
      return new Response(
        JSON.stringify({
          error: {
            message: "Invalid field data",
            code: EventRegisterError.OTHER,
          },
        }),
        {
          status: 400,
        },
      );
    }

    for (const field of event.value.additionalFields) {
      if (
        fieldData.find((f) => f.id === field.id)?.value == undefined &&
        (field.required ?? true) == true
      ) {
        return new Response(
          JSON.stringify({
            error: {
              message: "Missing required field",
              code: EventRegisterError.OTHER,
            },
          }),
          {
            status: 400,
          },
        );
      }

      if (fieldData.find((f) => f.id === field.id)?.value == undefined) {
        continue;
      }

      const value = fieldData.find((f) => f.id === field.id);

      const defaultYupSchema = {
        id: Yup.string().uuid().required(),
      };

      let schema = Yup.object({
        ...defaultYupSchema,
      });

      switch (field.type) {
        case "text": {
          schema = Yup.object({
            ...defaultYupSchema,
            value: Yup.string().required(),
          });

          break;
        }

        case "toggle": {
          schema = Yup.object({
            ...defaultYupSchema,
            value: Yup.boolean().nonNullable(),
          });

          break;
        }

        case "email": {
          schema = Yup.object({
            ...defaultYupSchema,
            value: Yup.string().email().required(),
          });

          break;
        }

        case "number": {
          schema = Yup.object({
            ...defaultYupSchema,
            value: Yup.number().required(),
          });

          break;
        }
      }

      try {
        schema.validateSync(value, { strict: true });
      } catch (e) {
        return new Response(
          JSON.stringify({
            error: {
              message: e.message,
              code: EventRegisterError.OTHER,
            },
          }),
          {
            status: 400,
          },
        );
      }
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

    const user = await getUser(req);

    if (!user) {
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
    }

    const organizer = event.value.members.find((m) => m.email == user.email);

    if (
      !(user.email === email) &&
      (organizer == undefined ||
        ![Roles.OWNER, Roles.ADMIN, Roles.MANAGER, Roles.SCANNER].includes(
          organizer.role,
        ))
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

    if (
      user.tickets
        .map((t) => t.substring(0, t.lastIndexOf("_")))
        .includes(`${eventID}_${showtimeID}`) 
        //&& !showtime.multiPurchase
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

    const ticketID = crypto.randomUUID();
    const ticket = `${eventID}_${showtimeID}_${ticketID}`;

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
        tickets,
        uses: 0,
      })
      .commit();

    // jank
    // I should probably abstract this
    // this probably has like some code injection issue too

    const emailHTML = ticketHTML
      .replace("{{TICKETS}}", tickets.toString())
      .replaceAll("{{QR-VALUE}}", `https://events.deno.dev/api/qr?ticket=${eventID}_${showtimeID}_${ticketID}`)
      .replace(
        "{{TICKET-LINK}}",
        `${url.protocol}//${url.host}/events/${eventID}/tickets/${ticketID}?s=${showtimeID}`,
      )
      .replace(
        "{{EVENT-LINK}}",
        `${url.protocol}//${url.host}/events/${eventID}`,
      )
      .replaceAll("{{EVENT-NAME}}", event.value.name);

    await sendEmail([user.email], `Your Tickets for ${event.value.name}!`, {
      html: emailHTML,
      fallback: `View your ticket at ${url.protocol}//${url.host}/events/${eventID}/tickets/${ticketID}?s=${showtimeID}`,
    });

    return new Response(JSON.stringify({ ticket }), {
      status: 200,
    });
  },
};
