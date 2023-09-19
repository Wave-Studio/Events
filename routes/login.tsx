import { useSignal } from "@preact/signals";
import CTA from "@/components/buttons/cta.tsx";
import Button from "@/components/buttons/button.tsx";
import ChevronDown from "$tabler/chevron-down.tsx";
import { useState } from "preact/hooks";
import { defineRoute } from "$fresh/server.ts";
import { getUser } from "@/utils/db/kv.ts";
import LoginForm from "@/islands/loginForm.tsx";

export default defineRoute(async (req, ctx) => {
  const user = await getUser(req);
  const loggedIn = user != undefined;
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
