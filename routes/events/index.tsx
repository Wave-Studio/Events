import { getUser, kv, Event } from "@/utils/db/kv.ts";
import { renderToString } from "preact-render-to-string";

export default async function Homepage(req: Request,) {
  const tab = new URL(req.url).searchParams.get("tab")
  const tabID: 0 | 1 = tab ? parseInt(tab) as 0 | 1 : 0

  const user = await getUser(req);

  if (user == undefined) {
    return new Response(renderToString(<></>), {
      headers: {
        Location: "/login",
      },
      status: 401,
    });
  }

  const events = await kv.getMany<Event[]>([
    ...(tabID == 0 ? user.events.map((e) => ["event", e]) : user.tickets.map((e) => ["event", e.split("-")[0]])),
  ]);

  const tabs = [
    {
      name: "Organizing",
      id: 0,
      desc: "Organize and manage your events in one convinient location",
    },
    {
      name: "Attending",
      id: 1,
      desc: "View your upcoming and previous events",
    },
  ];

  return (
    <>
      <h1 class="text-center text-4xl font-bold">Events</h1>
      <div className="gap-8 mt-4 mb-2 mx-auto flex ">
        {tabs.map((tab) => (
          <a href={`?tab=${tab.id}`} class={`border-2 rounded-md px-3.5 py-0.5 ${tabID == tab.id && "font-medium border-theme-normal"}`}>{tab.name}</a>
        ))}
      </div>
      <div className="px-4 max-w-screen-lg w-full mx-auto mb-20">
        
      </div>
    </>
  );
}
