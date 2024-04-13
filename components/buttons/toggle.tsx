// basic switch if we ever need to use it
export const Switch = ({
	enabled,
	setEnabled,
	disabled,
}: {
	enabled: boolean;
	setEnabled: (state: boolean) => void;
	disabled: boolean;
}) => {
	return (
		<button
			disabled={disabled}
			class="rounded-full w-12 min-w-[3rem] border border-gray-300 flex items-center cursor-pointer disabled:brightness-90"
			onClick={() => setEnabled(!enabled)}
			type="button"
			tabIndex={0}
			onKeyDown={(e) => {
				if (e.key == "Enter") setEnabled(!enabled);
			}}
		>
			<div
				class={`h-5 w-5 m-0.5 ${
					enabled ? "bg-theme-normal translate-x-[1.425rem]" : "bg-gray-200"
				} transition duration-200 rounded-full`}
			/>
		</button>
	);
};

// drop in component version of switch
export const Toggle = ({
	disabled = false,
	enabled,
	setEnabled,
	name,
	description,
}: {
	disabled?: boolean;
	enabled: boolean;
	setEnabled: (state: boolean) => void;
	name: string;
	description?: string;
}) => {
	return (
		<div class="flex items-center justify-between grow w-full">
			<div class="mr-4">
				<h3 class="text-sm font-medium mb-0.5">{name}</h3>
				<p class="text-xs text-gray-500 max-w-sm">{description}</p>
			</div>
			<Switch setEnabled={setEnabled} enabled={enabled} disabled={disabled} />
		</div>
	);
};
