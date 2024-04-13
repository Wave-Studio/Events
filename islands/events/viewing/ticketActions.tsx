import Button from "@/components/buttons/button.tsx";
import Printer from "$tabler/printer.tsx";
import TicketDeletion from "@/islands/events/viewing/delete.tsx";

const TicketActions = ({ ticketID }: { ticketID: string }) => {
	return (
		<div class="flex gap-4 print:hidden">
			<Button
				icon={<Printer class="size-6" />}
				label="Print Ticket"
				onClick={() => print()}
			/>
			<TicketDeletion ticketID={ticketID} />
		</div>
	);
};

export default TicketActions;
