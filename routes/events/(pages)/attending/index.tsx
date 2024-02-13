import { TicketContext } from "@/routes/events/(pages)/attending/_layout.tsx";
import { defineRoute, RouteContext } from "$fresh/server.ts";
import EventHeader from "@/components/layout/eventEditNavbar.tsx";
import Scanner from "@/islands/events/scanning.tsx";
import { badEventRequest } from "@/routes/events/[id]/_layout.tsx";

export default defineRoute((req, ctx: RouteContext<void, TicketContext>) => {
  const { tickets, user } = ctx.state.data;

  if (!user) {
    return badEventRequest;
  }

  return (
    <main className="px-4 max-w-screen-md w-full mx-auto flex flex-col gap-8 grow mb-10 ">

    </main>
  );
});