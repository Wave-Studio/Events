import { useState } from "preact/hooks";
import ImagePicker from "../../components/pickers/image.tsx";
import { Event } from "@/utils/db/kv.types.ts";

export default function EditingImagePicker({
  event,
  eventID,
  imgURL,
}: {
  event: Event;
  eventID: string;
  imgURL?: string;
}) {
  const [uploading, setUploading] = useState(false);
  return (
    <ImagePicker
      eventID={eventID}
      uploading={uploading}
      setUploading={setUploading}
      defaultFill={event.banner.fill}
      defaultImage={imgURL}
    />
  );
}
