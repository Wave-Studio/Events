import CTA from "@/components/buttons/cta.tsx";
import { ShowTime } from "@/utils/db/kv.types.ts";
import { useState } from "preact/hooks";
import { FirstPageEventValidation } from "@/utils/types/events.ts";
import { removeKeysWithSameValues } from "@/utils/misc.ts";
import { JSX } from "preact";
import { Loading } from "@/utils/loading.ts";

export default function EventSettings({showTimes, eventID}: {
  showTimes: ShowTime[];
	eventID: string
}) {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<Loading>(Loading.LOADED);

  const [initialState, setInitialState] = useState(showTimes);
  const [currentState, setCurrentState] = useState(showTimes);

  const submitForm = async (e: JSX.TargetedEvent<HTMLFormElement>) => {
    e.preventDefault();

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
        newEventData: currentState,
      }),
      method: "POST",
    });
    const { error } = await res.json();
    if (error) {
      setError(error);
      setLoading(Loading.LOADED);
    } else {
      setLoading(Loading.SAVED);
			setInitialState(currentState)
      setTimeout(() => {
        setLoading((l) => (l == Loading.SAVED ? Loading.LOADED : l));
      }, 1500);
    }
  };

  return (
  <div>

      <CTA
        btnType="cta"
        className="!w-full mx-auto sm:!w-72"
        type="submit"
        disabled={
          JSON.stringify(currentState) === JSON.stringify(initialState) ||
          loading == Loading.LOADING
        }
      >
        {loading == Loading.LOADING && "Saving..."}
        {loading == Loading.LOADED && "Save"}
        {loading == Loading.SAVED && "Saved"}
      </CTA>
      {error && <p className="text-red-500 text-center">Error: {error}</p>}
    </div>
  );
}
