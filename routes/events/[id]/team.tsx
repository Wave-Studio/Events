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
        <Select options={["Role Desc", "Role Asc", "Email A-Z", "Email Z-A"]} />
      </div>
      <div>
        <h2 class="font-medium text-sm mb-0.5">Manage users</h2>
        <div class="flex flex-col border divide-y rounded-md">
          {event.members.map((m) => (
            <>
              <div class="p-3 flex group gap-2">
                <div class="grow my-auto">
                  <p class="font-medium max-w-sm truncate">{m.email}</p>
                </div>
                <div className="relative flex flex-col items-end md:items-center ">
                  <button className={`w-8 grid place-items-center peer border border-red-200 bg-red-100 text-red-500 h-full rounded-md`}>
                    <UserMinus class="w-5 h-5" />
                  </button>
                  <div className="absolute w-32 bg-white border rounded-md text-center shadow-xl top-10 select-none scale-95 opacity-0 peer-hover:scale-100 peer-hover:opacity-100 transition z-50">
                    Remove User
                  </div>
                </div>
                <Select
                  options={["Admin", "Manager", "Scanner"]}
                  selectClassName="py-1"
                />
              </div>
              <div class="px-3 py-4 ">
                <p class="font-medium">{m.email}</p>
              </div>
              <div class="px-3 py-4 ">
                <p class="font-medium">{m.email}</p>
              </div>
            </>
          ))}
        </div>
      </div>
    </main>
  );
});
