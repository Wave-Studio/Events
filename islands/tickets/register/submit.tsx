import Minus from "$tabler/minus.tsx";
import Plus from "$tabler/plus.tsx";
import Button from "@/components/buttons/button.tsx";
import ChevronLeft from "$tabler/chevron-left.tsx";
import Loading from "$tabler/loader-2.tsx";
import { ShowTime } from "@/utils/db/kv.types.ts";
import { RegisterErrors } from "@/islands/events/components/registerErrors.tsx";
import CTA from "@/components/buttons/cta.tsx";
import { Signal } from "@preact/signals";
import { EventRegisterError } from "@/utils/event/register.ts";

const Submit = ({
  showTimes,
  showTime,
  tickets,
  ticketID,
  error,
  page,
}: {
  showTimes: Partial<ShowTime>[];
  showTime: Signal<string | undefined>;
  tickets: Signal<number>;
  ticketID: Signal<string | undefined>;
  page: Signal<number>;
  error: Signal<{ message: string; code: EventRegisterError } | undefined>;
}) => (
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
              class="group hover:bg-gray-200 size-6 grid place-items-center rounded-md transition"
              onClick={() => tickets.value > 1 && tickets.value--}
              type="button"
            >
              <Minus class="h-4 w-4 text-gray-500 group-hover:text-gray-700" />
            </button>
            <p class="px-1.5 bg-gray-100 border-2 font-medium rounded-md text-gray-600">
              {tickets.value}
            </p>
            <button
              class="group hover:bg-gray-200 size-6 grid place-items-center rounded-md transition"
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
            icon={<ChevronLeft class="size-6" />}
            label="Previous Page"
            labelOnTop
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
            <Loading class="size-5 animate-spin ml-2" />
          )}
        </CTA>
      </div>
    </div>
    {error.value && (
      <div class="flex flex-col items-center">
        <p class="text-center text-red-500 text-sm mb-2">
          {error.value.message}
        </p>
        <RegisterErrors code={error.value.code} />
      </div>
    )}
  </>
);

export default Submit;
