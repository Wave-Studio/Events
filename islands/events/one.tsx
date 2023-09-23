import { Signal } from "@preact/signals";
import { Event } from "@/utils/db/kv.ts";
import useForm from "@/components/fakeFormik/index.tsx";
import * as Yup from "yup";
import CTA from "@/components/buttons/cta.tsx";

export default function StageOne({ state }: { state: Signal<Event> }) {
  const [Field, Form, formState, submitForm] = useForm({
    initialState: {
      test: "amongus",
    },
    onSubmit: (state) => console.log(state),
    validationSchema: Yup.object({
      test: Yup.string().min(3).required(),
    }),
  });

  return (
    <div class="">
      {/* <input type="text" value={state.value.name} onInput={(e) => state.value = {...state.value, name: e.currentTarget.value}} /> */}
      <Form class="flex flex-col gap-6">
        <div className="flex gap-4">
          <label class="flex flex-col grow">
            <p class="label-text label-required">Event Name</p>
            <Field name="name" />
          </label>
          <label class="flex flex-col">
            <p class="label-text label-required">Event Support Email</p>
            <Field name="supportEmail" class="w-80" />
          </label>
        </div>
        <label class="flex flex-col">
          <p class="label-text">Short Description</p>
          <Field
            name="supportEmail"
            as="textarea"
            class="h-56 md:h-48 min-h-[6rem] max-h-[20rem] md:max-h-[16rem]"
          />
        </label>
				<label class="flex flex-col">
          <p class="label-text">Banner Image</p>
          <Field
            name="supportEmail"
            as="textarea"
            class="h-56 md:h-48 min-h-[6rem] max-h-[20rem] md:max-h-[16rem]"
          />
        </label>
        <CTA btnType="cta" size="sm">
          Next
        </CTA>
      </Form>
    </div>
  );
}
