import { Signal } from "@preact/signals";
import { Event } from "@/utils/db/kv.ts";
import useForm from "@/components/fakeFormik/index.tsx";
import * as Yup from "yup";
import CTA from "@/components/buttons/cta.tsx";
import PhotoPlus from "$tabler/photo-plus.tsx";
import { StateUpdater, useMemo,  } from "preact/hooks";

export default function StageOne({ eventState, setPage }: { eventState: Signal<Event>, setPage: StateUpdater<number> }) {
  const {maxTickets, showTimes, venue} = eventState.value
  

  return (
    <div class="max-w-xl w-full">
      {/* <input type="text" value={state.value.name} onInput={(e) => state.value = {...state.value, name: e.currentTarget.value}} /> */}
      <div class="flex flex-col gap-6">
        <div className="flex gap-4 flex-col md:flex-row">
          <label class="flex flex-col grow">
            <p class="label-text label-required">Event Name</p>
            
          </label>
          <label class="flex flex-col ">
            <p class="label-text label-required">Maximum Attendees</p>
					<input class="grow md:w-80" type="number" value={maxTickets} />
          </label>
        </div>
        <label class="flex flex-col">
          <p class="label-text">Short Description</p>
          
        </label>
        <label class="flex flex-col">
          <p class="label-text">Banner Image</p>
          <div class=" h-44 border border-gray-300 rounded-md border-dashed flex items-center justify-center group cursor-pointer hover:border-solid font-medium">
            <PhotoPlus class="mr-2 text-gray-500 group-hover:scale-110 transition" />{" "}
            Add Banner
          </div>
          
        </label>
        <CTA btnType="cta" size="sm" className="ml-auto">
          Next
        </CTA>
      </div>
      {/* {JSON.stringify(formState.value)} */}
    </div>
  );
}
