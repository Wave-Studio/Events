import Select from "@/islands/components/pickers/select.tsx";
import Dropdown from "@/islands/components/pickers/dropdown.tsx";
import DotsVertical from "$tabler/dots-vertical.tsx";
import { Event, Roles, User } from "@/utils/db/kv.types.ts";
import Loading from "$tabler/loader-2.tsx";
import { useSignal } from "@preact/signals";
import Popup from "@/components/popup.tsx";
import CTA from "@/components/buttons/cta.tsx";

export default function ManageUser({
  user,
  eventID,
  client,
  clientRole,
}: {
  user: Event["members"][0];
  eventID: string;
  client: User;
  clientRole: Roles;
}) {
  const loading = useSignal(false);
  const transferOpen = useSignal(false);

  const rolesToShow = ["Admin", "Manager", "Scanner"].filter((r, i) => {
    if (clientRole == Roles.OWNER) return true;
    if (clientRole <= user.role) {
      return i + 1 >= user.role;
    }
  });

  const updateUserRole = async (role: number) => {
    loading.value = true;
    const realRole = 3 - rolesToShow.length + role + 1;
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
    loading.value = false;
  };

  const transferOwnership = async () => {
    // Close some modal or whatever
    await updateUserRole(-1);
    transferOpen.value = false;
    location.reload();
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

  const TransferUI = () => {
    return (
      <Popup
        isOpen={transferOpen.value}
        close={() => (transferOpen.value = false)}
      >
        <h3 className="font-bold text-xl">Transfer Ownership</h3>
        <p>
          Are you sure you want to transfer ownership of this event? This action
          is irrevocable and cannot be undone!
        </p>
        <CTA
          btnType="secondary"
          btnSize="sm"
          className="bg-red-100 hover:bg-red-200 border border-red-300 text-red-500 mt-4 ml-auto"
          onClick={transferOwnership}
        >
          {loading.value ? "Transfering..." : "Yes, transfer"}
        </CTA>
      </Popup>
    );
  };

  return (
    <>
      <TransferUI />
      <div class="flex gap-2 justify-end items-center">
        <Loading class={`h-6 w-6 animate-spin ${!loading.value && "hidden"}`} />
        <Select
          options={["Admin", "Manager", "Scanner"].filter((r, i) => {
            if (clientRole == Roles.OWNER) return true;
            if (clientRole <= user.role) {
              return i + 1 >= user.role;
            }
          })}
          selectClassName="py-1"
          // Owner comes first and that's not in this dropdown
          selected={user.role - 1 - rolesToShow.length - 3}
          updateOption={updateUserRole}
          disabled={clientRole == Roles.SCANNER || clientRole > user.role}
        />

        {clientRole == Roles.SCANNER ||
        (clientRole >= user.role && user.email != client.email) ? (
          <></>
        ) : (
          <Dropdown
            options={[
              ...(user.role == Roles.OWNER
                ? [
                    {
                      content: "Transfer Ownership",
                      onClick: () => (transferOpen.value = true),
                    },
                  ]
                : []),
              {
                content: "Remove User",
                onClick: removeUser,
              },
            ]}
          >
            <div
              className={`w-8 grid place-items-center border h-8 rounded-md`}
            >
              <DotsVertical class="h-5 w-5" />
            </div>
          </Dropdown>
        )}
      </div>
    </>
  );
}
