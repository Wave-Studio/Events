import { Signal } from "@preact/signals";
import { Event } from "@/utils/db/kv.ts";
import useForm from "@/components/hooks/fakeFormik/index.tsx";
import { FirstPageEventValidation } from "@/utils/types/events.ts";
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
  const { name, supportEmail, description, venue, summary } = eventState.value;

  const [Form, [Field, TextArea], formState] = useForm<{
    name: string;
    supportEmail: string;
    summary: string
    description: string;
    venue: string;
  }>({
    initialState: {
      name,
      supportEmail,
      summary: summary ?? "",
      description: description ?? "",
      venue: venue ?? "",
    },
    onSubmit: (form) => {
      if (form.error) {
        setError(form.error.message);
      } else {
        setError(undefined);
        eventState.value = { ...eventState.value, ...form.formState };
        setPage(1);
      }
    },
    validationSchema: FirstPageEventValidation,
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
      <label class="flex flex-col ">
          <p class="label-text">Brief Summary</p>
          <Field name="summary" class="grow" type="text" />
        </label>
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
          <CTA
            btnType="secondary"
            btnSize="sm"
            className="!w-20 md:!w-40"
            type="button"
          >
            Cancel
          </CTA>
        </a>
        <CTA
          btnType="cta"
          btnSize="sm"
          className="!w-20 md:!w-40"
          type="submit"
        >
          Next
        </CTA>
      </div>
    </Form>
  );
}
