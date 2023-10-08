import useClickAway from "@/components/hooks/onClickAway.tsx";
import { useRef, useState } from "preact/hooks";
import CTA from "@/components/buttons/cta.tsx";
import X from "$tabler/x.tsx";

export default function EventDeletion({ eventID }: { eventID: string }) {
  const [loading, setLoading] = useState<boolean | string>(false);
  const [open, setOpen] = useState(false);

  const close = () => {
    setOpen(false);
  };

  const deleteEvent = async () => {
    setLoading(true);
    setLoading(false);
    const res = await fetch("/api/events/delete", {
      body: JSON.stringify({ eventID }),
      method: "POST",
    });
    const data = await res.json();
    if (data.error) {
      setLoading(data.error);
    } else if (!res.ok) {
      setLoading("An unknown error occurred");
    } else {
      window.location.href = "/events/organizing";
    }
  };

  const dialog = useRef<HTMLDivElement>(null);
  useClickAway([dialog], close);

  const DeleteUI = () => {
    if (!open) return null;

    return (
      <div class="fixed inset-0 bg-black/20 z-50 grid place-items-center">
        <div
          className="rounded-md bg-white shadow-lg border border-gray-300 p-4 flex flex-col relative mx-4"
          ref={dialog}
        >
          <h5 className="font-bold text-xl">Delete Event</h5>
          <p>Are you sure you want to delete this event?</p>
          <CTA
            btnType="secondary"
            btnSize="sm"
            className="bg-red-100 hover:bg-red-200 border border-red-300 text-red-500 mt-4 ml-auto"
            onClick={deleteEvent}
          >
            {loading ? "Deleting..." : "Yes, delete"}
          </CTA>
          <button
            className="absolute right-2 top-2 p-0.5 rounded-md hover:bg-gray-200 transition"
            onClick={close}
          >
            <X class="w-5 h-5" />
          </button>
          {typeof loading == "string" && (
            <p className="text-red-500 mt-2">Error: {loading}</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <div class="flex items-center">
        <h4 class="font-medium text-lg">Delete event</h4>
        <CTA
          btnType="secondary"
          btnSize="sm"
          className="bg-red-100 hover:bg-red-200 border border-red-300 text-red-500 ml-auto"
          onClick={() => setOpen(true)}
        >
          Delete Event
        </CTA>
      </div>
      <DeleteUI />
    </>
  );
}
