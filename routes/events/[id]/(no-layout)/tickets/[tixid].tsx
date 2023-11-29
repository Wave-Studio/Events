import { RouteContext, defineRoute } from "$fresh/server.ts";
import {
  EventContext,
  badEventRequest,
} from "@/routes/events/[id]/_layout.tsx";
import { getShowtimeID } from "@/utils/tickets.ts";
import { Ticket, kv } from "@/utils/db/kv.ts";
import { Head } from "$fresh/runtime.ts";
import Footer from "@/components/layout/footer.tsx";
import TicketComponent from "@/islands/components/peices/ticket.tsx";

export default defineRoute(
  async (req, ctx: RouteContext<void, EventContext>) => {
    const { event, eventID, user } = ctx.state.data;
    const ticketID = ctx.params.tixid;
    const showTimeID = getShowtimeID(user?.data, eventID, ticketID);
    const id = `${eventID}_${showTimeID}_${ticketID}`;

    if (!showTimeID) return badEventRequest;

    const ticket = await kv.get<Ticket>(["ticket", eventID, showTimeID, id]);

    if (!ticket.value) return badEventRequest;

    return (
      <>
        <Head>
          <title>Your ticket - {event.name} - Events</title>
          <meta property="og:type" content="website" />
          <meta
            property="og:url"
            content={`http://events.deno.dev/events/${eventID}`}
          />
          <meta
            property="og:image"
            content="http://events.deno.dev/favicon.ico"
          />
          <meta
            property="og:description"
            content={
              event.description ??
              "Link to an event hosted on Events - Open Source Ticketing tool"
            }
          />
          <meta
            name="description"
            content={
              event.description ??
              "Link to an event hosted on Events - Open Source Ticketing tool"
            }
          />
          <meta name="theme-color" content="#DC6843" />
        </Head>

        <div className="flex flex-col min-h-screen">
          <main className="px-4 max-w-screen-md w-full mx-auto flex flex-col gap-8 grow mb-10 items-center mt-10 md:mt-24">
            <h1 class="font-extrabold text-2xl text-center">Your Ticket</h1>
            <TicketComponent
              id={id}
              showTime={event.showTimes.find((s) => s.id == showTimeID)!}
              tickets={1}
            />
          </main>
          <Footer includeWave={false} />
        </div>
        {/* Print buttons and whatnot */}
      </>
    );
  },
);
