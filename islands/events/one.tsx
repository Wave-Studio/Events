import { Signal } from "@preact/signals";
import { Event } from "@/utils/db/kv.ts";
import useForm from "@/components/hooks/fakeFormik/index.tsx";
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
  const { showTimes } = eventState.value;

  return (
    <>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label class="md:col-span-2 flex flex-col">
          <p class="label-text label-required">Event Date</p>
          <CalenderPicker
            initialDate={new Date(showTimes[0].startDate)}
            updateDate={(date) =>
              (showTimes[0].startDate = (date ?? new Date()).toString())
            }
          />
        </label>
        <label class="md:col-span-2 flex flex-col">
          <p class="label-text">Last Purchase Date</p>
          <CalenderPicker
            initialDate={
              showTimes[0].lastPurchaseDate
                ? new Date(showTimes[0].lastPurchaseDate)
                : undefined
            }
            updateDate={(date) =>
              (showTimes[0].lastPurchaseDate = date
                ? date.toString()
                : undefined)
            }
          />
        </label>
        <label class="flex flex-col">
          <p class="label-text">Start Time</p>
          <TimePicker
            initialTime={
              showTimes[0].startTime
                ? new Date(showTimes[0].startTime)
                : undefined
            }
            updateTime={(time) =>
              (showTimes[0].startTime = time ? time.toString() : undefined)
            }
          />
        </label>
        <label class="flex flex-col">
          <p class="label-text">end time</p>
          <TimePicker
            initialTime={
              showTimes[0].endTime ? new Date(showTimes[0].endTime) : undefined
            }
            updateTime={(time) =>
              (showTimes[0].endTime = time ? time.toString() : undefined)
            }
          />
        </label>
        <div className="flex justify-between md:col-span-2">
            <CTA btnType="secondary" btnSize="sm" className="!w-20 md:!w-40" type="button" onClick={() => setPage(0)}>
              Back
            </CTA>
          <CTA btnType="cta" btnSize="sm" className="!w-20 md:!w-40" onClick={() => setPage(2)}>
            Next
          </CTA>
        </div>
      </div>
    </>
  );
}
