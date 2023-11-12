import Select from "@/islands/components/pickers/select.tsx";
import Dropdown from "@/islands/components/pickers/dropdown.tsx";
import DotsVertical from "$tabler/dots-vertical.tsx";
import { Event } from "@/utils/db/kv.ts";

export default function ManageUser({
  user,
  eventID,
}: {
  user: Event["members"][0];
  eventID: string;
}) {
  const updateUserRole = async (role: number) => {
    const realRole = role + 1;
    if (realRole == user.role) return;
    const res = await fetch(`/api/events/team/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ eventID, email: user.email, role: realRole }),
    });
    const json = await res.json();

    if (json.success) {
      // So changing again doesn't cause ui weirdness
      user.role = realRole;
    }
  };

  const transferOwnership = async () => {
    // Close some modal or whatever
    await updateUserRole(-1);
  };

  // Halo betrayal sound effect - Bloxs
  const removeUser = async () => {
    const res = await fetch(`/api/events/team/remove`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ eventID, email: user.email }),
    });
    const json = await res.json();

    if (json.success) {
      // Maybe eventually updated client side to not refresh - Bloxs
      location.reload();
    }
  };

  return (
    <>
      <Select
        options={["Admin", "Manager", "Scanner"]}
        selectClassName="py-1"
        // Owner comes first and that's not in this dropdown
        selected={user.role - 1}
        updateOption={updateUserRole}
      />
      <Dropdown
        options={[
          {
            content: "Transfer Ownership",
            onClick: () => {
              // TODO: @lukas Open some modal then run transferOwnership - Bloxs
              console.log("transfer ownership");
            },
          },
          {
            content: "Remove User",
            onClick: removeUser,
          },
        ]}
      >
        <div className={`w-8 grid place-items-center border h-8 rounded-md`}>
          <DotsVertical class="h-5 w-5" />
        </div>
      </Dropdown>
    </>
  );
}
