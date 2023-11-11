import { defineRoute, RouteContext } from "$fresh/server.ts";
import ChevronLeft from "$tabler/chevron-left.tsx";
import Edit from "$tabler/table-options.tsx";
import World from "$tabler/world.tsx";
import { ComponentChildren } from "preact";
import Button from "@/components/buttons/button.tsx";
import CTA from "@/components/buttons/cta.tsx";
import Scan from "$tabler/text-scan-2.tsx";
import {
  EventContext,
  badEventRequest,
} from "@/routes/events/[id]/_layout.tsx";
import Users from "$tabler/users-group.tsx";
import EventHeader from "@/components/layout/eventEditNavbar.tsx";

export default defineRoute((req, ctx: RouteContext<void, EventContext>) => {
  const { event, eventID, user } = ctx.state.data;

  if (!user || user.role == undefined || user.role > 3) {
    return badEventRequest;
  }

  return (
    <main className="px-4 max-w-screen-md w-full mx-auto flex flex-col gap-8 grow mb-10">
      <EventHeader editPositon={2} role={user.role} />
			<div class="divide-y">
				<div>
sss
				</div>
				<div>
ssss
				</div>
			</div>
    </main>
  );
});
