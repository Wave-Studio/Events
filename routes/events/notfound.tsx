import CTA from "@/components/buttons/cta.tsx";

export default function NotFound() {
	return (
		<div class="flex flex-col items-center justify-center grow text-center">
			<p class="font-bold">
				The event ID is invalid or you're not authorized to access this event
			</p>
			<a href="/">
				<CTA btnType="cta" className="mt-10" btnSize="sm">
					Homepage
				</CTA>
			</a>
		</div>
	);
}
