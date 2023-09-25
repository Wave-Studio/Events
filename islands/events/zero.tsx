import { Signal } from "@preact/signals";
import { Event } from "@/utils/db/kv.ts";
import useForm from "@/components/hooks/fakeFormik/index.tsx";
import * as Yup from "yup";
import CTA from "@/components/buttons/cta.tsx";
import PhotoPlus from "$tabler/photo-plus.tsx";
import { StateUpdater, useMemo, useState } from "preact/hooks";

export default function StageZero({
  eventState,
  setPage,
  setError,
}: {
  eventState: Signal<Event>;
  setPage: StateUpdater<number>;
  setError: StateUpdater<string | undefined>;
}) {
  const { name, supportEmail, description, venue } = eventState.value;

  const [Form, [Field, TextArea], formState] = useForm<{
    name: string;
    supportEmail: string;
    description: string;
    venue: string;
  }>({
    initialState: {
      name,
      supportEmail,
      description: description ?? "",
      venue: venue ?? "",
    },
    onSubmit: (form) => {
      if (form.error) {
        setError(form.error.message);
      } else {
        setError(undefined);
        eventState.value = { ...eventState.value, ...form };
        setPage(1);
      }
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, "The name of your event must be at least 3 characters")
        .max(75, "The name of your event must be at least 3 characters")
        .required("Please add a name for your event"),
      supportEmail: Yup.string()
        .email("Enter a valid support email")
        .required("We require a support email for all events"),
      description: Yup.string(),
      venue: Yup.string(),
    }),
  });

  return (

      <Form class="flex flex-col gap-4">
        <div className="flex gap-4 flex-col md:flex-row">
          <label class="flex flex-col grow">
            <p class="label-text label-required">Event Name</p>
            <Field name="name" autoComplete="off" />
          </label>
          <label class="flex flex-col ">
            <p class="label-text label-required">Event Support Email</p>
            <Field name="supportEmail" class="grow md:w-56" type="email" />
          </label>
        </div>
        <label class="flex flex-col">
          <p class="label-text">Short Description</p>
          <TextArea
            name="description"
            class="h-56 md:h-48 min-h-[6rem] max-h-[20rem] md:max-h-[16rem]"
          />
        </label>
        <label class="flex flex-col">
          <p class="label-text">Venue</p>
          <Field name="venue" autoComplete="off" />
        </label>
        <div className="flex justify-between">
          <a href="/events/organizing">
            <CTA btnType="secondary" btnSize="sm" className="=" type="button">
              Cancel
            </CTA>
          </a>
          <CTA btnType="cta" btnSize="sm" className="">
            Next
          </CTA>
        </div>
      </Form>

  );
}
