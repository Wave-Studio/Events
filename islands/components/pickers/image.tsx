import { StateUpdater, useRef, useState } from "preact/hooks";
import { Toggle } from "@/components/buttons/toggle.tsx";
import CameraPlus from "$tabler/photo-plus.tsx";
import UpArrow from "$tabler/arrow-up.tsx";
import Loading from "$tabler/loader-2.tsx";
import { encode } from "$std/encoding/base64.ts";
import { JSX } from "preact";

export default function ImagePicker({
  defaultFill = false,
  uploading,
  setUploading,
  eventID,
  defaultImage,
}: {
  defaultFill?: boolean;
  uploading: boolean;
  setUploading: StateUpdater<boolean>;
  eventID: string;
  defaultImage?: string;
}) {
  const [file, setFile] = useState<string | undefined>(defaultImage);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fill, setFill] = useState(defaultFill);
  const [error, setError] = useState<string>();

  const inputRef = useRef<HTMLLabelElement>(null);

  const uploadFile = async (file: File) => {
    const permittedTypes: string[] = ["image/png", "image/gif", "image/jpeg"];

    if (!permittedTypes.includes(file.type)) {
      setError("Invalid file type");
      return;
    }
    // Separate loading to show b64 conversion vs actual uploading
    setLoading(true);
    const b64 = encode(await file.arrayBuffer());
    setFile(b64);
    setLoading(false);
    setUploading(true);
    // TODO: minimal client side resizing/optimization

    // upload file to imagekit
    const data = await fetch("/api/events/image/upload", {
      body: JSON.stringify({
        file: b64,
        eventID,
      }),
      method: "POST",
    });
    const res = await data.json();
    if (res.error) {
      setError(res.error);
    }
    setUploading(false);
  };

  const setStretch = async (fill: boolean) => {
    setUploading(true);
    // optimistically update UI
    setFill(fill);
    console.log(fill);
    const data = await fetch("/api/events/image/fill", {
      body: JSON.stringify({
        fill,
        eventID,
      }),
      method: "POST",
    });
    const res = await data.json();
    if (res.error || res.success == false) {
      setError(res.error ?? "An unknown error occurred, please try again");
      setFill(false);
    }
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
        We recommend images at least 1440 x 360 at an aspect ratio of 4:1
      </p>
      {error && (
        <p className="text-center mt-1 mb-2 text-red-500">Error: {error}</p>
      )}
      {file && (
        <>
          <div className="relative flex flex-col items-center">
            <img
              src={
                file.startsWith("https://")
                  ? file
                  : "data:image/png;base64, " + file
              }
              class={`rounded-md mt-4 ${
                fill ? "object-fill" : "object-cover"
              } object-center h-36 w-full mb-2`}
            />
            {uploading && (
              <div className="bottom-4 absolute flex items-center gap-2 text-white font-medium text-sm rounded-md bg-black/20 px-2 py-0.5">
                <Loading class="size-4 animate-spin" /> Uploading...
              </div>
            )}
          </div>
          <Toggle
            disabled={uploading}
            name="Stretch to Fit"
            description="Stretch your image to fit the width of banner box. The way an image stretches will vary based on device screen size. "
            setEnabled={setStretch as StateUpdater<boolean>}
            enabled={fill}
          />
        </>
      )}
    </div>
  );
}
