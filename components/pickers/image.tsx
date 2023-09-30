import { StateUpdater, useRef, useState } from "preact/hooks";
import { Toggle } from "@/components/buttons/toggle.tsx";
import CameraPlus from "$tabler/photo-plus.tsx";
import UpArrow from "$tabler/arrow-up.tsx";
import Loading from "$tabler/loader-2.tsx";
import { encode } from "$std/encoding/base64.ts";
import { JSX } from "preact";

export default function ImagePicker({
  fill,
  setFill,
  updateImage,
  eventID,
}: {
  updateImage: (link: string | undefined) => void;
  fill: boolean;
  setFill: StateUpdater<boolean>;
  eventID: string;
}) {
  const [file, setFile] = useState<string>();
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const inputRef = useRef<HTMLLabelElement>(null);

  const uploadFile = async (file: File) => {
    // seperate loading to show b64 conversion vs actual uploading
    setLoading(true);
    const b64 = encode(await file.arrayBuffer());
    setFile(b64);
    setLoading(false);
    setUploading(true);
    updateImage("loading");
    // TODO: minimal client side rezising/optimization
    // upload file to imagekit
    updateImage("link here");
    setUploading(false);
  };

  const handleDrag = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragging(true);
    } else if (e.type === "dragleave") {
      setDragging(false);
    }
  };

  const handleDrop = (e: JSX.TargetedDragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="flex flex-col">
      <label
        class="flex flex-col"
        ref={inputRef}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        tabIndex={0}
      >
        <div
          class={`${
            file ? "h-12" : "h-36"
          } grow border border-gray-300 border-dashed rounded-md flex items-center justify-center group cursor-pointer transition hover:bg-gray-100`}
        >
          {dragging ? (
            <UpArrow class="text-gray-500 group-hover:text-gray-600 transition animate-bounce mt-1" />
          ) : (
            <CameraPlus class="text-gray-500 group-hover:text-gray-600 transition" />
          )}
          <p class="ml-2 font-medium text-gray-600 group-hover:text-gray-700 transition">
            {loading
              ? "Converting..."
              : uploading
              ? "Uploading..."
              : dragging
              ? "Drop Image to Upload"
              : "Upload Banner Image"}
          </p>
        </div>
        <input
          type="file"
          accept="image/png, image/gif, image/jpeg"
          class="hidden"
          onInput={(e) => uploadFile(e.currentTarget.files![0])}
          disabled={uploading || loading}
        />
      </label>
      <p className="text-center mt-1 mb-2 text-sm text-gray-600">
        We reccomend images at least 1440 x 360 at an aspect ratio of 4:1
      </p>
      {file && (
        <>
          <div className="relative flex flex-col items-center">
            <img
              src={"data:image/png;base64, " + file}
              class={`rounded-md mt-4 ${
                fill ? "object-fill" : "object-cover"
              } object-center h-36 w-full mb-2`}
            />
            {uploading && (
              <div className="bottom-4 absolute flex items-center gap-2 text-white font-medium text-sm rounded-md bg-black/20 px-2 py-0.5">
                <Loading class="w-4 h-4 animate-spin" /> Uploading...
              </div>
            )}
          </div>
          <Toggle
            name="Stretch to Fit"
            description="Stretch your image to fit the width of banner box. The way an image stretchs will vary based on device screen size. "
            setEnabled={setFill}
            enabled={fill}
          />
        </>
      )}
    </div>
  );
}
