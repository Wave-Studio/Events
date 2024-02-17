import { useEffect, useState } from "preact/hooks";
import CTA from "@/components/buttons/cta.tsx";
import Popup from "@/components/popup.tsx";
import { Field, ShowTime, User } from "@/utils/db/kv.types.ts";
import useForm from "@/components/hooks/fakeFormik/index.tsx";
import * as Yup from "yup";
import { useSignal } from "@preact/signals";
import { Toggle } from "@/components/buttons/toggle.tsx";
import Ticket from "@/islands/components/pieces/ticket.tsx";
import { acquired, getTicketID } from "@/utils/tickets.ts";
import { EventRegisterError } from "@/utils/event/register.ts";
import { RegisterErrors } from "@/islands/events/components/registerErrors.tsx";
import SelectShowTime from "@/islands/events/viewing/selectShowTime.tsx";
import { isUUID } from "@/utils/db/misc.ts";
import Submit from "@/islands/events/viewing/register/submit.tsx";

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
  const error = useSignal<
    { message: string; code: EventRegisterError } | undefined
  >(undefined);
  const showTime = useSignal(showTimes[0].id);
  const ticketID = useSignal<string | undefined>(undefined);
  const toggles = useSignal<Record<string, boolean>>({
    ...additionalFields
      .filter((field) => field.type == "toggle")
      .reduce((acc, field) => {
        acc[field.id] = false;
        return acc;
      }, {} as Record<string, boolean>),
  });

  const perfEntries = performance.getEntriesByType("navigation");
  useEffect(() => {
    //forces browser to fetch fresh data if using forward/back buttons rather than relying on cache
    if (
      perfEntries.length &&
      (perfEntries[0] as PerformanceNavigationTiming).type === "back_forward"
    ) {
      window.location.reload();
    }
  }, []);

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
        .reduce((acc, field) => {
          acc[field.id] = field.type === "number" ? 0 : "";
          return acc;
        }, {} as Record<string, string | number>),
    },
    onSubmit: (form) => createTicket(form.formState!),
    // TODO: add client side validation
    validationSchema: Yup.object({}),
  });

  const createTicket = async (formState: {
    [key: string]: string | number;
    firstName: string;
    lastName: string;
    email: string;
  }) => {
    const formStates: { id: string; value: unknown }[] = [];

    for (const [key, value] of [
      ...Object.entries(toggles.value),
      ...Object.entries(formState),
    ]) {
      if (isUUID(key)) {
        formStates.push({ id: key, value });
      }
    }

    const fullTicket = {
      ...formState,
      tickets: tickets.value,
      showtimeID: showTime.value,
      eventID,
      fieldData: formStates,
    };
    error.value = undefined;
    ticketID.value = "loading";

    const ticket: {
      ticket?: string;
      error?: { message: string; code: EventRegisterError };
    } = await (
      await fetch("/api/events/ticket", {
        method: "POST",
        body: JSON.stringify(fullTicket),
      })
    ).json();

    if (ticket.error || !ticket.ticket) {
      error.value = ticket.error || {
        message: "An unknown error has occurred",
        code: EventRegisterError.OTHER,
      };
      ticketID.value = undefined;
    } else {
      ticketID.value = ticket.ticket;
      page.value = 2;
    }
  };

  const Popover = () => {
    return (
      <Popup
        close={() => {
          if (!changeOpen.value) {
            setOpen(false);
            error.value = undefined;
            page.value = 0;
          }
        }}
        isOpen={open}
        className=""
      >
        <h2 class="font-bold text-lg">
          {page.value === 2 ? "Your Ticket" : "Get Tickets"}
        </h2>
        <Form class="gap-4 mt-4 flex flex-col">
          {page.value === 0 ? (
            <>
              <SelectShowTime
                changeOpen={changeOpen}
                showTime={showTime}
                showTimes={showTimes}
              />
              {/* If user is already registered */}
              {acquired(user, eventID, showTime.value!) ? (
                <>
                  <div className="mx-auto flex flex-col items-center">
                    <p class="font-semibold mb-4 text-center">
                      You're already registered for this event! Edit or view
                      ticket below. Tap "Change" to get a ticket for a different
                      event.
                    </p>
                    <a
                      href={`/events/${eventID}/tickets/${getTicketID(
                        user,
                        eventID,
                        showTime.value!,
                      )}`}
                    >
                      <CTA btnType="secondary" btnSize="sm" type="button">
                        View Ticket
                      </CTA>
                    </a>
                  </div>
                </>
              ) : (
                // Page 1
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
                    <Submit
                      error={error}
                      page={page}
                      showTime={showTime}
                      showTimes={showTimes}
                      ticketID={ticketID}
                      tickets={tickets}
                    />
                  )}
                </>
              )}
            </>
          ) : page.value == 1 ? (
            // Page 2 of getting tickets
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
              <Submit
                error={error}
                page={page}
                showTime={showTime}
                showTimes={showTimes}
                ticketID={ticketID}
                tickets={tickets}
              />
            </>
          ) : (
            // After user has acquired tickets
            <>
              <div class="flex flex-col items-center pb-6">
                <h3 class="font-bold text-lg text-center">
                  Event Reservation Confirmed!
                </h3>
                <p class="text-center max-w-lg text-sm">
                  Your ticket has been emailed to you. You'll get another
                  reminder email with your ticket on the day of the event.
                </p>
              </div>
              <Ticket
                id={ticketID.value!}
                showTime={
                  showTimes.find((s) => s.id == showTime.value)! as ShowTime
                }
                tickets={tickets.value}
              />
              <a
                href={`/events/${eventID}/tickets/${
                  ticketID.value!.split("_")[2]
                }`}
                class="mx-auto pt-6"
              >
                <CTA btnType="secondary" btnSize="sm">
                  View Ticket
                </CTA>
              </a>
            </>
          )}
        </Form>
      </Popup>
    );
  };

  return (
    <div className="mx-auto flex flex-col items-center mt-14">
      <p class="font-semibold mb-4 text-center">
        Want to attend? Register and get your tickets now!
      </p>
      <CTA btnType="cta" onClick={() => setOpen(true)}>
        Get Tickets
      </CTA>
      <Popover />
    </div>
  );
}
