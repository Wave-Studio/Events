import CTA from "@/components/buttons/cta.tsx";

export default function NotFound() {
  return (
    <div class="flex flex-col items-center justify-center grow">
      <p>Invalid event ID or you're not authorized to access this event</p>
      <p class="font-bold">Contact your event organizer for details</p>
      <a href="/">
        <CTA btnType="cta" className="mt-10">
          Homepage
        </CTA>
      </a>
    </div>
  );
}
