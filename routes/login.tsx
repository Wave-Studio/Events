import { defineRoute, Handlers } from "$fresh/server.ts";
import { getUser } from "@/utils/db/kv.ts";
import LoginForm from "@/islands/loginForm.tsx";
import { deleteCookie } from "$std/http/cookie.ts";
import { User } from "@/utils/db/kv.ts";

export const handler: Handlers = {
  async GET(req, ctx) {
    const user = await getUser(req);

    const response = await ctx.render({ user });

    if (user == undefined) {
      deleteCookie(response.headers, "authToken", { path: "/" });
    } else {
      return new Response(undefined, {
        headers: {
          Location: "/events/organizing",
        },
        status: 307,
      });
    }

    return response;
  },
};

export default defineRoute((req, ctx) => {
  // Weird types
  const user = (ctx.data as unknown as { user: User | undefined }).user;
  const url = new URL(req.url);
  const attending = url.searchParams.get("attending");

  // DENO_DEPLOYMENT_ID will be set on prod, not local
  // 👍

  return (
    <>
      <div className="flex flex-col grow items-center">
        <h1 class="text-center text-4xl font-bold">Login</h1>
        <div className="my-auto flex flex-col gap-4 pb-36 pt-6">
          <LoginForm attending={Boolean(attending)} />
        </div>
      </div>
    </>
  );
});
