import { defineRoute, LayoutConfig } from "$fresh/server.ts";
import { Event, kv } from "@/utils/db/kv.ts";
import { isUUID } from "@/utils/db/misc.ts";

export const config: LayoutConfig = {
  skipInheritedLayouts: true, // Skip already inherited layouts
};

export default defineRoute(async (req, ctx) => {

  if (!isUUID(ctx.params.id)) {
    return <NotFoundPage />;
  }

  const event = await kv.get<Event>(["event", ctx.params.id]);

  if (event.value != undefined) {
    return <div>
      <p>Fr Fr On God No cap</p>
      <p>{event.value.name}</p>
    </div>
  }

  return (
    <NotFoundPage />
  );
});

const NotFoundPage = () => {
  return (
    <div>
      <p>nah u straight up cappin</p>
    </div>
  );
}