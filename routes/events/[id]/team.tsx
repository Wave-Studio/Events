import { defineRoute, RouteContext } from "$fresh/server.ts";
import {
  EventContext,
  badEventRequest,
} from "@/routes/events/[id]/_layout.tsx";
import EventHeader from "@/components/layout/eventEditNavbar.tsx";
import Button from "@/components/buttons/button.tsx";
import Plus from "$tabler/plus.tsx";
import Select from "@/islands/components/pickers/select.tsx";
import UserMinus from "$tabler/user-minus.tsx";
import Dropdown from "@/islands/components/pickers/dropdown.tsx";
import DotsVertical from "$tabler/dots-vertical.tsx";
import { Trashcan } from "@/islands/components/dropinUI/trash.tsx";
import Search from "$tabler/search.tsx"

export default defineRoute((req, ctx: RouteContext<void, EventContext>) => {
  const { event, eventID, user } = ctx.state.data;

  if (!user || user.role == undefined || user.role > 3) {
    return badEventRequest;
  }

  return (
    <main className="px-4 max-w-screen-md w-full mx-auto flex flex-col gap-8 grow mb-10">
      <EventHeader editPositon={2} role={user.role} />
      <div class="rounded-md border p-4 mb-6">
        <h2 class="text-lg font-semibold">Add Team Members</h2>
        <p class="text-sm">
          Invite a team member! They'll recive an emil promtly after you invite
          them.
        </p>
        <div class="flex mt-4 gap-2">
          <input
            class="rounded-md border py-1.5 px-2 grow"
            placeholder="Team Member Email"
            type="text"
          />
          <Select options={["Admin", "Manager", "Scanner"]} />
          <Button icon={<Plus class="w-6 h-6" />} label="Add Member" />
        </div>
      </div>
      <div class="flex gap-2">
        <input
          class="rounded-md border py-1.5 px-2 grow"
          placeholder="Search..."
        />
        <Button icon={<Search class="w-5 h-5" />} label="Search Users" />
        <Select options={["Role Desc", "Role Asc", "Email A-Z", "Email Z-A"]} />
      </div>
      <div>
        <h2 class="font-medium text-sm mb-0.5">All Team Members</h2>
        <div class="flex flex-col border divide-y rounded-md">
          {event.members.map((m) => (
            <>
              <div class="p-3 flex group gap-2">
                <div class="grow my-auto">
                  <p class="font-medium max-w-sm truncate">{m.email}</p>
                </div>

                <Select
                  options={["Admin", "Manager", "Scanner"]}
                  selectClassName="py-1"
                />
                <Dropdown
                  options={[
                    {
                      content: "Remove User",
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
              <div class="p-3 flex group gap-2">
                <div class="grow my-auto">
                  <p class="font-medium max-w-sm truncate">{m.email}</p>
                </div>

                <p class="my-auto font-medium w-24">Owner</p>
                <Dropdown
                  options={[
                    {
                      content: "Transfer Ownership",
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
              <div class="p-3 flex gap-2 items-center">
                <div class="grow my-auto">
                  <p class="font-medium max-w-sm truncate">{m.email}</p>
                </div>
                <p class="italic text-sm">Invatation Pending</p>
                <Trashcan />
              </div>
            </>
          ))}
        </div>
      </div>
    </main>
  );
});
