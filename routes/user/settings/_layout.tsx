import { defineLayout } from "$fresh/server.ts";
import { ComponentChildren } from "preact";
import LockAccess from "$tabler/lock-access.tsx";
import Home from "$tabler/home.tsx";
import { getUser } from "@/utils/db/kv.ts";

export default defineLayout(async (req, ctx) => {
	const user = await getUser(req);
	const route = new URL(req.url).pathname;

  if (user == undefined) {
    return new Response(undefined, {
      headers: {
        Location: "/login",
      },
      status: 307,
    });
  }
	
  const pages: { name: string; icon: ComponentChildren; route: string }[] = [
    {
      name: "Home",
      icon: <Home class="size-6" />,
      route: "/user/settings",
    },
    {
      name: "Authentication",
      icon: <LockAccess class="size-6" />,
      route: "/user/settings/auth",
    },
  ];

  

  return (
    <>
      <div class="flex justify-center w-full px-4">
        <div class="flex flex-col w-56 mr-4">
          <h1 class="text-2xl font-bold h-20">Settings</h1>
          <div class="flex flex-col gap-4 group">
            {pages.map((page) => (
              <a
                href={page.route}
                class={`text-gray-700 hover:text-gray-800 group/item hover:!bg-gray-200 transition flex items-center px-3 py-1.5 rounded-md relative ${
                  page.route === route && "bg-gray-100"
                }`}
              >
                {page.icon}
                <p class="ml-2 text-gray-900 font-medium">{page.name}</p>
                <div
                  class={`absolute w-1 rounded-full bg-theme-normal left-1 group-hover/item:h-5 transition-all ${
                    page.route === route
                      ? "h-4 opacity-100"
                      : "h-3 opacity-0 group-hover/item:opacity-100"
                  }`}
                />
              </a>
            ))}
          </div>
        </div>
        <div class="flex flex-col max-w-screen-md w-full mt-20">
          <ctx.Component />
        </div>
      </div>
    </>
  );
});
