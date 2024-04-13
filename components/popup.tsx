import useClickAway from "@/components/hooks/onClickAway.tsx";
import { useRef } from "preact/hooks";
import X from "$tabler/x.tsx";
import { ComponentChildren } from "preact";

export default function Popup({
	children,
	close,
	isOpen,
	className,
}: {
	isOpen: boolean;
	close: () => void;
	children: ComponentChildren;
	className?: string;
}) {
	if (!isOpen) return null;

	const dialog = useRef<HTMLDivElement>(null);
	useClickAway([dialog], close);

	return (
		<div class="fixed inset-0 bg-black/20 z-50 grid place-items-center">
			<div
				className={`rounded-md bg-white shadow-lg border border-gray-300 p-4 flex flex-col relative max-w-[95svw] max-h-[95svh] w-full overflow-y-auto md:max-w-xl ${className}`}
				ref={dialog}
			>
				{children}
				<button
					className="absolute right-2 top-2 p-0.5 rounded-md hover:bg-gray-200 transition"
					onClick={close}
				>
					<X class="size-5" />
				</button>
			</div>
		</div>
	);
}
