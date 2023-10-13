import { defineRoute, LayoutConfig, RouteContext } from "$fresh/server.ts";
import { Event, getUser, kv } from "@/utils/db/kv.ts";
import { isUUID } from "@/utils/db/misc.ts";
import { Roles } from "@/utils/db/kv.types.ts";
import CTA from "@/components/buttons/cta.tsx";
import { EventContext } from "@/routes/events/[id]/_layout.tsx";
import imagekit from "@/utils/imagekit.ts";
import { Component, ComponentChildren, Fragment, JSX } from "preact";
import Left from "$tabler/chevron-left.tsx";
import Location from "$tabler/map-pin.tsx";
import Calender from "$tabler/calendar.tsx";
import Check from "$tabler/circle-check.tsx";
import Warn from "$tabler/alert-circle.tsx";
import Urgent from "$tabler/urgent.tsx";

import EventRegister, {
  EventRegisterSmall,
} from "@/islands/events/viewing/register.tsx";
import Footer from "@/components/layout/footer.tsx";
import { fmtDate, fmtTime } from "@/utils/dates.ts";

export default defineRoute((req, ctx: RouteContext<void, EventContext>) => {
  // layout are disabled on this route, but I don't wanna disable every one. no clue how to do that
  const { event, eventID, user } = ctx.state.data;

  const banner = () => {
    if (imagekit && event.banner.path) {
      const getURL = (width: number) =>
        ["png", "webp"].map((fmt) =>
          imagekit!.url({
            path: event.banner.path!,
            transformation: [
              {
                width: width.toString(),
                quality: "85",
                format: fmt,
              },
            ],
          }),
        );

      return {
        320: getURL(320),
        480: getURL(480),
        720: getURL(720),
        900: getURL(900),
        1080: getURL(1080),
        1280: getURL(1280),
        1440: getURL(1440),
        2160: getURL(2160),
        4320: getURL(4320),
      };
    }
  };

  const Avalibility = ({
    maxTickets,
    tickets,
  }: {
    tickets: number;
    maxTickets: number;
  }): JSX.Element => {
    // semi-jank solution
    const className = "flex items-center [&>svg]:w-5 [&>svg]:mr-2";
    const messages: JSX.Element[] = [
      <p class={`text-green-500 ${className}`}>
        <Check /> Tickets Avalible
      </p>,
      <p class={`text-amber-500 flex ${className}`}>
        <Warn /> Some Tickets Avalible
      </p>,
      <p class={`text-orange-600 flex ${className}`}>
        <Warn /> Few Tickets Left
      </p>,
      <p class={`text-red-500 flex ${className}`}>
        <Urgent /> {maxTickets - tickets} Tickets Left
      </p>,
    ];

    if (maxTickets - tickets < 10) return messages[3];

    const diviser = tickets / maxTickets;

    if (diviser < 0.6) return messages[0];
    if (diviser < 0.7) return messages[1];
    return messages[2];
  };

  const ShowTimes = () => {
    if (event.showTimes.length == 1) return null;

    return (
      <>
        <h2 class="font-bold text-xl mt-6 mb-2">Showtimes</h2>
        <div class="flex overflow-x-auto snap-x gap-4 scrollbar-fancy">
          {event.showTimes.map((time) => (
            <div class="rounded-md border p-4 snap-start w-72 min-w-[18rem] select-none">
              <p class="font-medium">
                {fmtDate(new Date(time.startDate))}{" "}
                <span class="lowercase">
                  {time.startTime &&
                    `(${fmtTime(new Date(time.startTime))}${
                      time.endTime
                        ? ` - ${fmtTime(new Date(time.endTime))}`
                        : ""
                    })`}
                </span>
              </p>
              <div class="flex flex-col gap-2 text-sm">
                {time.lastPurchaseDate && (
                  <p>
                    <span class="text-gray-600">Sales end</span>{" "}
                    {fmtDate(new Date(time.lastPurchaseDate))}
                  </p>
                )}
                {
                  <Avalibility
                    maxTickets={time.maxTickets}
                    tickets={time.soldTickets}
                  />
                }
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };

  const Header = () => (
    <>
      <div className="flex gap-2 md:gap-4 mb-2 justify-between md:justify-start flex-wrap">
        <div className="flex items-center rounded-md bg-white/[0.85] backdrop-blur-xl border px-1.5 py-0.5 ">
          <Calender class="h-4 w-4 mr-1.5 text-gray-700" />
          <p class="break-keep">
            {event.showTimes.length > 1 && "Showtimes start"}{" "}
            <span className="font-medium">
              {fmtDate(new Date(event.showTimes[0].startDate))}{" "}
              <span class="lowercase">
                {event.showTimes.length == 1 &&
                  event.showTimes[0].startTime &&
                  `(${fmtTime(new Date(event.showTimes[0].startTime))}${
                    event.showTimes[0].endTime
                      ? ` - ${fmtTime(new Date(event.showTimes[0].endTime))}`
                      : ""
                  })`}
              </span>
            </span>
          </p>
        </div>
        {event.venue && (
          <div className="flex items-center rounded-md bg-white/[0.85] backdrop-blur-xl border px-1.5 py-0.5 ">
            <Location class="w-4 h-4 mr-1.5 text-gray-700" />
            <p className="truncate max-w-[12rem]">{event.venue}</p>
          </div>
        )}
      </div>

      <div className="border p-4 flex flex-col rounded-md bg-white/[0.85] backdrop-blur-xl">
        <h1 className="font-bold text-2xl text-center md:text-left">
          {event.name}
        </h1>
        <EventRegisterSmall />
        <h2 className="font-semibold mt-4 mb-1 text-sm">Event in Breif</h2>
        <p class="mb-4">{event.summary}</p>
        <h2 className="font-semibold mb-1 text-sm">Event Description</h2>
        <p class=" whitespace-pre-line">{event.description}</p>
        {event.showTimes.length == 1 && event.showTimes[0].lastPurchaseDate && (
          <p class="text-xs text-gray-600 text-center mt-2">
            The last day to get tickets is{" "}
            {fmtDate(new Date(event.showTimes[0].lastPurchaseDate))}
          </p>
        )}
      </div>
    </>
  );

  const clientShowTimes = event.showTimes.map((time) => {
    const { maxTickets: _, soldTickets: __, ...st } = time;
    return st;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <div class="flex flex-col">
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
              src={banner()![480]?.[0]}
              alt="Project icon"
              class={`${
                event.banner.fill ? "object-fill" : "object-cover"
              } h-56 md:h-96 w-full rounded-b-lg md:rounded-b-2xl`}
            />
          </picture>
        ) : (
          <img
            class="object-cover h-56 md:h-96 rounded-b-lg md:rounded-b-2xl "
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
            href={`/events/${eventID}/editing`}
            class="rounded-md bg-black/20 border border-gray-300/20 backdrop-blur font-medium text-white px-1.5 absolute top-3 right-3 text-sm flex items-center"
          >
            Edit Event
          </a>
        )}
      </div>
      <div className="max-w-2xl mx-auto w-full mb-36 md:mb-16 mt-4 md:-mt-28 flex flex-col px-4 static grow">
        <Header />
        <ShowTimes />
        <EventRegister
          eventID={eventID}
          showTimes={clientShowTimes}
          email={user?.data.email}
          additionalFields={event.additionalFields}
          multiPurchase={event.multiPurchase}
        />

        {event.showTimes.length === 1 && (
          <div class="mx-auto mt-2 text-sm">
            <Avalibility
              tickets={event.showTimes[0].soldTickets}
              maxTickets={event.showTimes[0].maxTickets}
            />
          </div>
        )}
      </div>
      <p class="text-center max-w-sm mx-auto mb-4 text-sm">
        This event was made with{" "}
        <a className="font-medium underline" href="/">
          Events
        </a>
        , an simple and easy to use event booking platform.
      </p>
      <Footer includeWave={false} />
    </div>
  );
});
