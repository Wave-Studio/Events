import { defineLayout, RouteContext } from "$fresh/server.ts";

export default defineLayout((req: Request, ctx) => {
  const organizingTabs = ["upcoming", "past"];
  const url = new URL(req.url);
  const tabName = url.pathname.split("/")[3] ?? "upcoming";

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
