import { Handlers } from "$fresh/server.ts";
import { Event, getUser, kv, Ticket } from "@/utils/db/kv.ts";
import { isUUID } from "@/utils/db/misc.ts";

export const handler: Handlers = {
  async POST(req) {
    const user = await getUser(req);

    if (user == undefined) {
      return new Response(
        JSON.stringify({
          error: {
            message: "You must be logged in to scan tickets for an event",
          },
        }),
        {
          status: 400,
        },
      );
    }

    const {
      eventID,
      ticketID,
      showtimeID,
    }: { eventID: string; ticketID: string; showtimeID?: string } =
      await req.json();

    const event = await kv.get<Event>(["event", eventID]);

    if (event.value == undefined) {
      return new Response(
        JSON.stringify({
          error: {
            message: "Unknown event",
          },
        }),
        {
          status: 400,
        },
      );
    }

    if (event.value.members.find((m) => m.email == user.email) == undefined) {
      return new Response(
        JSON.stringify({
          error: {
            message: "You are not a member of this event",
          },
        }),
        {
          status: 400,
        },
      );
    }

    const isValidTicket = ticketID
      .split("_")
      .map((s) => isUUID(s))
      .includes(false);

    if (!isValidTicket) {
      return new Response(
        JSON.stringify({
          error: {
            message: "Invalid ticket",
          },
        }),
        {
          status: 400,
        },
      );
    }

    const isFullTicket = ticketID.split("_").length == 3;
    const soloTicketID = ticketID.split("_").reverse()[0];
    const showtime = isFullTicket
      ? ticketID.split("_")[1]
      : (showtimeID as string);

    const ticket = await kv.get<Ticket>([
      "ticket",
      eventID,
      showtime,
      `${isFullTicket ? ticketID : `${eventID}_${showtime}_${soloTicketID}`}`,
    ]);

    if (ticket.value == undefined) {
      return new Response(
        JSON.stringify({
          error: {
            message: "Unknown ticket",
          },
        }),
        {
          status: 400,
        },
      );
    }

    const isUsed = ticket.value.hasBeenUsed;

    if (!isUsed) {
      ticket.value.hasBeenUsed = true;
      await kv.set(
        [
          "ticket",
          eventID,
          showtime,
          `${
            isFullTicket ? ticketID : `${eventID}_${showtime}_${soloTicketID}`
          }`,
        ],
        ticket.value,
      );
    }

    return new Response(
      JSON.stringify({
        ...ticket.value,
        hasBeenUsed: isUsed,
      }),
      {
        status: 200,
      },
    );
  },
};
