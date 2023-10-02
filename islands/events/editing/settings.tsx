import { signal, useSignal } from "@preact/signals";
import CTA from "@/components/buttons/cta.tsx";
import useForm from "@/components/hooks/fakeFormik/index.tsx";
import { Event } from "@/utils/db/kv.types.ts";
import { useState } from "preact/hooks";
import { FirstPageEventValidation, YupFirstPageEventValidation } from "@/utils/types/events.ts";
import { removeKeysWithSameValues } from "@/utils/misc.ts";
import * as Yup from "yup"

export default function EventSettings(props: {
  name: string;
  description?: string;
  supportEmail: string;
  venue?: string;
  maxTickets?: number;
  eventID: string;
}) {
  const test = useSignal(1);
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<Loading>(Loading.LOADED);

  const { eventID, ...initialState } = props;

  const [Form, [Field, TextArea], formState] = useForm({
    initialState,
    onSubmit: async (form) => {
      if (form.error) {
        setError(form.error.message);
      } else {
				console.log(form.formState)
        setLoading(Loading.LOADING);
        setError(undefined);
        const toSend = removeKeysWithSameValues(initialState, form.formState!);
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
          setTimeout(() => {
            setLoading((l) => (l == Loading.SAVED ? Loading.LOADED : l));
          }, 750);
        }
      }
    },
    validationSchema: Yup.object(YupFirstPageEventValidation),
  });

  return (
    <div>
      {/* Form */}
      <div class="flex flex-col gap-4">
        <div className="flex gap-4 flex-col md:flex-row">
          <label class="flex flex-col grow">
            <p class="label-text label-required">Event Name</p>
            <Field name="name" autoComplete="off" />
          </label>
          <label class="flex flex-col ">
            <p class="label-text label-required">Event Support Email</p>
            <Field name="supportEmail" class="" type="email" />
          </label>
        </div>
        <div className="flex gap-4 flex-col md:flex-row">
          <label class="flex flex-col grow">
            <p class="label-text">Venue</p>
            <Field name="venue" autoComplete="off" />
          </label>
          <label class="flex flex-col">
            <p class="label-text">Maximum Attendees</p>
            <Field
              name="maxTickets"
              autoComplete="off"
              type="number"
              className="p-2 border rounded-md border-gray-300"
              pattern="\d*"
            />
          </label>
        </div>
        <label class="flex flex-col">
          <p class="label-text">Short Description</p>
          <TextArea
            name="description"
            class="h-56 md:h-48 min-h-[6rem] max-h-[20rem] md:max-h-[16rem]"
          />
        </label>

        <CTA
          btnType="cta"
          className="!w-full mx-auto sm:!w-72"
          type="submit"
          disabled={
            JSON.stringify(formState) === JSON.stringify(initialState) //||
           // loading == Loading.LOADING
          }
        >
          {loading == Loading.LOADING && "Saving..."}
          {loading == Loading.LOADED && "Save"}
          {loading == Loading.SAVED && "Saved"}
        </CTA>
				{error && (
					<p className="text-red-500 text-center">Error: {error}</p>
				)}
				{JSON.stringify(formState)}
      </div>
    </div>
  );
}

enum Loading {
  LOADED = 0,
  LOADING = 1,
  SAVED = 2,
}
