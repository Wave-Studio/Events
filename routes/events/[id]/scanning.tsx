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
import { Heading } from "@/routes/(public)/faq.tsx";
import Button from "@/components/buttons/button.tsx";
import Scanner from "@/islands/events/scanning.tsx";
import EventHeader from "@/components/layout/eventEditNavbar.tsx";

export default defineRoute((req, ctx: RouteContext<void, EventContext>) => {
  const { event, eventID, user } = ctx.state.data;

  if (!user || user.role == undefined || user.role > 3) {
    return badEventRequest;
  }

  return (
    <main className="px-4 max-w-screen-md w-full mx-auto flex flex-col gap-8 grow mb-10">
      <EventHeader editPositon={0} role={user.role} />
      <Scanner className="rounded-md border border-gray-300 grow bg-gray-200" />
    </main>
  );
});
