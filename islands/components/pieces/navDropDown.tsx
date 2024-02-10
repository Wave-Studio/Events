import { UserPartial } from "@/utils/db/kv.types.ts";
import Selector from "$tabler/selector.tsx";
import Dropdown from "@/islands/components/pickers/dropdown.tsx";
import CirclePlus from "$tabler/circle-plus.tsx";
import Settings from "$tabler/settings.tsx";
import UserCircle from "$tabler/user-circle.tsx";
import { useSignal } from "@preact/signals";

const NavbarDropDown = ({ user }: { user: UserPartial }) => {
  const open = useSignal(false);

  return (
    <Dropdown
      isOpen={open}
      className="ml-auto mr-3 md:mr-2 z-30 focus:outline-none my-auto"
      options={[
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
          onClick: () => alert("Settings is coming soon!"),
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
