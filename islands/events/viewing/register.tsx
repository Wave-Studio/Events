import { useState } from "preact/hooks";
import CTA from "@/components/buttons/cta.tsx";
import Popup from "@/components/popup.tsx";
import { Field, ShowTime, User } from "@/utils/db/kv.types.ts";
import useForm from "@/components/hooks/fakeFormik/index.tsx";
import * as Yup from "yup";
import { useSignal } from "@preact/signals";
import { Toggle } from "@/components/buttons/toggle.tsx";
import Minus from "$tabler/minus.tsx";
import Plus from "$tabler/plus.tsx";
import { fmtDate, fmtHour, fmtTime } from "@/utils/dates.ts";
import Button from "@/components/buttons/button.tsx";
import ChevronLeft from "$tabler/chevron-left.tsx";
import { createPortal } from "preact/compat";
import Loading from "$tabler/loader-2.tsx";
import Ticket from "@/islands/components/peices/ticket.tsx";
import { acquired, getTicketID } from "@/utils/tickets.ts";

export default function EventRegister({
  eventID,
  showTimes,
  email,
  additionalFields,
  user,
}: {
  eventID: string;
  showTimes: Partial<ShowTime>[];
  email?: string;
  additionalFields: Field[];
  user?: User;
}) {
  const [open, setOpen] = useState(false);
  const changeOpen = useSignal(false);
  const page = useSignal(0);
  const tickets = useSignal(1);
  const error = useSignal<string | undefined>(undefined);
  const showTime = useSignal(showTimes[0].id);
  const ticketID = useSignal<string | undefined>(undefined);
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
    // TODO: add client side validation
    validationSchema: Yup.object({}),
  });

  const Submit = () => (
    <>
      <div class="flex justify-between mt-4 items-center">
        <div class="flex flex-col items-center">
          {/* We could not show this UI at all when there's only 1 ticket, but I think this may be better UX since it makes it a bit more obvious the user can't get more */}
          <span class="text-xs font-medium">
            Tickets
            {!showTimes.find((s) => s.id == showTime.value)!.multiPurchase &&
              ": 1 (max)"}
          </span>
          {showTimes.find((s) => s.id == showTime.value)!.multiPurchase && (
            <div class="flex gap-2 items-center">
              <button
                class="group hover:bg-gray-200 w-6 h-6 grid place-items-center rounded-md transition"
                onClick={() => tickets.value > 1 && tickets.value--}
                type="button"
              >
                <Minus class="h-4 w-4 text-gray-500 group-hover:text-gray-700" />
              </button>
              <p class="px-1.5 bg-gray-100 border-2 font-medium rounded-md text-gray-600">
                {tickets.value}
              </p>
              <button
                class="group hover:bg-gray-200 w-6 h-6 grid place-items-center rounded-md transition"
                type="button"
                onClick={() => tickets.value++}
              >
                <Plus class="h-4 w-4 text-gray-500 group-hover:text-gray-700" />
              </button>
            </div>
          )}
        </div>
        <div class="flex">
          {page.value != 0 && (
            <Button
              icon={<ChevronLeft class="w-6 h-6" />}
              label="Previous Page"
              onClick={() => page.value--}
            />
          )}
          <CTA
            btnType="cta"
            type="submit"
            btnSize="sm"
            className="ml-2 flex items-center justify-center"
            disabled={ticketID.value == "loading"}
          >
            Register
            {ticketID.value == "loading" && (
              <Loading class="w-5 h-5 animate-spin ml-2" />
            )}
          </CTA>
        </div>
      </div>
      {error.value && (
        <p class="text-center text-red-500 text-sm">Error: {error.value}</p>
      )}
    </>
  );

  const createTicket = async (formState: {
    [key: string]: string | number;
    firstName: string;
    lastName: string;
    email: string;
  }) => {
    const fullTicket = {
      ...formState,
      ...toggles.value,
      tickets: tickets.value,
      showtimeID: showTime.value,
      eventID,
      fieldData: [],
    };
    error.value = undefined;
    ticketID.value = "loading";

    const ticket: { ticket?: string; error?: string; hint?: string } = await (
      await fetch("/api/events/ticket", {
        method: "POST",
        body: JSON.stringify(fullTicket),
      })
    ).json();

    if (ticket.error || ticket.hint || !ticket.ticket) {
      error.value =
        ticket.hint || ticket.error || "An unknown error has occured";
      ticketID.value = undefined;
    } else {
      ticketID.value = ticket.ticket;
      page.value = 2;
    }
  };

  const SelectShowTime = () => {
    return (
      <>
        <button
          class="flex gap-2 focus:outline-none w-max group"
          type="button"
          onClick={() => {
            if (showTimes.length > 1) changeOpen.value = true;
          }}
        >
          {showTimes
            .filter((time) => time.id == showTime.value)!
            .map((time) => (
              <div
                class={`border transition select-none px-2 h-8 rounded-md font-medium whitespace-pre border-theme-normal bg-theme-normal/5 grid place-content-center`}
              >
                {fmtDate(new Date(time.startDate!))}
                {time.startTime &&
                  ` at ${fmtHour(new Date(time.startTime)).toLowerCase()}`}
              </div>
            ))}
          {showTimes.length > 1 && (
            <div class="rounded-md bg-gray-200 h-8 grid place-content-center px-2 font-medium hover:brightness-95 transition">
              Change
            </div>
          )}
        </button>
        <Popup
          close={() => (changeOpen.value = false)}
          isOpen={changeOpen.value}
          className="md:!max-w-md"
        >
          <h3 class="font-bold text-lg mb-2">Change</h3>
          <div class="grid gap-2">
            {showTimes.map((time) => (
              <button
                onClick={() => (showTime.value = time.id)}
                class={`border transition select-none px-2 rounded-md font-medium whitespace-pre grid place-items-center h-8 ${
                  time.id == showTime.value &&
                  "border-theme-normal bg-theme-normal/5"
                }`}
                type="button"
              >
                <p class="flex">
                  {fmtDate(new Date(time.startDate!))}
                  <span class="lowercase">
                    {time.startTime &&
                      ` at ${fmtTime(new Date(time.startTime))}`}
                  </span>
                </p>
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => (changeOpen.value = false)}
            class="rounded-md bg-gray-200 h-8 grid place-content-center px-2 font-medium hover:brightness-95 transition mt-4 mx-auto"
          >
            Close
          </button>
        </Popup>
      </>
    );
  };

  const Popover = () => {
    return (
      <Popup
        close={() => {
          if (!changeOpen.value) {
            setOpen(false);
            page.value = 0;
          }
        }}
        isOpen={open}
        className=""
      >
        <h2 class="font-bold text-lg">
          {page.value == 2 ? "Your Ticket" : "Get Tickets"}
        </h2>
        <Form class="gap-4 mt-4 flex flex-col">
          {page.value == 0 ? (
            <>
              <SelectShowTime />
              {acquired(user, eventID, showTime.value!) ? (
                <>
                  <div className="mx-auto flex flex-col items-center">
                    <p class="font-semibold mb-4 text-center">
                      You're already registered for this event! Edit or view
                      ticket below. Tap "Change" to get a ticket for a different event.
                    </p>
                    <a
                      href={`/events/${eventID}/tickets/${getTicketID(
                        user,
                        eventID,
                        showTime.value!,
                      )}`}
                      
                    >
                      <CTA btnType="secondary" btnSize="sm" type="button">View Ticket</CTA>
                    </a>
                  </div>
                </>
              ) : (
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
                      onClick={() => (page.value = 1)}
                    >
                      Next
                    </CTA>
                  ) : (
                    <Submit />
                  )}
                </>
              )}
            </>
          ) : page.value == 1 ? (
            <>
              {additionalFields
                .filter((field) => field.type != "toggle")
                .map((field) => (
                  <label class="flex flex-col">
                    <span class="label-text label-required">
                      {field.name}
                      {field.type == "email" && (
                        <span class="lowercase">(email)</span>
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
          ) : (
            <>
              <div class="flex flex-col items-center pb-6">
                <h3 class="font-bold text-lg text-center">
                  Event Reservation Confirmed!
                </h3>
                <p class="text-center max-w-lg text-sm">
                  Your ticket has been emailed to you. You'll get another
                  reminder email with your ticket on the day of the event. It's
                  also below for brevity.
                </p>
              </div>
              <Ticket
                id={ticketID.value!}
                showTime={
                  showTimes.find((s) => s.id == showTime.value)! as ShowTime
                }
                tickets={tickets.value}
              />
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

export const Contact = ({ email }: { email: string }) => {
  const [open, setOpen] = useState(false);
  const checked = useSignal(false);
  return (
    <>
      <button
        className="flex items-center select-none font-medium hover:bg-gray-200/75 hover:text-gray-900 transition text-sm mx-auto mt-4 rounded-md bg-white/25 backdrop-blur-xl border px-1.5 py-0.5"
        onClick={() => setOpen(true)}
      >
        Contact Organizer
      </button>
      {globalThis.document != undefined &&
        createPortal(
          <Popup
            isOpen={open}
            close={() => {
              setOpen(false);
              checked.value = false;
            }}
          >
            <h2 class="font-bold text-lg">Contact Organizer</h2>
            <label class="flex mt-4 items-start cursor-pointer">
              <input
                type="checkbox"
                name="agreed"
                class="mr-4 mt-1.5"
                onClick={(e) => (checked.value = e.currentTarget.checked)}
              />
              <p>
                I agree to interacting with this email in a professional way and
                following our guildlines as outlined in our{" "}
                <a href="/terms-of-service" class="font-medium underline">
                  terms and conditions
                </a>
              </p>
            </label>
            {checked.value && (
              <p class="mt-6">
                Organizer contact email:{" "}
                <a href={`mailto:${email}`} class="font-medium underline">
                  {email}
                </a>
              </p>
            )}
          </Popup>,
          document.body,
        )}
    </>
  );
};
