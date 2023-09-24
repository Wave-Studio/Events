import { Signal } from "@preact/signals";
import { Event } from "@/utils/db/kv.ts";
import useForm from "@/components/fakeFormik/index.tsx";
import * as Yup from "yup";
import CTA from "@/components/buttons/cta.tsx";
import PhotoPlus from "$tabler/photo-plus.tsx";
import { StateUpdater, useMemo, useState } from "preact/hooks";
import CalenderPicker from "@/components/pickers/calender.tsx";
import TimePicker from "@/components/pickers/time.tsx";

export default function StageOne({
  eventState,
  setPage,
}: {
  eventState: Signal<Event>;
  setPage: StateUpdater<number>;
}) {
  const { maxTickets, showTimes, multiEntry } = eventState.value;

  return (
    <>
      <div class="grid grid-cols-4 [&>div]:border [&>div]:border-gray-300 [&>div]:rounded-md gap-4">
        <label class="col-span-2 flex flex-col">
          <p class="label-text label-required">Event Date</p>
          <CalenderPicker
            initialDate={new Date(showTimes[0].startDate)}
            updateDate={(date) =>
              (showTimes[0].startDate = (date ?? new Date()).toString())
            }
          />
        </label>
        <label class="col-span-2 flex flex-col">
          <p class="label-text">Last Purchase Date</p>
          <CalenderPicker
            initialDate={
              showTimes[0].lastPurchaseDate
                ? new Date(showTimes[0].lastPurchaseDate)
                : undefined
            }
            updateDate={(date) =>
              (showTimes[0].lastPurchaseDate = (
                date ?? new Date()
              ).toString())
            }
          />
        </label>
        <div class="col-span-2">s</div>
        <label class="flex flex-col">
          <p class="label-text">Start Time</p>
          <TimePicker
            initialTime={showTimes[0].startTime}
            updateTime={(time) =>
              (showTimes[0].startTime = time)
            }
          />
        </label>
        <label class="flex flex-col">
          <p class="label-text">end time</p>
          <TimePicker
            initialTime={showTimes[0].endTime}
            updateTime={(time) =>
              (showTimes[0].endTime = time)
            }
          />
        </label>
      </div>
    </>
  );
}
