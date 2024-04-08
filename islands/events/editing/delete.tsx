import CTA from "@/components/buttons/cta.tsx";
import Deletion from "../components/delete.tsx";
import { useSignal } from "@preact/signals";

const EventDeletion = ({ eventID }: { eventID: string }) => {
  const open = useSignal(false);

  return (
    <Deletion
      fetch={() =>
        fetch("/api/events/delete", {
          body: JSON.stringify({ eventID }),
          method: "POST",
        })}
      name="event"
      open={open}
      routeTo="/events/organizing"
    >
      <div class="flex items-center">
        <h4 class="font-medium text-lg">Delete event</h4>
        <CTA
          btnType="secondary"
          btnSize="sm"
          className="bg-red-100 hover:bg-red-200 border border-red-300 text-red-500 ml-auto"
          onClick={() => (open.value = true)}
        >
          Delete Event
        </CTA>
      </div>
    </Deletion>
  );
};

export default EventDeletion;
