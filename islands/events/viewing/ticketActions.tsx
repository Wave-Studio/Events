import Button from "@/components/buttons/button.tsx";
import Printer from "$tabler/printer.tsx"
import Trash from "$tabler/trash.tsx"

const TicketActions = () => {
  return (
    <div class="flex gap-4 print:hidden">
      <Button icon={<Printer class="size-6" />} label="Print Ticket" onClick={() => print()} />
      <Button icon={<Trash class="size-6" />} label="Give Up Ticket" />
    </div>
  );
};

export default TicketActions;
