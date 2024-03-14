import { defineRoute, RouteContext } from "$fresh/server.ts";
import {
  badEventRequest,
  EventContext,
} from "@/routes/events/[id]/_layout.tsx";
import EventHeader from "@/components/layout/eventEditNavbar.tsx";
import Invite from "@/islands/events/teams/invite.tsx";
import ManageUser from "@/islands/events/teams/manage.tsx";
import Crown from "$tabler/crown.tsx";
import { Event, Roles } from "@/utils/db/kv.ts";
import TeamFilters from "@/islands/events/teams/filters.tsx";
import { signal } from "@preact/signals";

export default defineRoute((req, ctx: RouteContext<void, EventContext>) => {
  const { event, eventID, user } = ctx.state.data;
  const url = new URL(req.url);
  const queryValue = url.searchParams.get("q");
  let sortValue = parseInt(url.searchParams.get("s") ?? "0");

  if (isNaN(sortValue) || sortValue > 4 || sortValue < 0) {
    sortValue = 0;
  }

  const query = signal<string>(queryValue ?? "");
  const sort = signal<number>(sortValue);

  if (!user || user.role == undefined || user.role > 3) {
    return badEventRequest;
  }

  const sortMembers = (a: Event["members"][0], b: Event["members"][0]) => {
    if (sort.value == 0 || sort.value == 1) {
      // ["Role Desc", "Role Asc", "Email A-Z", "Email Z-A"]
      if (sort.value == 0) {
        if (a.role < b.role) {
          return -1;
        } else if (a.role > b.role) {
          return 1;
        } else {
          return a.email.localeCompare(b.email);
        }
      }
    } else if (sort.value == 2 || sort.value == 3) {
      if (sort.value == 2) {
        if (a.email > b.email) {
          return 1;
        } else if (a.email < b.email) {
          return -1;
        }
      } else if (sort.value == 3) {
        if (a.email < b.email) {
          return 1;
        } else if (a.email > b.email) {
          return -1;
        }
      }
    }

    return 0;
  };

  return (
    <main className="px-4 max-w-screen-md w-full mx-auto flex flex-col gap-8 grow mb-10">
      <EventHeader editPosition={2} role={user.role} />
      <div class="rounded-md border p-4 mb-6 mt-2">
        <h2 class="text-lg font-semibold">Add Team Members</h2>
        <p class="text-sm">
          Invite a team member! They'll receive an emil promptly after you
          invite them.
        </p>
        <Invite eventID={eventID} />
      </div>
      <TeamFilters query={query ?? ""} sort={sort} />
      <div>
        <h2 class="font-medium text-sm mb-0.5">All Team Members</h2>
        <div class="grid [grid-auto-rows:1fr] border divide-y rounded-md">
          {event.members
            .sort(sortMembers)
            .filter((m) =>
              m.email.toLowerCase().includes((query.value ?? "").toLowerCase()),
            )
            .map((m) => (
              <>
                {m.role == Roles.OWNER ? (
                  <div class="p-3  flex group gap-2 items-center">
                    <div class="grow my-auto truncate">
                      <p class="font-medium max-w-sm truncate">{m.email}</p>
                    </div>

                    <p class="my-auto font-medium">Owner</p>

                    {/* I couldn't decide if I prefer it before or after - Bloxs */}
                    <Crown class="min-w-[1.5rem] h-6" />
                  </div>
                ) : (
                  <div class="p-3  flex group gap-2 flex-col md:flex-row">
                    <div class="grow my-auto">
                      <p class="font-medium max-w-sm truncate">{m.email}</p>
                    </div>

                    <ManageUser
                      user={m}
                      eventID={eventID}
                      client={user.data}
                      clientRole={user.role!}
                    />
                  </div>
                )}
              </>
            ))}
        </div>
      </div>
    </main>
  );
});
