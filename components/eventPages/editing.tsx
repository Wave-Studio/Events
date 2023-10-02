import { Event, Roles, User } from "@/utils/db/kv.types.ts";
import Footer from "@/components/layout/footer.tsx";
import Navbar from "@/components/layout/navbar.tsx";
import CTA from "@/components/buttons/cta.tsx";
import Trash from "$tabler/trash.tsx";
import Users from "$tabler/users.tsx";
import ImagePicker from "@/components/pickers/image.tsx";
import EditingImagePicker from "@/islands/events/editing/images.tsx";
import imageKit from "@/utils/imagekit.ts";

export default function EventEditing({
  event,
  eventID,
  user,
  role,
}: {
  event: Event;
  user: User;
  eventID: string;
  role: Roles;
}) {

  const imageURL = event.banner.path && imageKit.url({
		path: event.banner.path,
		transformation: [{
			width: "750",
			quality: "95"
		}]
	})

  const Header = () => (
    <div className="flex justify-between">
      <a href="/events/organizing">
        <CTA btnType="cta" btnSize="sm">
          Back to events
        </CTA>
      </a>
      <div className="flex gap-4">
        <CTA
          btnType="secondary"
          btnSize="sm"
          className="!w-10 grid place-items-center"
        >
          <Users class="w-6 h-6" />
        </CTA>
        <CTA
          btnType="secondary"
          btnSize="sm"
          className="!w-10 grid place-items-center"
        >
          <Trash class="w-6 h-6" />
        </CTA>
      </div>
    </div>
  );

  return (
    <main class="flex flex-col min-h-screen">
      <Navbar />
      <div className="grow ">
        <div className="px-4 max-w-screen-md w-full mx-auto flex flex-col gap-8">
          <Header />
          <EditingImagePicker event={event} eventID={eventID} imgURL={imageURL} />
          event editing coming soon:tm:
        </div>
      </div>
      <Footer />
    </main>
  );
}
