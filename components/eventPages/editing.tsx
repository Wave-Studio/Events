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

export default function EventEditing({
  event,
  eventID,
  user,
  role,
}: {
  event: Event;
  user: User;
  eventID: string;
  role: Roles;
}) {
  const imageURL =
    event.banner.path &&
    imageKit.url({
      path: event.banner.path,
      transformation: [
        {
          width: "750",
          quality: "90",
        },
      ],
    });

  const Header = () => {
    const buttons: { label: string; icon: ComponentChildren }[] = [
      {
        label: "Scan Tickets",
        icon: <Scan class="w-6 h-6" />,
      },
      {
        label: "All Tickets",
        icon: <Tickets class="w-6 h-6" />,
      },
      {
        label: "Team Members",
        icon: <Users class="w-6 h-6" />,
      },
      {
        label: "Public Page",
        icon: <World class="w-6 h-6" />,
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
          {buttons.map(({ label, icon }) => (
            <div className="relative flex flex-col items-end md:items-center">
              <CTA
                btnType="secondary"
                btnSize="sm"
                className="!w-10 grid place-items-center peer"
              >
                {icon}
              </CTA>
              <div className="absolute w-32 bg-white border border-gray-300 rounded-md text-center shadow-xl top-12 select-none scale-95 opacity-0 peer-hover:scale-100 peer-hover:opacity-100 transition">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <main class="flex flex-col min-h-screen">
      <Navbar />
      <div className="grow ">
        <div className="px-4 max-w-screen-md w-full mx-auto flex flex-col gap-8">
          <Header />
          <Heading name="Banner" />
          <EditingImagePicker
            event={event}
            eventID={eventID}
            imgURL={imageURL}
          />
          <Heading name="Event Basics" />
          <EventSettings
            eventID={eventID}
            name={event.name}
            description={event.description}
            maxTickets={event.maxTickets}
            supportEmail={event.supportEmail}
            venue={event.venue}
          />
          <Heading name="Showtimes" />
          <Heading name="Tickets" />
          <Heading name="Other Settings" />
          <Heading name="Danger Zone" />
          event editing coming soon:tm:
        </div>
      </div>
      <Footer />
    </main>
  );
}
