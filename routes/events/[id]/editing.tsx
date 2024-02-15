import { defineRoute, RouteContext } from "$fresh/server.ts";
import {
  badEventRequest,
  EventContext,
} from "@/routes/events/[id]/_layout.tsx";
import EditingImagePicker from "@/islands/events/editing/images.tsx";
import imageKit from "../../../utils/imagekit/index.ts";
import { ComponentChildren } from "preact";
import EventSettings from "@/islands/events/editing/settings.tsx";
import ShowTimeSettings from "@/islands/events/editing/showtimesettings.tsx";
import EventDeletion from "@/islands/events/editing/delete.tsx";
import EventHeader from "@/components/layout/eventEditNavbar.tsx";

export default defineRoute((req, ctx: RouteContext<void, EventContext>) => {
  const { event, eventID, user } = ctx.state.data;

  if (!user || user.role == undefined || user.role > 2) {
    return badEventRequest;
  }

  const imageURL =
    event.banner.path &&
    imageKit!.url({
      path: event.banner.path,
      transformation: [
        {
          width: "750",
          quality: "90",
        },
      ],
    });

  const Section = ({
    children,
    name,
  }: {
    children: ComponentChildren;
    name: string;
  }) => {
    return (
      <div className="flex flex-col">
        <div className="flex items-center mb-6 pb-2 pt-1 bg-white sticky top-12 z-20">
          <h2 className="font-bold">{name}</h2>
          <div class="grow ml-6 h-0.5 bg-gray-300 rounded-full" />
        </div>
        <div className="flex flex-col gap-8">{children}</div>
      </div>
    );
  };

  return (
    <main class="flex flex-col grow">
      <div className="grow ">
        <div className="px-4 max-w-screen-md w-full mx-auto flex flex-col space-y-28 mb-20">
          <EventHeader editPosition={-1} role={user.role} />
          <Section name="Banner">
            <EditingImagePicker
              event={event}
              eventID={eventID}
              imgURL={imageURL}
            />
          </Section>
          <Section name="Event Basics">
            <EventSettings
              summary={event.summary}
              eventID={eventID}
              name={event.name}
              description={event.description}
              supportEmail={event.supportEmail}
              venue={event.venue}
            />
          </Section>
          <Section name="Event Times">
            <ShowTimeSettings eventID={eventID} showTimes={event.showTimes} />
          </Section>
          {user.role <= 1 && (
            <>
              <Section name="Danger Zone">
                <EventDeletion eventID={eventID} />
              </Section>
            </>
          )}
        </div>
      </div>
    </main>
  );
});
