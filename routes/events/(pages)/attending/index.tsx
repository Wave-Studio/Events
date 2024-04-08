import { TicketContext } from "@/routes/events/(pages)/attending/_layout.tsx";
import { defineRoute, RouteContext } from "$fresh/server.ts";
import EventHeader from "@/components/layout/eventEditNavbar.tsx";
import Scanner from "../../../../islands/events/scanning/index.tsx";
import { badEventRequest } from "@/routes/events/[id]/_layout.tsx";
import ImagekitImage from "@/components/imagekitimg.tsx";
import CTA from "@/components/buttons/cta.tsx";
import { fmtDate } from "@/utils/dates.ts";
import { fmtTime } from "@/utils/dates.ts";
import { ClientDate } from "@/islands/events/viewing/dates.tsx";

export default defineRoute((req, ctx: RouteContext<void, TicketContext>) => {
  const { tickets, user } = ctx.state.data;

  if (!user) {
    return badEventRequest;
  }

  return (
    <main className="px-4 max-w-screen-md w-full mx-auto flex flex-col gap-8 grow mb-10">
      <div class="grid md:grid-cols-2 gap-4">
        {tickets.map((ticket) => (
          <div class="rounded-md border flex flex-col p-4">
            <div class="rounded-md border bg-gray-100 px-1 mb-4 font-medium mx-auto">
              {ticket.time.startTime
                ? (
                  <>
                    {fmtDate(new Date(ticket.time.startDate))}
                    <span class="lowercase">
                      {ticket.time.startTime &&
                        ` at ${fmtTime(new Date(ticket.time.startTime))}`}
                    </span>
                  </>
                )
                : <ClientDate date={ticket.time.startDate} />}
            </div>
            <div class="relative">
              {ticket.event.banner.path
                ? (
                  <ImagekitImage
                    alt="Event image"
                    path={ticket.event.banner.path}
                    sizes={[240, 360, 480, 520]}
                    className={`${
                      ticket.event.banner.fill ? "object-fill" : "object-cover"
                    } h-24 md:h-36 w-full rounded-md`}
                  />
                )
                : (
                  <img
                    class="object-cover h-24 md:h-36 rounded-md"
                    src="/placeholder-small.jpg"
                    srcset="/placeholder-small.jpg 640w, /placeholder.jpg 1440w, /placeholder-full.jpg 2100w"
                    alt="Placeholder Image"
                  />
                )}
            </div>
            <div class=" mt-4 flex flex-col items-center grow">
              <h3 class="text-xl font-bold text-center line-clamp-1 max-w-max">
                {ticket.event.name}
              </h3>
              <p class="line-clamp-3 text-sm text-pretty text-center mt-2 mb-4">
                {ticket.event.summary}
              </p>
              <a
                href={`/events/${ticket.eventID}/tickets/${ticket.ticketID}?s=${ticket.time.id}`}
              >
                <CTA btnType="secondary" btnSize="sm" className="mt-auto">
                  View Ticket
                </CTA>
              </a>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
});
