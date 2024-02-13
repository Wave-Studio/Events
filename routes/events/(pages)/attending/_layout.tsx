import { defineLayout, RouteContext } from "$fresh/server.ts";
import { getUser } from "@/utils/db/kv.ts";

export default defineLayout(async (req: Request, ctx) => {
  const organizingTabs = ["upcoming", "past"];
  const url = new URL(req.url);
  const tabName = url.pathname.split("/")[3] ?? "upcoming";
  const user = await getUser(req);

  if (user == undefined) {
    return new Response(undefined, {
      headers: {
        Location: "/login",
      },
      status: 307,
    });
  }

  return (
    <>
      <div className="mx-auto gap-4 flex mt-4 overflow-x-auto w-[calc(100vw-2rem)] max-w-max">
        {organizingTabs.map((tab) => (
          <a
            href={
              tab == "upcoming"
                ? "/events/attending"
                : `/events/attending/${tab}`
            }
            class={`border-2 rounded-md px-2.5 py-0.5 capitalize ${
              tab == tabName && "font-medium border-theme-normal"
            }`}
          >
            {tab}
          </a>
        ))}
      </div>
      <div className="grow flex flex-col my-4">
        <ctx.Component />
      </div>
    </>
  );
});
