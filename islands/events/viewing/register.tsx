import { useState } from "preact/hooks";
import CTA from "@/components/buttons/cta.tsx";
import Popup from "@/components/popup.tsx";
import { Field, ShowTime } from "@/utils/db/kv.types.ts";
import useForm from "@/components/hooks/fakeFormik/index.tsx";
import * as Yup from "yup"
import { useSignal } from "@preact/signals";

type FieldValue = string | number;

export default function EventRegister({eventID, showTimes, email, additionalFields}: {eventID: string, showTimes: ShowTime[], email?: string, additionalFields: Field[]}) {
  const [open, setOpen] = useState(true);
const fields = useSignal({tickets: 1, ...additionalFields.filter(field => field.type != "toggle").reduce((acc, field) => {
  acc[field.id] = field.type === "number" ? 0 : "";
  return acc;
}, {} as { [key: string]: FieldValue }),})

  const [Form, [Field, TextArea], formState] = useForm<{
    firstName: string;
    lastName: string;
    email: string;
    [key: string]: FieldValue;
  }>(
    {
      initialState: {
        firstName: "",
        lastName: "",
        email: "",
        ...additionalFields.filter(field => field.type != "toggle").reduce((acc, field) => {
          acc[field.id] = field.type === "number" ? 0 : "";
          return acc;
        }, {} as { [key: string]: FieldValue }),
      },
      onSubmit: (form) => console.log(form.formState),
      validationSchema: Yup.object({

      })
    }
  )

  const Popover = () => {
    return (
      <Popup close={() => setOpen(false)} isOpen={open}>
        <h2 class="font-bold text-lg">Get Tickets</h2>
        <Form>
          <Field  />

        </Form>
      </Popup>
    );
  };

  return (
    <div className="mx-auto flex flex-col items-center mt-14">
      <p class="font-semibold mb-4 text-center">
        Want to attend? Regster and get your tickets now!
      </p>
      <CTA btnType="cta" onClick={() => setOpen(true)}>
        Get Tickets
      </CTA>
			<Popover />
    </div>
  );
}

export const EventRegisterSmall = () => {
  return (
    <button
      className="flex items-center select-none font-medium hover:bg-gray-200/75 hover:text-gray-900 transition text-sm mx-auto mb-2 mt-1 rounded-md bg-white/25 backdrop-blur-xl border px-1.5 py-0.5"
      onClick={() =>
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })
      }
    >
      Get Tickets
    </button>
  );
};
