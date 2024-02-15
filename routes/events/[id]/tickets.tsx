import { defineRoute, RouteContext } from "$fresh/server.ts";
import {
  badEventRequest,
  EventContext,
} from "@/routes/events/[id]/_layout.tsx";
import EventHeader from "@/components/layout/eventEditNavbar.tsx";
import Dropdown from "@/islands/components/pickers/dropdown.tsx";
import DotsVertical from "$tabler/dots-vertical.tsx";
import TicketsFilters from "@/islands/tickets/filters.tsx";
import { signal } from "@preact/signals";
import ShowtimeSelector from "@/islands/events/editing/showtimeSelector.tsx";
import { kv, Ticket } from "@/utils/db/kv.ts";
import { fmtDate } from "@/utils/dates.ts";
import { NotFound } from "@/components/svgs/not-found.tsx";

export default defineRoute(
  async (req, ctx: RouteContext<void, EventContext>) => {
    const { event, eventID, user } = ctx.state.data;

    if (!user || user.role == undefined || user.role > 3) {
      return badEventRequest;
    }

    const url = new URL(req.url);
    const queryValue = url.searchParams.get("q");
    const showTimeID = url.searchParams.get("id") ?? event.showTimes[0].id;
    let sortValue = parseInt(url.searchParams.get("s") ?? "0");

    if (isNaN(sortValue) || sortValue > 4 || sortValue < 0) {
      sortValue = 0;
    }

    const query = signal<string>(queryValue ?? "");
    const sort = signal<number>(sortValue);

    const request = ["ticket", eventID];
    if (showTimeID !== "0") request.push(showTimeID);
    const tix = kv.list<Ticket>({ prefix: request });
    let tickets: Deno.KvEntry<Ticket>[] = [];
    for await (const ticket of tix) {
      tickets.push(ticket);
    }

    if (queryValue) {
      tickets = tickets.filter(
        (ticket) =>
          ticket.value.firstName.includes(queryValue) ||
          ticket.value.lastName.includes(queryValue) ||
          ticket.value.userEmail.includes(queryValue) ||
          ticket.key[3],
      );
    }

    return (
      <main className="px-4 max-w-screen-md w-full mx-auto flex flex-col gap-2 grow mb-10 ">
        <EventHeader editPosition={1} role={user.role} />

        <ShowtimeSelector
          defaultShowTime={showTimeID}
          showTimes={event.showTimes}
        />
        <TicketsFilters query={query} sort={sort} />

        <h2 class="font-medium text-sm mb-0.5 mt-8">Tickets</h2>
        {tickets.length === 0 ? (
          <>
            <div class="flex flex-col items-center justify-center grow py-2 text-center">
              <div class="hidden md:block absolute -z-10">
                <NotFound />
              </div>
              <h2 class="font-semibold">
                No one has signed up for this event yet
              </h2>
              <p class="mt-1 text-sm text-gray-700">
                Share your event page to encourage others to sign up
              </p>
            </div>
          </>
        ) : (
          <div class="grid md:grid-cols-2 gap-4">
            {tickets.map((ticket) => {
              const { value, key } = ticket;
              const ticketID = (key[3] as string).split("_")[2];
              const time = event.showTimes.find((time) => time.id === key[2])!;

              return (
                <>
                  <div class="p-3 flex flex-col group gap-2 border rounded-md">
                    <div class="flex gap-2">
                      <div class="grow my-auto">
                        <p class="font-medium truncate max-w-[15rem]">
                          {value.firstName} {value.lastName}
                        </p>
                        <p class="text-xs text-gray-700">{value.userEmail}</p>
                      </div>

                      <Dropdown
                        options={[
                          {
                            content: "See Ticket",
                            link: `./tickets/${ticketID}?s=${key[2] as string}`,
                          },
                          {
                            content: "Delete Ticket",
                          },
                        ]}
                      >
                        <div
                          className={`w-8 grid place-items-center border h-8 rounded-md hover:bg-gray-200 transition`}
                        >
                          <DotsVertical class="h-5 w-5" />
                        </div>
                      </Dropdown>
                    </div>
                    <div class="flex gap-2 flex-wrap">
                      {/* need some */}
                      <div class="rounded-md border text-sm font-semibold px-1 text-gray-700 bg-gray-100">
                        2/2 tickets
                      </div>
                      {showTimeID === "0" && (
                        <div class="rounded-md border text-sm font-semibold px-1 text-gray-700 bg-gray-100">
                          {fmtDate(new Date(time.startDate))}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              );
            })}
          </div>
        )}
      </main>
    );
  },
);
