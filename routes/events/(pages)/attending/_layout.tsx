import { defineLayout, RouteContext } from "$fresh/server.ts";
import { Event, getUser, kv, Ticket, User } from "@/utils/db/kv.ts";

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

    const events = await kv.getMany(
      user.tickets.map((ticket) => {
        return ["event", ticket.split("_")[0]];
      }),
    );

    const tickets = events.map((e) => {
      const event = e.value as Event;
      const id = e.key[1];
      //theoreticlly I could just plug the iteration into the array of tickets but this should catch any wierd edge cases
      const ticket = user.tickets.find(
        (ticket) => ticket.split("_")[0] === id,
      )!;
      const showTime = event.showTimes.find(
        (showTime) => showTime.id === ticket.split("_")[1],
      )!;

      return {
        id: id as string,
        date: new Date(showTime.startDate),
        event: event,
      };
    });

    ctx.state.data = {
      user,
      tickets,
    };

    return (
      <>
        <div className="mx-auto gap-4 flex mt-4 overflow-x-auto w-[calc(100vw-2rem)] max-w-max">
          {organizingTabs.map((tab) => (
            <a
              href={
                tab == "upcoming"
                  ? "/events/attending"
                  : `/events/attending/${tab}`
              }
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
      id: string;
      event: Event;
      date: Date;
    }[];
    user: User;
  };
}
