import { defineRoute, RouteContext } from "$fresh/server.ts";
import {
  EventContext,
  badEventRequest,
} from "@/routes/events/[id]/_layout.tsx";
import EventHeader from "@/components/layout/eventEditNavbar.tsx";
import Button from "@/components/buttons/button.tsx";
import Select from "@/islands/components/pickers/select.tsx";
import UserMinus from "$tabler/user-minus.tsx";
import Dropdown from "@/islands/components/pickers/dropdown.tsx";
import DotsVertical from "$tabler/dots-vertical.tsx";
import { Trashcan } from "@/islands/components/dropinUI/trash.tsx";
import Search from "$tabler/search.tsx";
import Invite from "@/islands/events/teams/invite.tsx";
import ManageUser from "@/islands/events/teams/manage.tsx";
import Crown from "$tabler/crown.tsx";
import { Roles } from "@/utils/db/kv.ts";

export default defineRoute((req, ctx: RouteContext<void, EventContext>) => {
  const { event, eventID, user } = ctx.state.data;

  if (!user || user.role == undefined || user.role > 3) {
    return badEventRequest;
  }

  return (
    <main className="px-4 max-w-screen-md w-full mx-auto flex flex-col gap-8 grow mb-10">
      <EventHeader editPositon={2} role={user.role} />
      <div class="rounded-md border p-4 mb-6 mt-2">
        <h2 class="text-lg font-semibold">Add Team Members</h2>
        <p class="text-sm">
          Invite a team member! They'll recive an emil promtly after you invite
          them.
        </p>
        <Invite eventID={eventID} />
      </div>
      <div class="flex gap-2 flex-col md:flex-row ">
        <input
          class="rounded-md border py-1.5 px-2 grow"
          placeholder="Search..."
        />
        <div class="flex gap-2">
          <Select
            options={["Role Desc", "Role Asc", "Email A-Z", "Email Z-A"]}
            selectClassName="py-2"
            className="grow"
          />
          <Button icon={<Search class="w-5 h-5" />} label="Search Users" />
        </div>
      </div>
      <div>
        <h2 class="font-medium text-sm mb-0.5">All Team Members</h2>
        <div class="flex flex-col border divide-y rounded-md">
          {event.members.map((m) => (
            <>
              {m.role == Roles.OWNER ? (
                <div class="p-3 flex group gap-2">
                  <div class="grow my-auto">
                    <p class="font-medium max-w-sm truncate">{m.email}</p>
                  </div>

                  <p class="my-auto font-medium">Owner</p>

                  {/* I couldn't decide if I prefer it before or after - Bloxs */}
                  <Crown />
                </div>
              ) : (
                <div class="p-3 flex group gap-2">
                  <div class="grow my-auto">
                    <p class="font-medium max-w-sm truncate">{m.email}</p>
                  </div>

                  <ManageUser user={m} eventID={eventID} />
                </div>
              )}
            </>
          ))}
        </div>
      </div>
    </main>
  );
});
