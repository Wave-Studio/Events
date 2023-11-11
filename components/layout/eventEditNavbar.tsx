import { Roles } from "@/utils/db/kv.types.ts";
import ChevronLeft from "$tabler/chevron-left.tsx";
import Edit from "$tabler/table-options.tsx";
import World from "$tabler/world.tsx";
import { ComponentChildren } from "preact";
import Button from "@/components/buttons/button.tsx";
import CTA from "@/components/buttons/cta.tsx";
import Scan from "$tabler/text-scan-2.tsx";
import Users from "$tabler/users-group.tsx";
import Tickets from "$tabler/ticket.tsx";

export default function EventHeader({
  role,
  editPositon,
}: {
  role: Roles;
  editPositon: number;
}) {
  const buttons: { label: string; icon: ComponentChildren; href: string }[] = [
    {
      label: "Scan Tickets",
      icon: <Scan class="w-6 h-6" />,
      href: "./scanning",
    },
    // all tickets and team members are potentially going to be popups
    {
      label: "All Tickets",
      icon: <Tickets class="w-6 h-6" />,
      href: "./tickets",
    },
    {
      label: "Team Members",
      icon: <Users class="w-6 h-6" />,
      href: "./team",
    },
    {
      label: "Public Page",
      icon: <World class="w-6 h-6" />,
      href: "./",
    },
  ];

  if (editPositon > -1) {
    if (role <= 2) {
      buttons[editPositon] = {
        label: "Edit Event",
        icon: <Edit class="w-6 h-6" />,
        href: "./editing",
      };
    } else {
			buttons.splice(editPositon, 1)
		}
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
}
