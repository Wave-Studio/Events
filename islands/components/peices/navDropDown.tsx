import { UserPartial } from "@/utils/db/kv.types.ts";
import Selector from "$tabler/selector.tsx";
import Dropdown from "@/islands/components/pickers/dropdown.tsx";
import CirclePlus from "$tabler/circle-plus.tsx";
import Settings from "$tabler/settings.tsx";
import UserCircle from "$tabler/user-circle.tsx"

const NavbarDropDown = ({ user }: { user: UserPartial }) => {
  return (
    <Dropdown
      className="ml-auto mr-1 md:mr-2 z-30 focus:outline-none my-auto"
      options={[
        {
          content: (
            <div class="flex items-center">
              <CirclePlus class="w-5 h-5 mr-2" /> <p>New Team</p>
            </div>
          ),
          onClick: () => alert("Teams is coming soon!"),
        },
				{
          content: (
            <div class="flex items-center">
              <Settings class="w-5 h-5 mr-2" /> <p>Settings</p>
            </div>
          ),
          onClick: () => alert("Settings is coming soon!"),
        },
      ]}
    >
      <button class="flex p-1 md:px-3 md:py-1.5 items-center hover:bg-gray-200 transition md:rounded-md rounded-full">
        <p class="font-medium hidden md:block">{user.email.split("@")[0]}</p>
        <Selector class="w-5 h-5 ml-2 hidden md:block" />
				<UserCircle class="w-6 h-6 block md:hidden" />
      </button>
    </Dropdown>
  );
};

export default NavbarDropDown;
