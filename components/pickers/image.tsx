import { StateUpdater, useRef, useState } from "preact/hooks";
import { Toggle } from "@/components/buttons/toggle.tsx";
import CameraPlus from "$tabler/photo-plus.tsx";
import { encode } from "$std/encoding/base64.ts";
import { JSX } from "preact";

export default function ImagePicker({
  fill,
  setFill,
  updateImage,
}: {
  updateImage: (image: File) => void;
  fill: boolean;
  setFill: StateUpdater<boolean>;
}) {
  const [file, setFile] = useState<string>();
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputRef = useRef<HTMLLabelElement>(null);

  const uploadFile = async (file: File) => {
    setLoading(true);
    updateImage(file);
    const b64 = encode(await file.arrayBuffer());
    setFile(b64);
    setLoading(false);
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
    <div className="flex flex-col w-full">
      <label
        class="flex flex-col"
        ref={inputRef}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div
          class={`${
            file ? "h-12" : "h-36"
          } grow border border-gray-300 border-dashed rounded-md flex items-center justify-center group cursor-pointer transition hover:bg-gray-100`}
        >
          <CameraPlus class="text-gray-500 group-hover:text-gray-600 transition" />{" "}
          <p class="ml-2 font-medium text-gray-600 group-hover:text-gray-700 transition">
            Upload Banner Image
          </p>
        </div>
        <input
          type="file"
          accept="image/png, image/gif, image/jpeg"
          class="hidden"
          onInput={(e) => uploadFile(e.currentTarget.files![0])}
        />
      </label>
      <p className="text-center mt-1 mb-2 text-sm text-gray-600">
        We reccomend images at least 1440 x 360 at an aspect ratio of 4:1
      </p>
      {file && (
        <>
          <div className="relative">
            <img
              src={"data:image/png;base64, " + file}
              class={`rounded-md mt-4 ${
                fill ? "object-fill" : "object-cover"
              } object-center h-36 w-full mb-2`}
            />
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
