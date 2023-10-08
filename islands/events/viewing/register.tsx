import { useState } from "preact/hooks";
import CTA from "@/components/buttons/cta.tsx";

export default function EventRegister() {
	const [open, setOpen] = useState(false)

	return (
		<div className="mx-auto flex flex-col items-center mt-14">
			<p class="font-semibold mb-4 text-center">Want to attend? Regster and get your tickets now!</p>
			<CTA btnType="cta">
				Get Tickets
			</CTA>
		</div>
	)
}

export const EventRegisterSmall = () => {
	return (
		<button className="flex items-center select-none font-medium hover:bg-gray-200/75 hover:text-gray-900 transition  text-sm mx-auto mb-2 mt-1 rounded-md bg-white/25 backdrop-blur-xl border px-1.5 py-0.5" onClick={() => window.scrollTo({top: document.body.scrollHeight, behavior: "smooth"})}>
			Get Tickets
		</button>
	)
}