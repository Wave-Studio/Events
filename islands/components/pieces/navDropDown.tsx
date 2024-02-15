import { User } from "@/utils/db/kv.types.ts";
import Selector from "$tabler/selector.tsx";
import Dropdown from "@/islands/components/pickers/dropdown.tsx";
import CirclePlus from "$tabler/circle-plus.tsx";
import Edit from "$tabler/table-options.tsx";
import Settings from "$tabler/settings.tsx";
import Tickets from "$tabler/ticket.tsx";
import UserCircle from "$tabler/user-circle.tsx";
import Logout from "$tabler/logout-2.tsx";
import { useSignal } from "@preact/signals";

const NavbarDropDown = ({ user }: { user: User }) => {
  const open = useSignal(false);

  return (
    <Dropdown
      isOpen={open}
      className="ml-auto mr-3 md:mr-2 z-30 focus:outline-none my-auto"
      options={[
        {
          content: (
            <div class="flex items-center">
              <Tickets class="size-5 mr-2" /> <p>Tickets</p>
            </div>
          ),
          link: "/events/attending",
        },
        {
          content: (
            <div class="flex items-center">
              <Edit class="size-5 mr-2" /> <p>Organizing</p>
            </div>
          ),
          link: "/events/organizing",
          breakBelow: true,
        },
        {
          content: (
            <div class="flex items-center">
              <CirclePlus class="size-5 mr-2" /> <p>New Team</p>
            </div>
          ),
          onClick: () => alert("Teams is coming soon!"),
        },
        {
          content: (
            <div class="flex items-center">
              <Settings class="size-5 mr-2" /> <p>Settings</p>
            </div>
          ),
          link: "/user/settings",
        },
        {
          content: (
            <div class="flex items-center text-red-500">
              <Logout class="size-5 mr-2" /> <p>Logout</p>
            </div>
          ),
          className: "bg-red-100 hover:!bg-red-200",
          onClick: () => {
            document.cookie =
              "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            location.href = "/";
          },
          //link: "/"
        },
      ]}
    >
      <button
        class={`${
          open.value ? "bg-gray-200" : "hover:bg-gray-200"
        } flex p-1 md:px-3 md:py-1.5 items-center transition md:rounded-md rounded-full`}
      >
        <p class="font-medium hidden md:block max-w-sm truncate">
          {user.email.split("@")[0]}
        </p>
        <Selector class="size-5 ml-1 hidden md:block text-gray-600" />
        <UserCircle class="size-6 block md:hidden" />
      </button>
    </Dropdown>
  );
};

export default NavbarDropDown;
