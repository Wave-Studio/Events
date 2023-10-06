import { useEffect, useState } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";

export default function Scanner({ className }: { className?: string }) {
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    (async () => {
      if (!IS_BROWSER) return;
      if (initialized) return;
      setInitialized(true);
      const canvas = document.getElementById("scanui") as HTMLCanvasElement;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
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

          const loop = () => {
            const width = canvas.width;
            const height = canvas.height;

			// TODO: This fucking sucks - Bloxs
            ctx.drawImage(
              video,
              Math.min(Math.max(0, (video.videoWidth - width) / 2), canvas.width),
              Math.min(Math.max(0, (video.videoHeight - height) / 2), canvas.height),
              video.videoWidth,
              video.videoHeight,
              0,
              0,
              width,
              height,
            );
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
        //hidden={true}
        autoPlay={true}
        playsInline={true}
        muted={true}
      />
      {error}
      <canvas id="scanui" className={className}>
      </canvas>
    </>
  );
}
