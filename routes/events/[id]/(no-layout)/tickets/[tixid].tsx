import { defineRoute, RouteContext } from "$fresh/server.ts";
import {
  badEventRequest,
  EventContext,
} from "@/routes/events/[id]/_layout.tsx";
import { getShowtimeID } from "@/utils/tickets.ts";
import { kv, Ticket } from "@/utils/db/kv.ts";
import { Head } from "$fresh/runtime.ts";
import Footer from "@/components/layout/footer.tsx";
import TicketComponent from "../../../../../islands/components/pieces/ticket.tsx";
import CTA from "@/components/buttons/cta.tsx";
import TicketActions from "@/islands/events/viewing/ticketActions.tsx";
import NavbarDropDown from "@/islands/components/pieces/navDropDown.tsx";
import Cookies from "@/islands/components/pieces/acceptCookies.tsx";
import { getCookies } from "$std/http/cookie.ts";

export default defineRoute(
  async (req, ctx: RouteContext<void, EventContext>) => {
    const { event, eventID, user } = ctx.state.data;
    const ticketID = ctx.params.tixid;
    const url = new URL(req.url);
    const queryValue = url.searchParams.get("s");

    if (!user) {
      return (
        <div class="flex flex-col items-center justify-center min-h-screen text-center ">
          <h1 class="font-bold px-2">
            You need to log in to view this ticket
          </h1>
          <p class="mt-2 text-sm">
            We require users to login to ensure they're not using someone elses
            ticket.
          </p>
          <a href={`/login?eventID=${eventID}&ticketID=${ticketID}`}>
            <CTA btnType="cta" className="mt-10" btnSize="sm">
              Log In
            </CTA>
          </a>
        </div>
      );
    }

    const sid = getShowtimeID(user?.data, eventID, ticketID);
    const showTimeID: string | undefined = queryValue || sid;
    const id = `${eventID}_${showTimeID}_${ticketID}`;

    // Scanners and above can view user's tickets
    if (
      (user.role == undefined || user.role > 3) &&
      !user.data.tickets.includes(id)
    ) {
      return badEventRequest;
    }

    if (!showTimeID) return badEventRequest;

    const ticket = await kv.get<Ticket>(["ticket", eventID, showTimeID, id]);

    if (!ticket.value) return badEventRequest;

    const Indent = ({ className }: { className: string }) => (
      <svg
        width="124"
        height="34"
        viewBox="0 0 124 34"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class={`absolute text-theme-normal  mx-auto z-10 right-0 left-0 bg-white ${className}`}
      >
        <path
          d="M124 1.00001C92.0003 1.00001 124 1.00001 102 1C97.582 1 94.103 4.63735 93.013 8.91905C89.683 22 76.94 30 62 30C47.06 30 35 21.5 30.987 8.91905C29.897 4.63734 26.418 1 22 1C17.582 1 -1.52588e-05 0.999995 -1.52588e-05 0.999995"
          stroke="currentColor"
          strokeWidth={2}
        />
      </svg>
    );

    return (
      <>
        <Head>
          <title>
            {ticket.value.firstName}'s ticket - {event.name} - Events
          </title>
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
            content={event.description ??
              "Link to an event hosted on Events - Open Source Ticketing tool"}
          />
          <meta
            name="description"
            content={event.description ??
              "Link to an event hosted on Events - Open Source Ticketing tool"}
          />
          {/* <meta name="theme-color" content="#DC6843" /> */}
        </Head>

        <div className="flex flex-col min-h-screen ">
          {user && (
            <>
              <div class="flex absolute top-0 h-14 z-30 w-full items-center justify-end px-3 py-1 print:hidden">
                <NavbarDropDown user={user.data} />
              </div>
            </>
          )}
          <main className="print:px-0 tprint:xs:px-4 px-4 max-w-screen-md w-full mx-auto flex flex-col gap-8 grow mb-10 items-center mt-4 md:mt-16 print:justify-center print:gap-12">
            <h1 class="font-extrabold text-2xl text-center print:block">
              {ticket.value.firstName}'s Ticket
            </h1>
            <div class="rounded-lg px-6 pt-8 pb-12 border-2 border-theme-normal text-center relative print:block">
              <Indent className="-top-[2px]" />
              <TicketComponent
                id={id}
                showTime={event.showTimes.find((s) => s.id == showTimeID)!}
                tickets={1}
                venue={event.venue}
              />
              <Indent className="-bottom-[2px] rotate-180" />
            </div>
            <a href={`/events/${eventID}`} class="print:hidden">
              <CTA btnType="cta" btnSize="sm">
                View Event
              </CTA>
            </a>
            <TicketActions ticketID={id} />
          </main>
          <p class="text-center max-w-sm mx-auto mb-4 text-sm px-4 print:hidden">
            This event was made with{" "}
            <a className="font-medium underline" href="/">
              Events
            </a>
            , a simple and easy to use event booking platform.
          </p>
          <Footer includeWave={false} />
        </div>
        {/* Print buttons and whatnot */}
        {!getCookies(req.headers)["accepted-privacy"] && <Cookies />}
      </>
    );
  },
);
