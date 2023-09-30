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
  const [file, setFile] = useState<string>(
    "iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII="
  );
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
    // minimal client side rezising/optimization
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
