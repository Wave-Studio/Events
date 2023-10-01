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

  if (events.filter((event) => event.value != null).length == 0) {
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

  return (
    <>
      <div className="grid grid-cols-2 gap-8">
        {events.map((event) => (
          <div className="rounded-md overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1647123817877-a35e45f66e9c?&auto=format&fit=crop&w=1887&q=80"
              alt=""
              class="w-full h-52 object-cover"
            />
            <div className="flex flex-col grow px-2">
              <h3 className="font-semibold text-2xl -translate-y-4 bg-white">
                {event.value?.name}
              </h3>
            </div>
          </div>
        ))}
      </div>
      <a href="/events/organizing/create" className="mt-10 mx-auto">
        <CTA btnType="cta" btnSize="sm">
          Create Event
        </CTA>
      </a>
    </>
  );
}
