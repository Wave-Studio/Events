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
        page 2
        <div className="flex justify-between md:col-span-2">
            <CTA btnType="secondary" btnSize="sm" className="!w-20 md:!w-40" type="button" onClick={() => setPage(1)}>
              Back
            </CTA>
          <CTA btnType="cta" btnSize="sm" className="!w-20 md:!w-40" onClick={() => {}}>
            Next
          </CTA>
        </div>
      </div>
    </>
  );
}
