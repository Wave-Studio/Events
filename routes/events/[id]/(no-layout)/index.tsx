import { defineRoute, LayoutConfig, RouteContext } from "$fresh/server.ts";
import { Event, getUser, kv } from "@/utils/db/kv.ts";
import { isUUID } from "@/utils/db/misc.ts";
import { Roles } from "@/utils/db/kv.types.ts";
import CTA from "@/components/buttons/cta.tsx";
import { EventContext } from "@/routes/events/[id]/_layout.tsx";
import imagekit from "@/utils/imagekit.ts";
import { Fragment } from "preact";
import Left from "$tabler/chevron-left.tsx";

// export const config: LayoutConfig = {
//   skipInheritedLayouts: true, // Skip already inherited layouts
// };

export default defineRoute(
  async (req, ctx: RouteContext<void, EventContext>) => {
    // layout are disabled on this route, but I don't wanna disable every one. no clue how to do that
    const { event, eventID, user } = ctx.state.data;

    const scanning = Boolean(new URL(req.url).searchParams.get("scanning"));

    const banner = () => {
      if (imagekit && event.banner.path) {
        const getURL = (width: number) =>
          ["png", "webp"].map((fmt) =>
            imagekit!.url({
              path: event.banner.path!,
              transformation: [
                {
                  width: width.toString(),
                  quality: "75",
                  format: fmt,
                },
              ],
            }),
          );

        return {
          320: getURL(320),
          480: getURL(480),
          720: getURL(720),
          1080: getURL(1080),
          1280: getURL(1280),
          1440: getURL(1440),
          2160: getURL(2160),
          4320: getURL(4320),
        };
      }
    };

    

    const dateFmt = new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium"
    });

    const fmtDate = (date: Date) => dateFmt.format(date);

    const Header = () => (
      <div className="border p-6 flex flex-col rounded-md bg-white/90 backdrop-blur-xl">
        <h1 className="font-bold text-xl">{event.name}</h1>
        <p>{event.showTimes.length > 1 && "Showtimes start"} <span className="font-medium">{fmtDate(new Date(event.showTimes[0].startDate))}</span></p>
      </div>
    );

    return (
      <div className="flex flex-col">
        <div class="flex flex-col relative">
          {banner() ? (
            <picture>
              {Object.entries(banner()!).map(([width, [png, webp]]) => (
                <>
                  <source
                    srcset={png}
                    type="image/png"
                    media={`(max-width: ${width}px)`}
                  />
                  <source
                    srcset={webp}
                    type="image/webp"
                    media={`(max-width: ${width}px)`}
                  />
                </>
              ))}
              <img
                src={banner()![720]?.[0]}
                alt="Project icon"
                class={`${
                  event.banner.fill ? "object-fill" : "object-cover"
                } h-56 md:h-80 w-full rounded-b-lg md:rounded-b-2xl`}
              />
            </picture>
          ) : (
            <img
              class="object-cover h-56 md:h-80 rounded-b-lg md:rounded-b-2xl"
              src="/placeholder-small.jpg"
              srcset="/placeholder-small.jpg 640w, /placeholder.jpg 1440w, /placeholder-full.jpg 2100w"
              alt="Placeholder Image"
            />
          )}
          {user && (
            <a
              href="/events/organizing"
              class="group pl-0.5 rounded-md bg-black/20 border border-gray-300/20 backdrop-blur font-medium text-white pr-1.5 absolute top-3 left-3 text-sm flex items-center"
            >
              <Left class="w-4 h-4 mr-1 group transition group-hover:-translate-x-0.5" />{" "}
              All Events
            </a>
          )}
          {user && user.role != undefined && user.role <= 2 && (
            <a
              href="/events/organizing"
              class="rounded-md bg-black/20 border border-gray-300/20 backdrop-blur font-medium text-white px-1.5 absolute top-3 right-3 text-sm flex items-center"
            >
              Edit Event
            </a>
          )}
        </div>
        <div className="max-w-xl mb-10 mx-auto w-full -translate-y-10 flex flex-col px-4">
          <Header />
        </div>
      </div>
    );
  },
);
