import { Signal } from "@preact/signals";
import { Event } from "@/utils/db/kv.ts";
import CTA from "@/components/buttons/cta.tsx";
import { StateUpdater, useMemo, useState } from "preact/hooks";
import CalenderPicker from "@/components/pickers/calender.tsx";
import TimePicker from "@/components/pickers/time.tsx";
import Plus from "$tabler/plus.tsx";
import Trash from "$tabler/trash.tsx";

export default function StageOne({
  eventState,
  setPage,
}: {
  eventState: Signal<Event>;
  setPage: StateUpdater<number>;
}) {
  const { showTimes } = eventState.value;
  const [_, forceRerender] = useState<number>(0);

  return (
    <>
      <div class="grid grid-cols-1 gap-8">
        {showTimes.map((showTime) => (
          <ShowTimeUI
            showTime={showTime}
            key={showTime.id}
            removeShowTime={(id) => {
              if (showTimes.length != 1) {
                eventState.value.showTimes = showTimes.filter(
                  (s) => s.id != id,
                );
              }
              forceRerender((s) => s + 1);
            }}
          />
        ))}
        <button
          className="flex font-medium text-gray-500 hover:text-gray-600 transition  items-center cursor-pointer py-1 group w-full"
          onClick={() => {
            showTimes.push({
              startDate: new Date().toString(),
              startTime: undefined,
              endTime: undefined,
              lastPurchaseDate: undefined,
              id: crypto.randomUUID(),
            });
            forceRerender((s) => s + 1);
          }}
        >
          <div className="grow h-0.5 bg-gray-300" />
          <div class="mx-2 flex items-center">
            Add Showtime <Plus class="h-4 w-4 ml-2 group-hover:scale-110" />
          </div>
          <div className="grow h-0.5 bg-gray-300" />
        </button>
        <div className="flex justify-between">
          <CTA
            btnType="secondary"
            btnSize="sm"
            className="!w-20 md:!w-40"
            type="button"
            onClick={() => setPage(0)}
          >
            Back
          </CTA>
          <CTA
            btnType="cta"
            btnSize="sm"
            className="!w-20 md:!w-40"
            onClick={() => setPage(2)}
          >
            Next
          </CTA>
        </div>
      </div>
    </>
  );
}

const ShowTimeUI = ({
  showTime,
  isOpen = true,
  removeShowTime,
}: {
  showTime: Event["showTimes"][0];
  isOpen?: boolean;
  removeShowTime: (id: string) => void;
}) => {
  const [open, setOpen] = useState(isOpen);

  return (
    <>
      <div className="flex flex-col">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4" key={showTime.id}>
          <label class="md:col-span-2 flex flex-col">
            <p class="label-text label-required">Event Date</p>
            <CalenderPicker
              initialDate={new Date(showTime.startDate)}
              updateDate={(date) =>
                (showTime.startDate = (date ?? new Date()).toString())
              }
            />
          </label>
          <label class="md:col-span-2 flex flex-col">
            <p class="label-text">Last Purchase Date</p>
            <CalenderPicker
              initialDate={
                showTime.lastPurchaseDate
                  ? new Date(showTime.lastPurchaseDate)
                  : undefined
              }
              updateDate={(date) =>
                (showTime.lastPurchaseDate = date ? date.toString() : undefined)
              }
            />
          </label>
          <label class="flex flex-col">
            <p class="label-text">Start Time</p>
            <TimePicker
              initialTime={
                showTime.startTime ? new Date(showTime.startTime) : undefined
              }
              updateTime={(time) =>
                (showTime.startTime = time ? time.toString() : undefined)
              }
            />
          </label>
          <label class="flex flex-col">
            <p class="label-text">end time</p>
            <TimePicker
              initialTime={
                showTime.endTime ? new Date(showTime.endTime) : undefined
              }
              updateTime={(time) =>
                (showTime.endTime = time ? time.toString() : undefined)
              }
            />
          </label>
        </div>
        <button
          className="rounded-md border border-red-300 font-medium text-red-500 grid place-items-center w-6 h-6 bg-red-100 mt-2 ml-auto"
          onClick={() => removeShowTime(showTime.id)}
        >
          <Trash class="w-4 h-4" />
        </button>
      </div>
    </>
  );
};
