import { Signal } from "@preact/signals";
import { Event } from "@/utils/db/kv.ts";

export default function StageTwo({state}: {state: Signal<Event>}) {
	return (
		<div className="">
			{/* <input type="text" value={state.value.name} onInput={(e) => state.value = {...state.value, name: e.currentTarget.value}} /> */}
		</div>
	);
}