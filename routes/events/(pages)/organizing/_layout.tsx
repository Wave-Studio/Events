import { defineLayout, RouteContext } from "$fresh/server.ts";
import { getUser, Plan } from "@/utils/db/kv.ts";
import { badEventRequest } from "@/routes/events/[id]/_layout.tsx";

export default defineLayout(async (req: Request, ctx) => {
  const organizingTabs = ["events", "accounting", "collections", "discounts"];
  const url = new URL(req.url);
  const tabName = url.pathname.split("/")[3] ?? "events";
  const user = await getUser(req);

  if (!user || user.plan !== Plan.ENTERPRISE) {
    return badEventRequest;
  }

  return (
    <>
      {tabName != "create" && (
        <div className="mx-auto gap-4 flex mt-4 overflow-x-auto w-[calc(100vw-2rem)] max-w-max">
          {organizingTabs.map((tab) => (
            <a
              href={tab == "events"
                ? "/events/organizing"
                : `/events/organizing/${tab}`}
              class={`border-2 rounded-md px-2.5 py-0.5 capitalize ${
                tab == tabName && "font-medium border-theme-normal"
              }`}
            >
              {tab}
            </a>
          ))}
        </div>
      )}
      <div className="grow flex flex-col mb-4 mt-8">
        <ctx.Component />
      </div>
    </>
  );
});
