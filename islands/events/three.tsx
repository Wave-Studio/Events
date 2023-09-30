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
  const [eventID, setEventID] = useState();
  const [error, setError] = useState()
  const [fileLink, setFileLink] = useState<string>();
  const [fill, setFill] = useState(false);

  useEffect(() => {
    (async () => {
      const data = await (await fetch("/api/events/create", {
        body: JSON.stringify(eventState.value),
        method: "POST"
      })).json()
      if (data.errors) {
        setError(data.errors[0])
      } else {
        setEventID(data.eventID);
      }
      console.log(data)
      
    })();
  }, []);

  if (!eventID) {
    return (
      <div className="flex flex-col items-center justify-center">
        <h2 class="font-semibold text-xl mb-20 text-center">
          Creating your event...
        </h2>
        {/* btw fresh does caching automagiclly for images */}
        {/* <img src="/loading (2).svg" class="animate-spin" /> */}
        <img src="/logo.svg" class="animate-ping" />
        {error && 
        <>
        <p className="text-red-500 mt-20">
          Error: {error}
        </p> 
        <CTA
          btnType="cta"
          btnSize="sm"
          className=" mt-4"
          onClick={() => setPage(2)}
        >
          Back
        </CTA>
        </>}
      </div>
    );
  }

  return (
    <div class="flex flex-col justify-center w-full0">
      <h2 class="font-semibold text-xl mb-20 text-center">Event Created!</h2>
      <ImagePicker
        fill={fill}
        setFill={setFill}
        updateImage={setFileLink}
        eventID={eventID}
      />
      <div className="flex justify-between mt-6 ">
        
        <a href="/events/organizing">
        <CTA
          btnType="secondary"
          btnSize="sm"
          className="!w-20 md:!w-40"
          disabled={fileLink == "loading"}
        >
          All Events
        </CTA>
        </a>
        <CTA
          btnType="cta"
          btnSize="sm"
          className="!w-20 md:!w-40"
          onClick={() => setPage(3)}
          disabled={fileLink == "loading"}
        >
          View Event
        </CTA>
      </div>
    </div>
  );
}
