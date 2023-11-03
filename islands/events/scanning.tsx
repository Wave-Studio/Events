import { useEffect, useState } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";
// Currently causes issues, hopefully it's fixed soon
import { BarcodeDetector } from "npm:barcode-detector";

export default function Scanner({ className }: { className?: string }) {
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    (async () => {
      if (!IS_BROWSER) return;
      if (initialized) return;
      setInitialized(true);
      const canvas = document.getElementById("scanui") as HTMLCanvasElement;
        const barcodeReaderAPI = window["BarcodeDetector"] ?? BarcodeDetector;
        if (barcodeReaderAPI == null) {
          return setError(
            "BarcodeDetector API is required but not supported on your device! Please try another browser.",
          );
        }
        const reader = new barcodeReaderAPI({
          formats: ["qr_code"],
        });
      if (canvas == null) return;
      const ctx = canvas.getContext("2d", {
        willReadFrequently: true,
      });
      if (ctx == null) {
        return setError(
          "2D HTML Canvas is required but not supported on your device! Please try another browser.",
        );
      }

      try {
        const devices = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        const video = document.getElementById("camera") as HTMLVideoElement;

        if (!video) return;

        video.srcObject = devices;
        video.onloadedmetadata = () => {
          video.play();
          const container = document.getElementById("scale-factor")!;
          canvas.width = container.clientWidth;
          canvas.height = container.clientHeight;

          const checkedCodes: string[] = [];

          const lookForBarcodes = async () => {
            // const codes = await reader.detect(video);
            // if (codes.length > 0) {
            //   for (const code of codes) {
            //     if (checkedCodes.includes(code.rawValue)) continue;
            //     checkedCodes.push(code.rawValue);
            //     console.log(code);
            //   }
            // }
          };

		  // TODO: @quick007 Fix this because our brains are cooking in their own fluids - Bloxs
          console.log(
            "Video:",
            video.videoWidth,
            video.videoHeight,

            "Canvas:",
            canvas.width,
            canvas.height,

            "Meth:",
            (video.videoWidth - canvas.width) / 2,
            (video.videoHeight - canvas.height) / 2,

            "Meth 2 electric boogaloo:",
            video.videoWidth - (video.videoWidth - canvas.width) / 2,
            video.videoHeight - (video.videoHeight - canvas.height) / 2,

            "Aspects: ",
			((video.videoWidth - (video.videoWidth - canvas.width) / 2) - ((video.videoWidth - canvas.width) / 2))
			/
			((video.videoHeight - (video.videoHeight - canvas.height) / 2) - ((video.videoHeight - canvas.height) / 2)),


            canvas.width / canvas.height,
          );

          const loop = () => {
            ctx.drawImage(
              video,

              (video.videoWidth - canvas.width) / 2,
              (video.videoHeight - canvas.height) / 2,

              video.videoWidth - (video.videoWidth - canvas.width) / 2,
              video.videoHeight - (video.videoHeight - canvas.height) / 2,

              0,
              0,
              canvas.width,
              canvas.height,
            );

            lookForBarcodes();

            requestAnimationFrame(loop);
          };

          requestAnimationFrame(loop);
        };
      } catch (e) {
        setError(e.message);
        return;
      }
    })();
  }, [IS_BROWSER]);

  return (
    <>
      <video
        id="camera"
        hidden={true}
        autoPlay={true}
        playsInline={true}
        muted={true}
        className="border-none"
      />
      {error}
      <div id="scale-factor" className="h-[30rem] w-[30rem]">
        <canvas id="scanui" className={className}></canvas>
      </div>
    </>
  );
}
