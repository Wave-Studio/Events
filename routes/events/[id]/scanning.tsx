import { RouteContext, defineRoute } from "$fresh/server.ts";
import {
  EventContext,
  badEventRequest,
} from "@/routes/events/[id]/_layout.tsx";
import Scanner from "@/islands/events/scanning.tsx";
import EventHeader from "@/components/layout/eventEditNavbar.tsx";

export default defineRoute((req, ctx: RouteContext<void, EventContext>) => {
  const { event, eventID, user } = ctx.state.data;

  if (!user || user.role == undefined || user.role > 3) {
    return badEventRequest;
  }

  return (
    <main className="px-4 max-w-screen-md w-full mx-auto flex flex-col gap-8 grow mb-10">
      <EventHeader editPositon={0} role={user.role} />
      <Scanner className="rounded-md border border-gray-300 grow bg-gray-200" />
    </main>
  );
});
