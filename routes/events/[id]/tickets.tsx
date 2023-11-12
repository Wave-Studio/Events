import { defineRoute, RouteContext } from "$fresh/server.ts";
import {
  EventContext,
  badEventRequest,
} from "@/routes/events/[id]/_layout.tsx";
import EventHeader from "@/components/layout/eventEditNavbar.tsx";
import Button from "@/components/buttons/button.tsx";
import Select from "@/islands/components/pickers/select.tsx";
import Search from "$tabler/search.tsx";
import Dropdown from "@/islands/components/pickers/dropdown.tsx";
import DotsVertical from "$tabler/dots-vertical.tsx";
import { fmtDate, fmtHour } from "@/utils/dates.ts";

export default defineRoute((req, ctx: RouteContext<void, EventContext>) => {
  const { event, eventID, user } = ctx.state.data;

  if (!user || user.role == undefined || user.role > 3) {
    return badEventRequest;
  }

  return (
    <main className="px-4 max-w-screen-md w-full mx-auto flex flex-col gap-2 grow mb-10">
      <EventHeader editPositon={1} role={user.role} />
      <div class="flex gap-2 mt-8 flex-col md:flex-row">
        <input
          class="rounded-md border py-1.5 px-2 grow"
          placeholder="Search..."
        />
        <div class="flex gap-2">
          <Select options={["Purchused", "Email A-Z", "Email Z-A"]} className="grow " />
          <Button icon={<Search class="w-5 h-5" />} label="Search Users" />
        </div>
      </div>
      <div class="flex gap-2 scrollbar-fancy snap-x overflow-x-auto">
        <button
          //onClick={() => (showTime.value = time.id)}
          class={`border transition select-none px-2 rounded-md font-medium whitespace-pre`}
          type="button"
        >
          All
        </button>
        {event.showTimes.map((time) => (
          <button
            //onClick={() => (showTime.value = time.id)}
            class={`border transition select-none px-2 rounded-md font-medium whitespace-pre ${
              time.id == event.showTimes[0].id &&
              "border-theme-normal bg-theme-normal/5"
            }`}
            type="button"
          >
            {fmtDate(new Date(time.startDate!))}
            <span class="lowercase">
              {time.startTime && ` at ${fmtHour(new Date(time.startTime))}`}
            </span>
          </button>
        ))}
      </div>
      <div>
        <h2 class="font-medium text-sm mb-0.5 mt-8">Tickets</h2>
        <div class="grid md:grid-cols-2 gap-4">
          {/* {event.members.map((m) => ( */}
          <>
            <div class="p-3 flex flex-col group gap-2 border rounded-md">
              <div class="flex gap-2">
                <div class="grow my-auto">
                  <p class="font-medium truncate max-w-[15rem]">Jane Doe</p>
                  <p class="text-xs text-gray-700">janedoe12@yahooooooo.net</p>
                </div>

                <Dropdown
                  options={[
                    {
                      content: "See Ticket",
                    },
                    {
                      content: "Delete Ticket",
                    },
                  ]}
                >
                  <div
                    className={`w-8 grid place-items-center border h-8 rounded-md`}
                  >
                    <DotsVertical class="h-5 w-5" />
                  </div>
                </Dropdown>
              </div>
              <div class="flex gap-2 flex-wrap">
                <div class="rounded-md border text-sm font-semibold px-1 text-gray-700 bg-gray-100">
                  2 tickets
                </div>
                <div class="rounded-md border text-sm font-semibold px-1 text-gray-700 bg-gray-100">
                  11/17/23
                </div>
                <div class="rounded-md border text-sm font-semibold px-1 text-gray-700 bg-gray-100">
                  +1 Additional Questions
                </div>
              </div>
            </div>
          </>
        </div>
      </div>
    </main>
  );
});
