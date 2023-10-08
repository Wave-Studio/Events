import { Signal } from "@preact/signals";
import { StateUpdater, useState, useEffect } from "preact/hooks";
import { Event } from "@/utils/db/kv.types.ts";
import ImagePicker from "@/components/pickers/image.tsx";
import CTA from "@/components/buttons/cta.tsx";

export default function StageThree({
  eventState,
  setPage,
}: {
  eventState: Signal<Event>;
  setPage: StateUpdater<number>;
  setError: StateUpdater<string | undefined>;
}) {
  const [eventID, setEventID] = useState<string>();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setError(undefined);
      const data = await (
        await fetch("/api/events/create", {
          body: JSON.stringify(eventState.value),
          method: "POST",
        })
      ).json();
      if (data.errors) {
        setError(data.errors[0]);
      } else {
        setEventID(data.eventID);
      }
    })();
  }, []);

  if (!eventID) {
    return (
      <div className="flex flex-col items-center justify-center">
        <h2 class="font-semibold text-xl mb-20 text-center">
          {error ? "Event Creation Failed" : "Creating your event..."}
        </h2>
        {/* btw fresh does caching automagiclly for images */}
        {/* <img src="/loading (2).svg" class="animate-spin" /> */}
        {error ? (
          <p className="text-8xl">🫠</p>
        ) : (
          <img src="/logo.svg" class="animate-ping" />
        )}

        {error && (
          <>
            <p className="text-red-500 mt-20">Error: {error}</p>
            <CTA
              btnType="cta"
              btnSize="sm"
              className=" mt-4"
              onClick={() => setPage(2)}
            >
              Back
            </CTA>
          </>
        )}
      </div>
    );
  }

  return (
    <div class="flex flex-col justify-center w-full0">
      <h2 class="font-semibold text-xl mb-20 text-center">Event Created!</h2>
      <ImagePicker
        uploading={loading}
        setUploading={setLoading}
        eventID={eventID}
      />
      <div className="flex justify-between mt-6 ">
        <a href="/events/organizing">
          <CTA
            btnType="secondary"
            btnSize="sm"
            className="!w-20 md:!w-40"
            disabled={loading}
          >
            <span className="sm:hidden">Events</span>
            <span className="hidden sm:block">All Events</span>
          </CTA>
        </a>
        <a href={`/events/${eventID}`}>
          <CTA
            btnType="cta"
            btnSize="sm"
            className="!w-20 md:!w-40"
            onClick={() => setPage(3)}
            disabled={loading}
          >
            <span className="sm:hidden">View</span>
            <span className="hidden sm:block">View Event</span>
          </CTA>
        </a>
      </div>
    </div>
  );
}
