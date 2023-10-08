import { signal, useSignal } from "@preact/signals";
import CTA from "@/components/buttons/cta.tsx";
import useForm from "@/components/hooks/fakeFormik/index.tsx";
import { Event } from "@/utils/db/kv.types.ts";
import { useState } from "preact/hooks";
import { FirstPageEventValidation } from "@/utils/types/events.ts";
import { removeKeysWithSameValues } from "@/utils/misc.ts";
import * as Yup from "yup";
import { JSX } from "preact";
import { Loading } from "@/utils/loading.ts";

export default function EventSettings(props: {
  name: string;
  description?: string;
  supportEmail: string;
  summary?: string;
  venue?: string;
  maxTickets?: number;
  eventID: string;
}) {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<Loading>(Loading.LOADED);

  const { eventID, ...inital } = props;
  const [initialState, setInitialState] = useState(inital);
  const [formState, setFormState] = useState(inital);

  const submitForm = async (e: JSX.TargetedEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      FirstPageEventValidation.validateSync(formState);
    } catch (e) {
      setError(e.message);
      return;
    }

    setLoading(Loading.LOADING);
    setError(undefined);
    const toSend = removeKeysWithSameValues(initialState, formState);
    const res = await fetch("/api/events/edit", {
      body: JSON.stringify({
        eventID,
        newEventData: toSend,
      }),
      method: "POST",
    });
    const { error } = await res.json();
    if (error) {
      setError(error);
      setLoading(Loading.LOADED);
    } else {
      setLoading(Loading.SAVED);
      setInitialState(formState);
      setTimeout(() => {
        setLoading((l) => (l == Loading.SAVED ? Loading.LOADED : l));
      }, 1500);
    }
  };
  return (
    <form class="flex flex-col gap-4" onSubmit={submitForm} noValidate>
      <div className="flex gap-4 flex-col md:flex-row">
        <label class="flex flex-col grow">
          <p class="label-text label-required">Event Name</p>
          <input
            name="name"
            autoComplete="off"
            type="text"
            value={formState.name}
            onInput={(e) =>
              setFormState((state) => ({
                ...state,
                name: e.currentTarget.value,
              }))
            }
          />
        </label>
        <label class="flex flex-col ">
          <p class="label-text label-required">Event Support Email</p>
          <input
            name="supportEmail"
            class=""
            type="email"
            value={formState.supportEmail}
            onInput={(e) =>
              setFormState((state) => ({
                ...state,
                supportEmail: e.currentTarget.value,
              }))
            }
          />
        </label>
      </div>
      <div className="flex gap-4 flex-col md:flex-row">
        <label class="flex flex-col grow">
          <p class="label-text">Venue</p>
          <input
            name="venue"
            autoComplete="off"
            type="text"
            value={formState.venue}
            onInput={(e) =>
              setFormState((state) => ({
                ...state,
                venue: e.currentTarget.value,
              }))
            }
          />
        </label>
        <label class="flex flex-col">
          <p class="label-text">Maximum Attendees</p>
          <input
            name="maxTickets"
            autoComplete="off"
            type="number"
            className="p-2 border rounded-md border-gray-300"
            pattern="\d*"
            value={formState.maxTickets}
            onInput={(e) =>
              setFormState((state) => ({
                ...state,
                maxTickets: parseInt(e.currentTarget.value),
              }))
            }
          />
        </label>
      </div>
      <label class="flex flex-col">
        <p class="label-text">Brief Summary</p>
        <input
          name="summary"
          autoComplete="off"
          type="text"
          className="p-2 border rounded-md border-gray-300"
          value={formState.summary}
          onInput={(e) =>
            setFormState((state) => ({
              ...state,
              summary: e.currentTarget.value,
            }))
          }
        />
      </label>
      <label class="flex flex-col">
        <p class="label-text">Short Description</p>
        <textarea
          name="description"
          class="h-56 md:h-48 min-h-[6rem] max-h-[20rem] md:max-h-[16rem]"
          value={formState.description}
          onInput={(e) =>
            setFormState((state) => ({
              ...state,
              description: e.currentTarget.value,
            }))
          }
        />
      </label>

      <CTA
        btnType="cta"
        className="!w-full mx-auto sm:!w-72"
        type="submit"
        disabled={
          JSON.stringify(formState) === JSON.stringify(initialState) ||
          loading == Loading.LOADING
        }
      >
        {loading == Loading.LOADING && "Saving..."}
        {loading == Loading.LOADED && "Save"}
        {loading == Loading.SAVED && "Saved"}
      </CTA>
      {error && <p className="text-red-500 text-center">Error: {error}</p>}
    </form>
  );
}
