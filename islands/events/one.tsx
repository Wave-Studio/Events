import { Signal } from "@preact/signals";
import { Event } from "@/utils/db/kv.ts";
import useForm from "@/components/fakeFormik/index.tsx";

export default function StageOne({state}: {state: Signal<Event>}) {
	const [Field, formState, submitForm] = useForm({
		initialState: {
			test: "amongus"
		},
		onSubmit: (state) => console.log(state)
	})

	return (
		<div class="">
			ssss
			<input type="text" value={state.value.name} onInput={(e) => state.value = {...state.value, name: e.currentTarget.value}} />

			<Field />
		</div>
	);
}