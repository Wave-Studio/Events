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
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File>();
  const [fill, setFill] = useState(false);
  useEffect(() => {
    (async () => {
      //const data = await (await fetch("https://api.sampleapis.com/coffee/hot")).json()
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center">
        <h2 class="font-semibold text-xl mb-20 text-center">
          Creating your event...
        </h2>
        {/* btw fresh does caching automagiclly for images */}
        {/* <img src="/loading (2).svg" class="animate-spin" /> */}
        <img src="/logo.svg" class="animate-ping" />
      </div>
    );
  }

  return (
    <div class="flex flex-col items-center justify-center w-full">
      <h2 class="font-semibold text-xl mb-20 text-center">Event Created!</h2>
      <ImagePicker fill={fill} setFill={setFill} updateImage={setFile} />
      <div className="flex justify-between mt-6">
        <CTA
          btnType="secondary"
          btnSize="sm"
          className="!w-20 md:!w-40"
          type="button"
          onClick={() => setPage(1)}
        >
          Back
        </CTA>
        <CTA
          btnType="cta"
          btnSize="sm"
          className="!w-20 md:!w-40"
          onClick={() => setPage(3)}
        >
          Create Event
        </CTA>
      </div>
    </div>
  );
}
