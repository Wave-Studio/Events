import { Event, User } from "@/utils/db/kv.types.ts";
import Footer from "@/components/layout/footer.tsx";

export default function EventViewing({
  event,
  eventID,
  user,
}: {
  event: Event;
  user: User | undefined;
  eventID: string;
}) {
  return (
    <main class="flex flex-col">
      <div className="grow flex flex-col">event viewing</div>
      <Footer />
    </main>
  );
}
