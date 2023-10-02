import { Event, User } from "@/utils/db/kv.types.ts";
import Footer from "@/components/layout/footer.tsx";
import Navbar from "@/components/layout/navbar.tsx";

export default function EventScanning({
  event,
  eventID,
  user,
}: {
  event: Event;
  user: User;
  eventID: string;
}) {
  return (
    <div>
      <Navbar />
      scanning stuff
      <Footer />
    </div>
  );
}
