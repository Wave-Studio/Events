import { defineLayout } from "$fresh/server.ts";

export default defineLayout((req, ctx) => {
  const url = new URL(req.url);
  const tabName = url.pathname.split("/")[2];
  const isCreation = url.pathname.split("/")[3] == "create";
  //const data = await loadData();

  return (
    <>
      <h1 class="text-center text-4xl font-bold">
        {isCreation ? "Event Creation" : "Events"}
      </h1>

      <div className="px-4 max-w-screen-md w-full mx-auto mb-20 flex flex-col grow">
        <ctx.Component />
      </div>
      <div className="gap-4 mt-4 mb-6 mx-auto flex ">
        {tabs.map((tab) => (
          <a
            href={tab.url}
            class={`border-2 rounded-md px-1.5 capitalize text-sm ${
              tabName == tab.name && "font-medium border-gray-400 "
            }`}
          >
            {tab.name}
          </a>
        ))}
      </div>
    </>
  );
});

export const tabs = [
  {
    name: "organizing",
    url: "/events/organizing",
    desc: "Organize and manage your events in one convinient location",
  },
  {
    name: "attending",
    url: "/events/attending",
    desc: "View your upcoming and previous events",
  },
];
