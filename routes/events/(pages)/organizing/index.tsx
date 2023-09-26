import { Event, getUser, kv } from "@/utils/db/kv.ts";
import { AppContext } from "$fresh/server.ts";
import { renderToString } from "preact-render-to-string";
import CTA from "@/components/buttons/cta.tsx";

export default async function Homepage(req: Request, ctx: AppContext) {
  const user = await getUser(req);

  if (user == undefined) {
    return new Response(undefined, {
      headers: {
        Location: "/login",
      },
      status: 307,
    });
  }

  const events = await kv.getMany<Event[]>(
    user.events.map((e) => ["event", e]),
  );

  if (events.length == 0) {
    return (
      <div class="my-auto py-10 flex flex-col gap-8 items-center font-bold max-w-md mx-auto text-center">
        No events found! Create your first event or ask an organizer to invite
        you to one.
        <a href="/events/organizing/create">
          <CTA btnType="cta">Create Event</CTA>
        </a>
      </div>
    );
  }

  return <div></div>;
}
