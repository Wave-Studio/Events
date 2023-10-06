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
import Edit from "$tabler/table-options.tsx";
import ChevronLeft from "$tabler/chevron-left.tsx";
import EditingImagePicker from "@/islands/events/editing/images.tsx";
import imageKit from "@/utils/imagekit.ts";
import { ComponentChildren } from "preact";
import EventSettings from "@/islands/events/editing/settings.tsx";
import { Heading } from "@/routes/(public)/faq.tsx";
import Button from "@/components/buttons/button.tsx";
import Scanner from "@/islands/events/scanning.tsx";

export default defineRoute((req, ctx: RouteContext<void, EventContext>) => {
  const { event, eventID, user } = ctx.state.data;

  if (!user || user.role == undefined || user.role > 3) {
    return badEventRequest;
  }

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
    const buttons: {
      label: string;
      icon: ComponentChildren;
      href: string;
    }[] = [
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

    if (user.role! <= 2) {
      buttons.unshift({
        label: "Edit Event",
        icon: <Edit class="w-6 h-6" />,
        href: "./editing",
      });
    }

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

  return (
    <main className="px-4 max-w-screen-md w-full mx-auto flex flex-col gap-8 grow mb-10">
      <Header />
      <Scanner className="rounded-md border border-gray-300 grow" />
    </main>
  );
});