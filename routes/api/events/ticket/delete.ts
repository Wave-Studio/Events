import { Handlers } from "$fresh/server.ts";
import { Event, getUser, kv, Ticket, User } from "@/utils/db/kv.ts";
import { isTicketUUID } from "@/utils/db/misc.ts";

export const handler: Handlers = {
  async POST(req, _ctx) {
    const user = await getUser(req);
    if (!user) {
      return new Response(JSON.stringify({ error: "Not logged in" }), {
        status: 401,
      });
    }

    const { ticketID }: { ticketID: string } = await req.json();

    if (!isTicketUUID(ticketID)) {
      return new Response(JSON.stringify({ error: "Invalid UUID" }), {
        status: 400,
      });
    }

    const eventID = ticketID.split("_")[0];
    const showTimeID = ticketID.split("_")[1];

    const [event, ticket] = await kv.getMany<[Event, Ticket]>([[
      "event",
      eventID,
    ], ["ticket", eventID, showTimeID, ticketID]]);

    if (event.value == undefined || ticket.value == undefined) {
      return new Response(JSON.stringify({ error: "Invalid ticket" }), {
        status: 400,
      });
    }

    /** ["ticket", eventId, showtimeId, eventId_showtimeId_ticketId] */
    /** ["user", email] */
    if (
      !event ||
      !event.value ||
      // checks to make sure only ticketholder or managers delete tickets
      (!event.value.members.some((e) => e.email == user.email && e.role <= 2) &&
        !user.tickets.includes(ticketID))
    ) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 400,
      });
    }

    const deletion = await kv
      .atomic()
      .delete(["ticket", eventID, showTimeID, ticketID])
      .set(["user", user.email], {
        ...user,
        tickets: user.tickets.filter((ticket) => ticket !== ticketID),
      } as User)
      .set(["event", eventID], {
        ...event.value,
        showTimes: event.value.showTimes.map((s) => {
          if (s.id === showTimeID) {
            return {
              ...s,
              soldTickets: s.soldTickets - ticket.value.tickets,
            };
          }

          return s;
        }),
      } as Event)
      .commit();

    if (deletion.ok) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
      });
    }

    return new Response(
      JSON.stringify({
        error: "An unknown error occurred while deleting your ticket",
      }),
      {
        status: 400,
      },
    );
  },
};
