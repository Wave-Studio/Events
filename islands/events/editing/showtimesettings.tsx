import CTA from "@/components/buttons/cta.tsx";
import { ShowTime } from "@/utils/db/kv.types.ts";
import { useState } from "preact/hooks";
import { Loading } from "@/utils/loading.ts";
import { ShowTimeUI } from "@/islands/events/creation/one.tsx";
import Plus from "$tabler/plus.tsx";

export default function ShowTimeSettings({
  showTimes,
  eventID,
}: {
  showTimes: ShowTime[];
  eventID: string;
}) {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<Loading>(Loading.LOADED);

  const [initialState, setInitialState] = useState(showTimes);
  // using a signal here breaks things bc initial state updates with showtime
  // 0 clue why that happends
  const [currentState, setCurrentState] = useState(showTimes);

  const removeShowTime = (id: string) =>
    setCurrentState((showTimes) => {
      if (currentState.length != 1) {
        return showTimes.filter((s) => s.id != id);
      }
      return showTimes;
    });

  const updateShowTimes = async () => {
    // try {
    //   FirstPageEventValidation.validateSync(formState);
    // } catch (e) {
    //   setError(e.message);
    //   return;
    // }

    setLoading(Loading.LOADING);
    setError(undefined);
    const res = await fetch("/api/events/edit", {
      body: JSON.stringify({
        eventID,
        newEventData: { showTimes: currentState } as Partial<Event>,
      }),
      method: "POST",
    });
    const { error } = await res.json();
    if (error) {
      setError(error);
      setLoading(Loading.LOADED);
    } else {
      setLoading(Loading.SAVED);
      setInitialState(currentState);
      setTimeout(() => {
        setLoading((l) => (l == Loading.SAVED ? Loading.LOADED : l));
      }, 1500);
    }
  };

  return (
    <>
      <div class="flex flex-col gap-8">
        {currentState.map((showTime) => (
          <ShowTimeUI showTime={showTime} removeShowTime={removeShowTime} />
        ))}
      </div>
      <button
        className="flex font-medium text-gray-500 hover:text-gray-600 transition  items-center cursor-pointer py-1 group w-full"
        onClick={() =>
          setCurrentState((showTimes) =>
            showTimes.concat([
              {
                startDate: new Date().toString(),
                startTime: undefined,
                endTime: undefined,
                lastPurchaseDate: undefined,
                id: crypto.randomUUID(),
              },
            ]),
          )
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
          JSON.stringify(currentState) === JSON.stringify(initialState) ||
          loading == Loading.LOADING
        }
        onClick={updateShowTimes}
      >
        {loading == Loading.LOADING && "Saving..."}
        {loading == Loading.LOADED && "Save"}
        {loading == Loading.SAVED && "Saved"}
      </CTA>
      {error && <p class="text-red-500 text-center">Error: {error}</p>}
    </>
  );
}
