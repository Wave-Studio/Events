import { ShowTime } from "@/utils/db/kv.types.ts";
import { Signal } from "@preact/signals";
import Popup from "@/components/popup.tsx";
import { fmtDate, fmtHour, fmtTime } from "@/utils/dates.ts";

const SelectShowTime = ({
  showTimes,
  showTime,
  changeOpen,
  setShowTime,
  all = false,
}: {
  showTimes: Partial<ShowTime>[];
  changeOpen: Signal<boolean>;
  showTime: Signal<string | undefined> | string;
  setShowTime?: (showTime: string) => void;
  all?: boolean;
}) => {
  const selectedTime = showTimes.find((time) =>
    typeof showTime == "string"
      ? time.id == showTime
      : time.id == showTime.value,
  );
  return (
    <>
      <button
        class="flex gap-2 focus:outline-none w-max group"
        type="button"
        onClick={() => {
          if (showTimes.length > 1) changeOpen.value = true;
        }}
      >
        <div
          class={`border transition select-none px-2 h-8 rounded-md font-medium whitespace-pre border-theme-normal bg-theme-normal/5 grid place-content-center`}
        >
          {selectedTime ? (
            <>
              {fmtDate(new Date(selectedTime.startDate!))}
              {selectedTime.startTime &&
                ` at ${fmtHour(
                  new Date(selectedTime.startTime),
                ).toLowerCase()}`}
            </>
          ) : (
            "All Event Times"
          )}
        </div>
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
          {/* All event times button */}
          {all && (
            <button
              onClick={() =>
                typeof showTime == "string"
                  ? setShowTime && setShowTime("0")
                  : (showTime.value = "0")
              }
              class={`border transition select-none px-2 rounded-md font-medium whitespace-pre grid place-items-center h-8 ${
                (typeof showTime == "string"
                  ? "0" == showTime
                  : "0" == showTime.value) &&
                "border-theme-normal bg-theme-normal/5"
              }`}
              type="button"
            >
              <p class="flex">All Event Times</p>
            </button>
          )}

          {showTimes.map((time) => (
            <button
              onClick={() =>
                typeof showTime == "string"
                  ? setShowTime && setShowTime(time.id!)
                  : (showTime.value = time.id)
              }
              class={`border transition select-none px-2 rounded-md font-medium whitespace-pre grid place-items-center h-8 ${
                (typeof showTime == "string"
                  ? time.id == showTime
                  : time.id == showTime.value) &&
                "border-theme-normal bg-theme-normal/5"
              }`}
              type="button"
            >
              <p class="flex">
                {fmtDate(new Date(time.startDate!))}
                <span class="lowercase">
                  {time.startTime && ` at ${fmtTime(new Date(time.startTime))}`}
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

export default SelectShowTime;
