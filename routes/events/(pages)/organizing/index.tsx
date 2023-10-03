import { Event, getUser, kv } from "@/utils/db/kv.ts";
import { AppContext } from "$fresh/server.ts";
import { renderToString } from "preact-render-to-string";
import CTA from "@/components/buttons/cta.tsx";
import imageKit from "@/utils/imagekit.ts";
import World from "$tabler/world.tsx";
import ChevronDown from "$tabler/chevron-down.tsx";

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

  const Event = ({ e, id }: { e: Event; id: string }) => {
    const datFmt = new Intl.DateTimeFormat("en-US", {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
    });

    const pricefmt = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });

    return (
      <div className="rounded-md overflow-hidden border border-gray-300">
        <div className="relative h-48">
          {e.banner.path ? (
            (() => {
              const url = imageKit.url({
                path: e.banner.path,
                transformation: [
                  {
                    width: "400",
                    quality: "85",
                  },
                ],
              });
              return (
                <img
                  src={url}
                  alt=""
                  class={`w-full h-48 ${
                    e.banner.fill ? "object-fill" : "object-cover"
                  }`}
                />
              );
            })()
          ) : (
            <>
              <img
                src="/placeholder-small.jpg"
                alt=""
                class="h-48 w-full object-cover"
              />
              <div className="absolute inset-0 flex justify-center">
                <p className="text-sm mt-1 font-bold text-white/75 mb-6 z-10">
                  Placeholder Banner
                </p>
              </div>
            </>
          )}

          <div className="absolute top-1.5 right-1.5 flex justify-end gap-2">
            <div className="rounded-md flex items-center gap-2 text-white font-medium text-sm backdrop-blur-sm bg-black/20 px-2 py-0.5">
              {e.maxTickets}
            </div>
            {e.price !== 0 && (
              <div className="rounded-md flex items-center gap-2 text-white font-medium text-sm backdrop-blur-sm bg-black/20 px-2 py-0.5">
                {pricefmt.format(e.price)}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col grow px-4 py-3 h-60">
          <div className="flex overflow-x-auto scrollbar-fancy snap-x gap-2">
            {e.showTimes.map((time) => (
              <div className="rounded-md bg-gray-100 border text-xs font-medium px-1 snap-start">
                {datFmt.format(new Date(time.startDate))}
              </div>
            ))}
          </div>
          <h3 className="font-bold text-xl bg-white line-clamp-1">{e.name}</h3>
          {e.venue && <h4 class="-mt-0.5 mb-0.5 text-sm font-semibold truncate">{e.venue}</h4>}
          {e.description && (
            <div class="text-sm relative">
              <p className="line-clamp-6">{e.description}</p>
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0)_20%,rgba(255,255,255,1)_100%)]" />
            </div>
          )}
          <div className="justify-between mt-auto flex">
            <a href={`/events/${id}`}>
              <CTA
                btnType="secondary"
                btnSize="sm"
                className="!w-10 grid place-items-center"
              >
                <World class="w-6 h-6" />
              </CTA>
            </a>
            <a href={`/events/${id}?editing=true`}>
              <CTA btnType="cta" btnSize="sm">
                Edit Event
              </CTA>
            </a>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="grid md:grid-cols-2 gap-8">
        {events.map((event) => {
          if (!event || !event.value) return null;

          return <Event e={event.value} id={event.key[1] as string} />;
        })}
      </div>
      <div className="mt-36 mx-auto flex flex-col items-center">
        <p className="text-center font-bold mb-8">Create another event or ask an organizer to invite you to one.</p>
        <a href="/events/organizing/create">
          <CTA btnType="cta" btnSize="sm">
            Create Event
          </CTA>
        </a>
      </div>
    </>
  );
}
