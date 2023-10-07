import { RouteContext, defineRoute } from "$fresh/server.ts";
import {
  EventContext,
  badEventRequest,
} from "@/routes/events/[id]/_layout.tsx";
import { Event, Roles, User } from "@/utils/db/kv.types.ts";
import Footer from "@/components/layout/footer.tsx";
import Navbar from "@/components/layout/navbar.tsx";
import CTA from "@/components/buttons/cta.tsx";
import Trash from "$tabler/trash.tsx";
import Users from "$tabler/users-group.tsx";
import Tickets from "$tabler/ticket.tsx";
import World from "$tabler/world.tsx";
import Scan from "$tabler/text-scan-2.tsx";
import ChevronLeft from "$tabler/chevron-left.tsx";
import EditingImagePicker from "@/islands/events/editing/images.tsx";
import imageKit from "@/utils/imagekit.ts";
import { ComponentChildren } from "preact";
import EventSettings from "@/islands/events/editing/settings.tsx";
import { Heading } from "@/routes/(public)/faq.tsx";
import Button from "@/components/buttons/button.tsx";
// @ts-ignore Something brokey - Some Blocke
import ShowTimeSettings from "@/islands/events/editing/showtimesettings.tsx";
import EventDeletion from "@/islands/events/editing/delete.tsx";
import EventTicketSettings from "@/islands/events/editing/ticketSettings.tsx";

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

  const Header = () => {
    const buttons: { label: string; icon: ComponentChildren; href: string }[] =
      [
        {
          label: "Scan Tickets",
          icon: <Scan class="w-6 h-6" />,
          href: "./scanning",
        },
        // all tickets and team members are potentially going to be popups
        {
          label: "All Tickets",
          icon: <Tickets class="w-6 h-6" />,
          href: "./",
        },
        {
          label: "Team Members",
          icon: <Users class="w-6 h-6" />,
          href: "./",
        },
        {
          label: "Public Page",
          icon: <World class="w-6 h-6" />,
          href: "./",
        },
      ];

    return (
      <div className="flex justfy-between">
        <a href="/events/organizing">
          <CTA
            btnType="cta"
            btnSize="sm"
            className="!w-10 sm:!w-40 grid place-items-center"
          >
            <p class="hidden sm:block">Back to events</p>
            <ChevronLeft class="sm:hidden w-6 h-6 mr-0.5" />
          </CTA>
        </a>
        <div className="flex gap-2 md:gap-4 ml-auto">
          {buttons.map((btn) => (
            <Button {...btn} />
          ))}
        </div>
      </div>
    );
  };

  const Section = ({
    children,
    name,
  }: {
    children: ComponentChildren;
    name: string;
  }) => {
    return (
      <div className="flex flex-col">
        <div className="flex items-center mb-6 pb-2 bg-white sticky top-14 z-20">
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
          <Header />
          <Section name="Banner">
            <EditingImagePicker
              event={event}
              eventID={eventID}
              imgURL={imageURL}
            />
          </Section>
          <Section name="Event Basics">
            <EventSettings
              eventID={eventID}
              name={event.name}
              description={event.description}
              maxTickets={event.maxTickets}
              supportEmail={event.supportEmail}
              venue={event.venue}
            />
          </Section>
          <Section name="Showtimes">
            <ShowTimeSettings eventID={eventID} showTimes={event.showTimes} />
          </Section>
          <Section name="Ticketing Settings">
            <EventTicketSettings
              additionalFields={event.additionalFields}
              eventID={eventID}
              multiEntry={event.multiEntry}
              multiPurchase={event.multiPurchase}
            />
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
