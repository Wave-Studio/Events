import { useSignal } from "@preact/signals";
import { createPortal } from "preact/compat";
import { useState } from "preact/hooks";
import Popup from "@/components/popup.tsx";

export const Contact = ({ email }: { email: string }) => {
  const [open, setOpen] = useState(false);
  const checked = useSignal(false);
  return (
    <>
      <button
        className="flex items-center select-none font-medium hover:bg-gray-200/75 hover:text-gray-900 transition text-sm mt-4 rounded-md bg-white/25 backdrop-blur-xl border px-1.5 py-0.5"
        onClick={() => setOpen(true)}
      >
        Contact Organizer
      </button>
      {globalThis.document != undefined &&
        createPortal(
          <Popup
            isOpen={open}
            close={() => {
              setOpen(false);
              checked.value = false;
            }}
          >
            <h2 class="font-bold text-lg">Contact Organizer</h2>
            <h3 class="font-medium mt-2">Are you sure?</h3>
            <p>
              Are you looking for Events support or an organizer contact email?
              It's simple and easy to contact Events, the ticketing platform
              used to make this event. Create a ticket by emailing Events at{" "}
              <a
                href="mailto:support@events-help.freshdesk.com"
                class="underline font-medium"
              >
                support@events-help.freshdesk.com
              </a>
              .
            </p>
            <p class="mt-4 text-pretty">
              Still want to contact the organizer? Agree to our terms below to
              access it.
            </p>
            <label class="flex mt-4 items-start cursor-pointer">
              <input
                type="checkbox"
                name="agreed"
                class="mr-4 mt-1.5"
                onClick={(e) => (checked.value = e.currentTarget.checked)}
                disabled={checked.value}
              />
              <p>
                I agree to interacting with this email in a professional way and
                following our guidelines as outlined in our{" "}
                <a href="/terms-of-service" class="font-medium underline">
                  terms and conditions
                </a>
              </p>
            </label>
            {checked.value && (
              <p class="mt-6">
                Organizer contact email:{" "}
                <a href={`mailto:${email}`} class="font-medium underline">
                  {email}
                </a>
              </p>
            )}
          </Popup>,
          document.body,
        )}
    </>
  );
};
