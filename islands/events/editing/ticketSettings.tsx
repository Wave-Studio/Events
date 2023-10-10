import { signal, useSignal } from "@preact/signals";
import CTA from "@/components/buttons/cta.tsx";
import useForm from "@/components/hooks/fakeFormik/index.tsx";
import { Event, Field } from "@/utils/db/kv.types.ts";
import { StateUpdater, useState } from "preact/hooks";
import { FirstPageEventValidation } from "@/utils/types/events.ts";
import { removeKeysWithSameValues } from "@/utils/misc.ts";
import * as Yup from "yup";
import { JSX } from "preact";
import { Loading } from "@/utils/loading.ts";
import { Toggle } from "@/components/buttons/toggle.tsx";
import {
  AdditionalInputs,
  FieldInput,
  defaultField,
} from "@/islands/events/creation/two.tsx";
import Plus from "$tabler/plus.tsx";

export default function EventTicketSettings(props: {
  multiEntry: boolean;
  multiPurchase: boolean;
  additionalFields: Field[];
  eventID: string;
}) {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<Loading>(Loading.LOADED);

  const { eventID, ...inital } = props;
  const [initialState, setInitialState] = useState(inital);
  const [formState, setFormState] = useState(inital);

  const addField = () => {
    setFormState((f) => ({
      ...f,
      additionalFields: [...f.additionalFields, defaultField()],
    }));
  };

  const submitForm = async () => {
    const form = {
      ...formState,
      additionalFields: formState.additionalFields.filter((f) => f.name),
    };

    setFormState(form);

    setLoading(Loading.LOADING);
    setError(undefined);
    const toSend = removeKeysWithSameValues(initialState, form);
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
      setInitialState(form);
      setTimeout(() => {
        setLoading((l) => (l == Loading.SAVED ? Loading.LOADED : l));
      }, 1500);
    }
  };
  return (
    <>
      <Toggle
        name="Allow Multi-Entry"
        description="Allow attendees to enter multiple times on the same ticket"
        setEnabled={(state: boolean) =>
          setFormState((f) => ({ ...f, multiEntry: state }))
        }
        enabled={formState.multiEntry}
      />
      <Toggle
        name="Allow Multiple Ticket Sales"
        description="Allow attendees to buy multiple tickets across one or multiple transactions (tracked using their email)"
        setEnabled={(state: boolean) =>
          setFormState((f) => ({ ...f, multiPurchase: state }))
        }
        enabled={formState.multiPurchase}
      />
      <AdditionalInputs />
      <section>
        <h4 class="text-sm font-medium mb-2">Additional Inputs</h4>
        {formState.additionalFields.map((field) => (
          <FieldInput
            field={field}
            fields={formState.additionalFields}
            setFields={
              // this is a mess
              ((
                callbackOrValue: Field[] | ((state: Field[]) => Field[]),
              ): void => {
                if (typeof callbackOrValue === "function") {
                  setFormState((f) => {
                    callbackOrValue = (
                      callbackOrValue as (state: Field[]) => Field[]
                    )(f.additionalFields);
                    return {
                      ...f,
                      additionalFields: callbackOrValue,
                    };
                  });
                } else {
                  setFormState((f) => ({
                    ...f,
                    additionalFields: callbackOrValue as Field[],
                  }));
                }
              }) as StateUpdater<Field[]>
            }
          />
        ))}
        <button
          className="flex font-medium text-gray-500 hover:text-gray-600 transition  items-center cursor-pointer py-1 group w-full"
          onClick={addField}
        >
          <div className="grow h-0.5 bg-gray-300" />
          <div class="mx-2 flex items-center">
            Add field <Plus class="h-4 w-4 ml-2 group-hover:scale-110" />
          </div>
          <div className="grow h-0.5 bg-gray-300" />
        </button>
      </section>
      <CTA
        btnType="cta"
        className="!w-full mx-auto sm:!w-72"
        onClick={submitForm}
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
    </>
  );
}
