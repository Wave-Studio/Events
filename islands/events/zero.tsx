import { Signal } from "@preact/signals";
import { Event } from "@/utils/db/kv.ts";
import useForm from "@/components/fakeFormik/index.tsx";
import * as Yup from "yup";
import CTA from "@/components/buttons/cta.tsx";
import PhotoPlus from "$tabler/photo-plus.tsx";
import { useMemo } from "preact/hooks";

export default function StageZero({ state, page }: { state: Signal<Event>, page: Signal<number> }) {
  const [Field, Form, formState, submitForm] = useForm<{
    name: string;
    supportEmail: string;
    description: string;
    bannerImage?: File;
  }>({
    initialState: {
      name: "amongus",
      supportEmail: "",
      description: "",
      bannerImage: undefined,
    },
    onSubmit: (form) => {
      const { bannerImage: _, ...formState } = form;
      state.value = { ...state.value, ...formState, bannerImage: form.bannerImage?.webkitRelativePath };
      page.value = 1
    },
    validationSchema: Yup.object({
      test: Yup.string().min(3).required(),
    }),
  });

  const form = useMemo(() => formState, [formState]);

  return (
    <div class="">
      {/* <input type="text" value={state.value.name} onInput={(e) => state.value = {...state.value, name: e.currentTarget.value}} /> */}
      <Form class="flex flex-col gap-6">
        <div className="flex gap-4 flex-col md:flex-row">
          <label class="flex flex-col grow">
            <p class="label-text label-required">Event Name</p>
            <Field name="name" />
          </label>
          <label class="flex flex-col ">
            <p class="label-text label-required">Event Support Email</p>
            <Field name="supportEmail" class="grow md:w-80" type="email" />
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
          <div class=" h-44 border border-gray-300 rounded-md border-dashed flex items-center justify-center group cursor-pointer hover:border-solid font-medium">
            <PhotoPlus class="mr-2 text-gray-500 group-hover:scale-110 transition" />{" "}
            Add Banner
          </div>
          <Field
            name="bannerImage"
            type="file"
            class="hidden"
            accept="image/png, image/jpeg"
          />
        </label>
        <CTA btnType="cta" size="sm">
          Next
        </CTA>
      </Form>
      {/* {JSON.stringify(formState.value)} */}
    </div>
  );
}
