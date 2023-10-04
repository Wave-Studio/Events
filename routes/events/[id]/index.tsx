import { defineRoute, LayoutConfig, RouteContext } from "$fresh/server.ts";
import { Event, getUser, kv } from "@/utils/db/kv.ts";
import { isUUID } from "@/utils/db/misc.ts";
import { Roles } from "@/utils/db/kv.types.ts";
import CTA from "@/components/buttons/cta.tsx";
import { EventContext } from "@/routes/events/[id]/_layout.tsx";

export const config: LayoutConfig = {
  skipInheritedLayouts: true, // Skip already inherited layouts
};

export default defineRoute(async (req, ctx: RouteContext<void, EventContext>) => {
  // layout are disabled on this route, but I don't wanna disable every one. no clue how to do that
  const { event, eventID, user } = ctx.state.data;
 
  const scanning = Boolean(new URL(req.url).searchParams.get("scanning"));

  return (
    <div>
      {JSON.stringify(ctx.state.data)}
    </div>
  )
});

