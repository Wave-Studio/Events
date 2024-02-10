import Button from "@/components/buttons/button.tsx";
import Select from "@/islands/components/pickers/select.tsx";
import Plus from "$tabler/plus.tsx";
import { signal, useSignal } from "@preact/signals";
import { Roles } from "@/utils/db/kv.types.ts";

export default function Invite({ eventID }: { eventID: string }) {
  const inviteEmail = signal<string>("");
  const role = signal<Roles>(Roles.ADMIN);
  const error = useSignal<undefined | string>(undefined);

  const invite = async () => {
    if (inviteEmail.value == "") return;
    const res = await fetch(`/api/events/team/invite`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ eventID, inviteEmail: inviteEmail.value, role }),
    });
    const json = await res.json();

    if (json.success) {
      error.value = undefined;
      inviteEmail.value = "";
      role.value = Roles.ADMIN;
      // Maybe eventually updated client side to not refresh - Bloxs
      location.reload();
    } else if (json.error || !json.success) {
      error.value = json.error || "occurred";
    }
  };

  return (
    <>
      <div class="flex mt-4 gap-2 flex-col md:flex-row">
        <input
          class="rounded-md border py-1.5 px-2 grow"
          placeholder="Team Member Email"
          type="email"
          value={inviteEmail}
          onInput={(e) => (inviteEmail.value = e.currentTarget.value)}
        />
        <div class="flex gap-2">
          <Select
            options={["Admin", "Manager", "Scanner"]}
            updateOption={(option) => {
              role.value = (option + 1) as 1 | 2 | 3;
            }}
            className="grow md:grow-0"
          />
          <Button
            icon={<Plus class="size-6" />}
            label="Add Member"
            onClick={invite}
          />
        </div>
      </div>
      {error.value && <p class="text-red-500">Error: {error.value}</p>}
    </>
  );
}
