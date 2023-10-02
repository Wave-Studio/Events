import { defineRoute, LayoutConfig } from "$fresh/server.ts";
import { Event, getUser, kv } from "@/utils/db/kv.ts";
import { isUUID } from "@/utils/db/misc.ts";
import EventViewing from "@/components/eventPages/viewing.tsx";
import { Roles } from "@/utils/db/kv.types.ts";
import EventEditing from "@/components/eventPages/editing.tsx";
import EventScanning from "@/components/eventPages/scanning.tsx";
import CTA from "@/components/buttons/cta.tsx";

export const config: LayoutConfig = {
  skipInheritedLayouts: true, // Skip already inherited layouts
};

export default defineRoute(async (req, ctx) => {
  const eventID = ctx.params.id;

  if (!isUUID(eventID)) {
    return <NotFoundPage />;
  }

  const editing = Boolean(new URL(req.url).searchParams.get("editing"));
  const scanning = Boolean(new URL(req.url).searchParams.get("scanning"));

  const user = await getUser(req);

  if ((editing || scanning) && !user) {
    return <NotFoundPage />;
  }

  const event = await kv.get<Event>(["event", eventID]);

  if (event.value != undefined) {
    if (!editing && !scanning) {
      return <EventViewing event={event.value} eventID={eventID} user={user} />;
    }
    const role: Roles | undefined = event.value.members.find(
      (m) => m.email === user!.email,
    )?.role;
    if (role == undefined || !user) {
      return <NotFoundPage />;
    }
    if (editing) {
      if (role <= 2) {
        return (
          <EventEditing
            event={event.value}
            eventID={eventID}
            role={role}
            user={user}
          />
        );
      } else {
        return <NotFoundPage />;
      }
    }
    if (scanning) {
      if (role <= 3) {
        return (
          <EventScanning event={event.value} eventID={eventID} user={user} />
        );
      } else {
        return <NotFoundPage />;
      }
    }
  }

  return <NotFoundPage />;
});

const NotFoundPage = () => {
  return (
    <div class="flex flex-col items-center justify-center h-screen">
      <p>Invalid event ID or you're not authorized to access this event</p>
      <p class="font-bold">Contact your event organizer for details</p>
      <a href="/">
        <CTA btnType="cta" className="mt-10">
          Homepage
        </CTA>
      </a>
    </div>
  );
};
