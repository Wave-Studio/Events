import { useState } from "preact/hooks";
import CTA from "@/components/buttons/cta.tsx";
import Popup from "@/components/popup.tsx";
import { Field, ShowTime } from "@/utils/db/kv.types.ts";
import useForm from "@/components/hooks/fakeFormik/index.tsx";
import * as Yup from "yup";
import { useSignal } from "@preact/signals";
import { Toggle } from "@/components/buttons/toggle.tsx";
import Minus from "$tabler/minus.tsx";
import Plus from "$tabler/plus.tsx";

export default function EventRegister({
  eventID,
  showTimes,
  email,
  additionalFields,
  multiPurchase,
}: {
  eventID: string;
  showTimes: ShowTime[];
  email?: string;
  additionalFields: Field[];
  multiPurchase: boolean;
}) {
  const [open, setOpen] = useState(true);
  const page = useSignal(0);
  const tickets = useSignal(1);
  const toggles = useSignal<Record<string, boolean>>({
    ...additionalFields
      .filter((field) => field.type == "toggle")
      .reduce(
        (acc, field) => {
          acc[field.id] = false;
          return acc;
        },
        {} as Record<string, boolean>,
      ),
  });

  const [Form, [Field, TextArea], formState] = useForm<{
    firstName: string;
    lastName: string;
    email: string;
    [key: string]: string | number;
  }>({
    initialState: {
      firstName: "",
      lastName: "",
      email: email || "",
      ...additionalFields
        .filter((field) => field.type != "toggle")
        .reduce(
          (acc, field) => {
            acc[field.id] = field.type === "number" ? 0 : "";
            return acc;
          },
          {} as Record<string, string | number>,
        ),
    },
    onSubmit: (form) => createTicket(form.formState!),
    validationSchema: Yup.object({}),
  });

  const Submit = () => (
    <div class="flex justify-between mt-4 items-center">
      <div class="flex flex-col items-center">
        {/* We could not show this UI at all when there's only 1 ticket, but I think this may be better UX since it makes it a bit more obvious the user can't get more */}
        <span class="text-xs font-medium">
          Tickets{!multiPurchase && ": 1 (max)"}
        </span>
        {multiPurchase && (
          <div class="flex gap-2 items-center">
            <button
              class="group hover:bg-gray-200 w-6 h-6 grid place-items-center rounded-md transition"
              onClick={() => tickets.value > 1 && tickets.value--}
            >
              <Minus class="h-4 w-4 text-gray-500 group-hover:text-gray-700" />
            </button>
            <p class="px-1.5 bg-gray-100 border-2 font-medium rounded-md text-gray-600">
              {tickets.value}
            </p>
            <button
              class="group hover:bg-gray-200 w-6 h-6 grid place-items-center rounded-md transition"
              onClick={() => tickets.value++}
            >
              <Plus class="h-4 w-4 text-gray-500 group-hover:text-gray-700" />
            </button>
          </div>
        )}
      </div>
      <CTA
        btnType="cta"
        type="submit"
        btnSize="sm"
        onClick={() => page.value++}
      >
        Register
      </CTA>
    </div>
  );

  const createTicket = (formState: {
    [key: string]: string | number;
    firstName: string;
    lastName: string;
    email: string;
  }) => {
    const fullTicket = {
      ...formState,
      ...toggles.value,
      tickets: tickets.value,
    };
    console.log(fullTicket);
  };

  const Popover = () => {
    return (
      <Popup close={() => setOpen(false)} isOpen={open} className="">
        <h2 class="font-bold text-lg">Get Tickets</h2>
        <Form class="gap-4 mt-6 flex flex-col">
          {page.value == 0 ? (
            <>
              <div class="flex flex-col md:flex-row gap-4 [&>label]:grow">
                <label class="flex flex-col">
                  <span class="label-text label-required">First Name</span>
                  <Field name="firstName" />
                </label>

                <label class="flex flex-col">
                  <span class="label-text label-required">Last Name</span>
                  <Field name="lastName" />
                </label>
              </div>
              <label class="flex flex-col">
                <span class="label-text label-required">Email</span>
                <Field name="email" />
              </label>
              {additionalFields.length > 0 ? (
                <CTA
                  btnType="cta"
                  type="button"
                  btnSize="sm"
                  className="ml-auto mt-4"
                  onClick={() => page.value++}
                >
                  Next
                </CTA>
              ) : (
                <Submit />
              )}
            </>
          ) : (
            <>
              {additionalFields
                .filter((field) => field.type != "toggle")
                .map((field) => (
                  <label class="flex flex-col">
                    <span class="label-text label-required">
                      {field.name}
                      {field.type == "email" && (
                        <span class="lowercase"> (email)</span>
                      )}
                    </span>
                    {field.description && (
                      <p class="text-xs text-gray-600">{field.description}</p>
                    )}
                    <Field
                      name={field.id}
                      type={field.type}
                      pattern={field.type == "number" ? "d*" : ""}
                    />
                  </label>
                ))}
              {additionalFields
                .filter((field) => field.type == "toggle")
                .map((field) => (
                  <>
                    <Toggle
                      enabled={toggles.value[field.id]}
                      name={field.name}
                      description={field.description}
                      setEnabled={(state) =>
                        (toggles.value = {
                          ...toggles.value,
                          [field.id]: state,
                        })
                      }
                    />
                  </>
                ))}
              <Submit />
            </>
          )}
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
