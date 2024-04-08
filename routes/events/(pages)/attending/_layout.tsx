import { defineLayout, RouteContext } from "$fresh/server.ts";
import { Event, getUser, kv, ShowTime, Ticket, User } from "@/utils/db/kv.ts";

export default defineLayout(
  async (req: Request, ctx: RouteContext<void, TicketContext>) => {
    const organizingTabs = ["upcoming", "past"];
    const url = new URL(req.url);
    const tabName = url.pathname.split("/")[3] ?? "upcoming";
    const user = await getUser(req);

    if (user == undefined) {
      return new Response(undefined, {
        headers: {
          Location: "/login",
        },
        status: 307,
      });
    }

    const eventsToFetch: string[] = [];

    for (const ticket of user.tickets) {
      if (!eventsToFetch.includes(ticket.split("_")[0])) {
        eventsToFetch.push(ticket.split("_")[0]);
      }
    }

    const events = await kv.getMany<Event[]>(
      eventsToFetch.map((id) => ["event", id]),
    );

    const tickets: TicketContext["data"]["tickets"] = [];

    for (const ticket of user.tickets) {
      const [eventID, showtimeID, ticketID] = ticket.split("_");
      const event = events.find((e) => e.key[1] === eventID)!.value!;
      const showtime = event.showTimes.find((s) => s.id === showtimeID)!;

      tickets.push({
        eventID,
        ticketID,
        event,
        time: showtime,
      });
    }

    ctx.state.data = {
      user,
      tickets,
    };

    return (
      <>
        <div className="mx-auto gap-4 flex mt-4 overflow-x-auto w-[calc(100vw-2rem)] max-w-max">
          {organizingTabs.map((tab) => (
            <a
              href={tab == "upcoming"
                ? "/events/attending"
                : `/events/attending/${tab}`}
              class={`border-2 rounded-md px-2.5 py-0.5 capitalize ${
                tab == tabName && "font-medium border-theme-normal"
              }`}
            >
              {tab}
            </a>
          ))}
        </div>
        <div className="grow flex flex-col my-4">
          <ctx.Component />
        </div>
      </>
    );
  },
);

export interface TicketContext {
  data: {
    tickets: {
      eventID: string;
      event: Event;
      time: ShowTime;
      ticketID: string;
    }[];
    user: User;
  };
}
