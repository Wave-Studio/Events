import CTA from "@/components/buttons/cta.tsx";
import { ShowTime } from "@/utils/db/kv.types.ts";
import { useState } from "preact/hooks";
import { Loading } from "@/utils/loading.ts";
import { ShowTimeUI } from "@/islands/events/creation/one.tsx";
import Plus from "$tabler/plus.tsx";
import { useSignal } from "@preact/signals";

export default function ShowTimeSettings({
  showTimes,
  eventID,
}: {
  showTimes: ShowTime[];
  eventID: string;
}) {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<Loading>(Loading.LOADED);
  const times = JSON.stringify(showTimes)
  const [initialState, setInitialState] = useState(times);
  const currentState = useSignal(times);

  const removeShowTime = (id: string) => {
      if (currentState.value.length != 1) {
        currentState.value = JSON.stringify(JSON.parse(currentState.value).filter((s) => s.id != id))
      }
    }

  const updateShowTimes = async () => {
    setLoading(Loading.LOADING);
    setError(undefined);
    const res = await fetch("/api/events/edit", {
      body: JSON.stringify({
        eventID,
        newEventData: {showTimes: JSON.parse(currentState.value)} as Partial<Event>,
      }),
      method: "POST",
    });
    const { error } = await res.json();
    if (error) {
      setError(error);
      setLoading(Loading.LOADED);
    } else {
      setLoading(Loading.SAVED);
      setInitialState(currentState.value);
      setTimeout(() => {
        setLoading((l) => (l == Loading.SAVED ? Loading.LOADED : l));
      }, 1500);
    }
  };

  return (
    <>
      <div class="flex flex-col gap-6">
        {JSON.parse(currentState.value).map((showTime) => (
          <ShowTimeUI showTime={showTime} removeShowTime={removeShowTime} />
        ))}
      </div>
      <button
        className="flex font-medium text-gray-500 hover:text-gray-600 transition  items-center cursor-pointer py-1 group w-full"
        onClick={() => currentState.value = JSON.stringify(JSON.parse(currentState.value).concat([
              {
                startDate: new Date().toString(),
                startTime: undefined,
                endTime: undefined,
                lastPurchaseDate: undefined,
                id: crypto.randomUUID(),
              },]
            ))
          
        }
      >
        <div className="grow h-0.5 bg-gray-300" />
        <div class="mx-2 flex items-center">
          Add Showtime <Plus class="h-4 w-4 ml-2 group-hover:scale-110" />
        </div>
        <div className="grow h-0.5 bg-gray-300" />
      </button>
      <CTA
        btnType="cta"
        className="!w-full mx-auto sm:!w-72"
        disabled={
          JSON.stringify(currentState.value) === JSON.stringify(initialState) ||
          loading == Loading.LOADING
        }
        onClick={updateShowTimes}
      >
        {loading == Loading.LOADING && "Saving..."}
        {loading == Loading.LOADED && "Save"}
        {loading == Loading.SAVED && "Saved"}
      </CTA>
      {error && <p class="text-red-500 text-center">Error: {error}</p>}
      {JSON.stringify(currentState.value)}
      {JSON.stringify(initialState)}
    </>
  );
}
