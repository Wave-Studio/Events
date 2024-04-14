import { ScanningState } from "@/islands/events/scanning/scanning.types.ts";
import { ComponentChildren } from "preact";
import Loading from "$tabler/loader-2.tsx";

export const ScanningStates = ({
	scanningState,
}: {
	scanningState: ScanningState;
}) => {
	const Shell = ({ children }: { children: ComponentChildren }) => (
		<div
			class="rounded-md bg-black/50 backdrop-blur px-4 py-2 text-white  flex items-center"
			id="scantext"
		>
			{children}
		</div>
	);

	switch (scanningState) {
		case ScanningState.LOADING: {
			return (
				<Shell>
					<Loading class="w-5 h-5 animate-spin mr-1.5" /> Loading...
				</Shell>
			);
		}

		case ScanningState.VALID: {
			return <Shell>Valid Code</Shell>;
		}

		case ScanningState.INVALID: {
			// This was not my doing - Bloxs
			return <Shell>Invalid Code 🤓👆</Shell>;
		}

		case ScanningState.USED: {
			// 🤓👆 - Lukas
			return <Shell>This code was used already 🤓👆</Shell>;
		}

		case ScanningState.INACTIVE: {
			return <Shell>How did you manage to pull this off - Bloxs</Shell>;
		}

		default: {
			return <Shell>Bring Code into Focus</Shell>;
		}
	}
};
