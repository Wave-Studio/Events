import { Signal } from "@preact/signals";
import { Event, Field } from "@/utils/db/kv.ts";
import CTA from "@/components/buttons/cta.tsx";
import Plus from "$tabler/plus.tsx";
import Trash from "$tabler/trash.tsx";
import ChevronDown from "$tabler/chevron-down.tsx";
import { Ref, StateUpdater, useRef, useState } from "preact/hooks";
import { Toggle } from "@/components/buttons/toggle.tsx";
import useClickAway from "@/components/hooks/onClickAway.tsx";

export default function StageTwo({
	eventState,
	setPage,
}: {
	eventState: Signal<Event>;
	setPage: StateUpdater<number>;
}) {
	const { multiEntry, additionalFields } = eventState.value;

	const [fields, setFields] = useState<Field[]>(
		additionalFields.length == 0
			? [
					{
						name: "",
						description: "",
						id: crypto.randomUUID(),
						type: "text",
					},
				]
			: additionalFields,
	);
	const [mEntry, setMEntry] = useState(multiEntry);

	const save = () => {
		eventState.value.multiEntry = mEntry;
		eventState.value.additionalFields = fields.filter((f) => Boolean(f.name));
	};

	const addField = () => {
		setFields((f) => [...f, defaultField()]);
	};

	return (
		<>
			<div class="flex flex-col gap-4">
				<section className="flex flex-col md:flex-rows gap-4 grow">
					<Toggle
						name="Allow Multi-Entry"
						description="Allow attendees to enter multiple times on the same ticket"
						setEnabled={setMEntry}
						enabled={mEntry}
					/>
				</section>
				<AdditionalInputs />
				<section>
					<h4 class="text-sm font-medium mb-2">Additional Inputs</h4>
					{fields.map((field) => (
						<FieldInput field={field} fields={fields} setFields={setFields} />
					))}
					<button
						className="flex font-medium text-gray-500 hover:text-gray-600 transition  items-center cursor-pointer py-1 group w-full"
						onClick={addField}
					>
						<div className="grow h-0.5 bg-gray-300" />
						<div class="mx-2 flex items-center">
							Add field <Plus class="h-4 w-4 ml-2 group-hover:scale-110" />
						</div>
						<div className="grow h-0.5 bg-gray-300" />
					</button>
				</section>
				<div className="flex justify-between mt-6">
					<CTA
						btnType="secondary"
						btnSize="sm"
						className="!w-20 md:!w-40"
						type="button"
						onClick={() => {
							save();
							setPage(1);
						}}
					>
						Back
					</CTA>
					<CTA
						btnType="cta"
						btnSize="sm"
						className="!w-20 md:!w-40"
						onClick={() => {
							save();
							setPage(3);
						}}
					>
						<span className="sm:hidden">Create</span>
						<span className="hidden sm:block">Create Event</span>
					</CTA>
				</div>
			</div>
		</>
	);
}

export const AdditionalInputs = () => {
	const reqs: { name: string; type: Field["type"] }[] = [
		{
			name: "First Name",
			type: "text",
		},
		{
			name: "Last Name",
			type: "text",
		},
		{
			name: "Email",
			type: "email",
		},
	];
	return (
		<>
			<h3 class="font-medium text-center -mb-4 mt-4">Additional Inputs</h3>
			<p class="text-center text-sm">
				These are the fields that users must input when they register for an
				event. We require a name and email by default.{" "}
			</p>
			<section>
				<h4 class="text-sm font-medium">Required Inputs</h4>
				<div className="flex flex-col gap-2 mt-2">
					{reqs.map((req) => (
						<div className="flex justify-between items-center">
							<p class="text-sm font-medium">{req.name}</p>
							<p className="rounded-md border border-gray-300 font-semibold text-gray-500 px-2 bg-gray-100">
								{req.type}
							</p>
						</div>
					))}
				</div>
			</section>
		</>
	);
};

export const FieldInput = ({
	field,
	fields,
	setFields,
}: {
	field: Field;
	fields: Field[];
	setFields: StateUpdater<Field[]>;
}) => {
	const [typeOpen, setTypeOpen] = useState(false);
	const typeRef = useRef<HTMLButtonElement>(null);

	const removeField = (id: string) => {
		setFields((f) => f.filter((field) => field.id != id));
	};

	const updateField = (update: Partial<Field>) => {
		setFields((f) =>
			f.map((field) => {
				if (field.id != update.id) return field;
				return {
					...field,
					...update,
				};
			}),
		);
	};

	const FieldPicker = ({ field, id }: { id: string; field: Field["type"] }) => {
		const pickerRef = useRef<HTMLDivElement>(null);
		useClickAway([pickerRef, typeRef], () => setTypeOpen(false));
		const types: Field["type"][] = ["number", "text", "toggle", "email"];
		const changeType = (type: Field["type"]) => {
			updateField({ id, type });
			setTypeOpen((t) => !t);
		};

		return (
			<div
				className="absolute z-20 top-7 bg-white font-medium border border-gray-300 rounded-md px-2 py-2 shadow-xl cursor-default select-none flex flex-col items-start gap-2"
				ref={pickerRef}
			>
				{types.map((type) => (
					<button
						className={`rounded-md border font-medium  px-2 h-6  ${
							type == field
								? "border-theme-normal/50 text-gray-600 bg-theme-normal/10"
								: "border-gray-300 text-gray-500 bg-gray-100"
						}`}
						onClick={() => changeType(type)}
					>
						{type}
					</button>
				))}
			</div>
		);
	};

	return (
		<div
			className="flex flex-col sm:flex-row justify-between items-center mb-4"
			key={field.id}
		>
			<div class="flex flex-col">
				<input
					placeholder="Input Name"
					type="text"
					class="nostyle border-b-2 border-dashed sm:w-64"
					value={fields.find((f) => f.id == field.id)?.name}
					onChange={(e) =>
						updateField({ id: field.id, name: e.currentTarget.value })
					}
				/>
				<input
					placeholder="Optional description"
					type="text"
					class="nostyle border-b-2 border-dashed text-sm mt-2 sm:w-80"
					value={fields.find((f) => f.id == field.id)?.description}
					onChange={(e) =>
						updateField({ id: field.id, description: e.currentTarget.value })
					}
				/>
			</div>
			<div className="flex gap-2 mt-2 sm:mt-0">
				<div class="relative flex flex-col">
					<button
						className="rounded-md border border-gray-300 font-medium text-gray-500 pl-2 h-6 bg-gray-100 flex items-center"
						ref={typeRef}
						onClick={() => setTypeOpen((t) => !t)}
					>
						{field.type} <ChevronDown class="size-4 ml-1 mr-1" />
					</button>
					{typeOpen && <FieldPicker field={field.type} id={field.id} />}
				</div>
				<button
					className="rounded-md border border-red-300 font-medium text-red-500 grid place-items-center size-6 bg-red-100"
					onClick={() => removeField(field.id)}
				>
					<Trash class="size-4" />
				</button>
			</div>
		</div>
	);
};

export const defaultField: () => Field = () => ({
	name: "",
	description: "",
	id: crypto.randomUUID(),
	type: "text",
});
