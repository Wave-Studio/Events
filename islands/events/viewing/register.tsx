import { useState } from "preact/hooks";
import CTA from "@/components/buttons/cta.tsx";
import Popup from "@/components/popup.tsx";
import { ShowTime } from "@/utils/db/kv.types.ts";

export default function EventRegister({eventID, showTimes, email}: {eventID: string, showTimes: ShowTime[], email?: string}) {
  const [open, setOpen] = useState(true);

  const Popover = () => {
    return (
      <Popup close={() => setOpen(false)} isOpen={open}>
        <h2 class="font-bold text-lg">Get Tickets</h2>
      </Popup>
    );
  };

  return (
    <div className="mx-auto flex flex-col items-center mt-14">
      <p class="font-semibold mb-4 text-center">
        Want to attend? Regster and get your tickets now!
      </p>
      <CTA btnType="cta" onClick={() => setOpen(true)}>
        Get Tickets
      </CTA>
			<Popover />
    </div>
  );
}

export const EventRegisterSmall = () => {
  return (
    <button
      className="flex items-center select-none font-medium hover:bg-gray-200/75 hover:text-gray-900 transition text-sm mx-auto mb-2 mt-1 rounded-md bg-white/25 backdrop-blur-xl border px-1.5 py-0.5"
      onClick={() =>
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })
      }
    >
      Get Tickets
    </button>
  );
};
