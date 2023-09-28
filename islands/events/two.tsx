import { Signal } from "@preact/signals";
import { Event } from "@/utils/db/kv.ts";
import useForm from "@/components/hooks/fakeFormik/index.tsx";
import * as Yup from "yup";
import CTA from "@/components/buttons/cta.tsx";
import PhotoPlus from "$tabler/photo-plus.tsx";
import { StateUpdater, useMemo, useState } from "preact/hooks";
import CalenderPicker from "@/components/pickers/calender.tsx";
import TimePicker from "@/components/pickers/time.tsx";
import { Toggle } from "@/components/buttons/toggle.tsx";

export default function StageTwo({
  eventState,
  setPage,
}: {
  eventState: Signal<Event>;
  setPage: StateUpdater<number>;
}) {
  const { multiEntry, maxTickets, additionalFields } = eventState.value;
  const [mEntry, setMEntry] = useState(multiEntry);

  return (
    <>
      <div class="flex flex-col gap-4">
        <div className="flex gap-4 grow">
          <Toggle
            name="Allow Multi-Entry"
            description="Allow attendees to enter multiple times on the same ticket"
            setEnabled={setMEntry}
            enabled={mEntry}
          />
          <label htmlFor="" class="flex flex-col w-40">
            <p className="label-text">Maximum Attendees</p>
            <input type="number" class="p-2 border rounded-md border-gray-300" pattern="\d*" />
          </label>
        </div>
				<h3 class="font-medium text-center">
					Additional Fields
				</h3>
				<h4 class="text-sm font-medium">Required Fields</h4>
				<h4 class="text-sm font-medium">Additional Fields</h4>
        <div className="flex justify-between">
          <CTA
            btnType="secondary"
            btnSize="sm"
            className="!w-20 md:!w-40"
            type="button"
            onClick={() => setPage(1)}
          >
            Back
          </CTA>
          <CTA
            btnType="cta"
            btnSize="sm"
            className="!w-20 md:!w-40"
            onClick={() => {}}
          >
            Next
          </CTA>
        </div>
      </div>
    </>
  );
}
