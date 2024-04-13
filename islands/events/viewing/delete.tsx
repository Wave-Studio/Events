import Deletion from "../components/delete.tsx";
import { useSignal } from "@preact/signals";
import Button from "@/components/buttons/button.tsx";
import Trash from "$tabler/trash.tsx";

const TicketDeletion = ({ ticketID }: { ticketID: string }) => {
	const open = useSignal(false);

	return (
		<Deletion
			fetch={() =>
				fetch("/api/events/ticket/delete", {
					body: JSON.stringify({ ticketID }),
					method: "POST",
				})
			}
			name="ticket"
			open={open}
			routeTo={`/events/${ticketID.split("_")[0]}`}
		>
			<Button
				icon={<Trash class="size-6" />}
				label="Give Up Ticket"
				onClick={() => (open.value = true)}
			/>
		</Deletion>
	);
};

export default TicketDeletion;
