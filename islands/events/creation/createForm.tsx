import { useState } from "preact/hooks";
import { defaultEvent, User } from "@/utils/db/kv.types.ts";
import StageZero from "./zero.tsx";
import StageOne from "./one.tsx";
import { useSignal } from "@preact/signals";
import StageTwo from "./two.tsx";
import StageThree from "./three.tsx";

export default function CreateEvent({ user }: { user: User }) {
  const eventData = useSignal(defaultEvent);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string>();

  const pageNames = [
    "Lets start with some basic details.",
    "When do you plan to host your event?",
    "Create the your tickets!",
  ];

  return (
    <div class="flex flex-col items-center mt-4">
      <div class="max-w-xl w-full flex flex-col gap-4">
        <h2 className="font-semibold text-lg text-center mb-2 mt-6">
          {pageNames[page]}
        </h2>
        {page === 0 && (
          <StageZero
            eventState={eventData}
            setPage={setPage}
            setError={setError}
          />
        )}
        {page === 1 && <StageOne eventState={eventData} setPage={setPage} />}
        {page === 2 && <StageTwo eventState={eventData} setPage={setPage} />}
        {page === 3 && (
          <StageThree
            eventState={eventData}
            setPage={setPage}
            setError={setError}
          />
        )}
      </div>
      {/* {JSON.stringify(eventData.value)} */}
      {/* {page} */}
      {error && <p className="mt-6 text-red-500">{error}</p>}
    </div>
  );
}
