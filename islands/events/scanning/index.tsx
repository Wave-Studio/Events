import { useEffect } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";
// Currently causes issues, hopefully it's fixed soon
import { BarcodeDetector } from "npm:barcode-detector";
// import { BarcodeDetector } from "https://fastly.jsdelivr.net/npm/barcode-detector@2/dist/es/pure.min.js";
import { Ticket } from "@/utils/db/kv.types.ts";
import { useSignal } from "@preact/signals";
import Dropdown from "../../components/pickers/dropdown.tsx";
import CameraRotate from "$tabler/camera-rotate.tsx";
import CameraPlus from "$tabler/camera-plus.tsx";
import Popup from "@/components/popup.tsx";
import {
  ScanningState,
  TicketState,
} from "@/islands/events/scanning/scanning.types.ts";

// Chatgpt fucked this up too much so we're abandoning rotations - Bloxs
// Should've paid attention in trig class - LS

export default function Scanner({ eventID }: { eventID: string }) {
  const error = useSignal<string | null>(null);
  const isInitialized = useSignal(false);
  const currentTicket = useSignal<TicketState | null>(null);
  const cameraIds = useSignal<MediaDeviceInfo[]>([]);
  const currentCamera = useSignal<string>("");
  const isCameraSwitching = useSignal(false);
  const cameraSwitchPopupOpen = useSignal(false);
  const scanningState = useSignal<ScanningState>(ScanningState.READY);

  const scanCode = async (code: string) => {
    try {
      const res = await fetch(`/api/events/scanned`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ticketID: code, eventID: eventID }),
      });

      if (res.status != 200) return false;
      return true;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    (async () => {
      if (!IS_BROWSER) return;
      if (isInitialized.value) return;
      isInitialized.value = true;
      const canvas = document.getElementById("scanui") as HTMLCanvasElement;
      const barcodeReaderAPI = globalThis["BarcodeDetector"] ?? BarcodeDetector;
      if (barcodeReaderAPI == null) {
        error.value =
          "BarcodeDetector API is required but not supported on your device! Please try another browser.";
        return;
      }
      const reader = new barcodeReaderAPI({
        formats: ["qr_code"],
      });
      if (canvas == null) return;
      const ctx = canvas.getContext("2d", {
        willReadFrequently: true,
      });
      if (ctx == null) {
        error.value =
          "2D HTML Canvas is required but not supported on your device! Please try another browser.";
        return;
      }

      try {
        const devices = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment",
          },
        });

        let currentCameraBeingRendered = devices.id;

        currentCamera.value = devices.id;

        const videoDevices = (
          await navigator.mediaDevices.enumerateDevices()
        ).filter((d) => d.kind == "videoinput");

        cameraIds.value = videoDevices;

        console.log(videoDevices);

        const video = document.getElementById("camera") as HTMLVideoElement;
        const infoText = document.getElementById("scantext") as HTMLDivElement;
        let lastStr = infoText.innerText;

        const updateStringIfChanged = (str: string) => {
          if (lastStr != str) {
            lastStr = str;
            infoText.innerText = str;
          }
        };

        if (!video) return;

        video.srcObject = devices;

        video.onerror = (e) => {
          console.error(e);
        };

        video.onloadedmetadata = () => {
          video.play();
          isCameraSwitching.value = false;
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          const checkedCodes: Map<string, TicketState> = new Map();

          setInterval(() => {
            for (const [code, codeData] of checkedCodes) {
              const timeSinceScan = Date.now() - codeData.checkedAt;

              if (
                codeData.status === ScanningState.LOADING &&
                timeSinceScan > 5 * 1000
              ) {
                checkedCodes.delete(code);
              }

              if (timeSinceScan > 15 * 1000) {
                checkedCodes.delete(code);
              }
            }
          }, 5 * 1000);

          const switchCamera = async (deviceId: string) => {
            isCameraSwitching.value = true;

            const devices = await navigator.mediaDevices.getUserMedia({
              video: {
                facingMode: "environment",
                deviceId: deviceId,
              },
            });

            currentCameraBeingRendered = deviceId;

            video.srcObject = devices;
          };

          const fetchCodeInfo = async (code: string) => {
            try {
              const res = await fetch(`/api/events/fetch`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ ticketID: code, eventID: eventID }),
              });

              const data = await (res.json() as Promise<Ticket>);

              if (res.status == 400 || res.status == 500) {
                checkedCodes.set(code, {
                  status: ScanningState.INVALID,
                  checkedAt: Date.now(),
                });
              } else {
                checkedCodes.set(code, {
                  status: data.hasBeenUsed
                    ? ScanningState.USED
                    : ScanningState.VALID,
                  ticketData: data,
                  checkedAt: Date.now(),
                });
              }
            } catch {
              checkedCodes.set(code, {
                status: ScanningState.INVALID,
                checkedAt: Date.now(),
              });
            }
          };

          let targetQRCode: string | null = null;

          canvas.onclick = async (e) => {
            // This now works, but it makes no sense - Bloxs

            // THIS SHIT DOESN'T WORK
            // WHY, HAS I EVER???? - Bloxs

            let x = e.offsetX;
            let y = e.offsetY;
            const xOffset = canvas.clientWidth;
            const yOffset = canvas.clientHeight;

            const xAdjustment = canvas.width / xOffset;
            const yAdjustment = canvas.height / yOffset;

            x *= xAdjustment;
            y *= yAdjustment;

            const codes = await reader.detect(video);

            for (const code of codes) {
              const lowestX = code.boundingBox.left;
              const lowestY = code.boundingBox.top;
              const highestX = code.boundingBox.right;
              const highestY = code.boundingBox.bottom;

              if (x < lowestX || x > highestX || y < lowestY || y > highestY) {
                continue;
              }

              console.log("Found code!", code.rawValue);

              targetQRCode = code.rawValue;
              break;
            }
          };

          const lookForBarcodes = async () => {
            const codes = await reader.detect(video);
            if (codes.length > 0) {
              const largestCode: {
                size: number;
                code: DetectedBarcode | null;
              } = {
                size: 0,
                code: null,
              };

              for (const code of codes) {
                if (targetQRCode != null) {
                  if (code.rawValue == targetQRCode) {
                    largestCode.code = code;
                    break;
                  }
                }

                if (
                  code.boundingBox.width * code.boundingBox.height >
                    largestCode.size
                ) {
                  largestCode.size = code.boundingBox.width *
                    code.boundingBox.height;
                  largestCode.code = code;
                }
              }

              if (
                targetQRCode != undefined &&
                !codes.map((c) => c.rawValue).includes(targetQRCode)
              ) {
                targetQRCode = null;
              }

              if (largestCode.code != undefined) {
                const code = largestCode.code;

                if (!checkedCodes.has(code.rawValue)) {
                  checkedCodes.set(code.rawValue, {
                    status: ScanningState.LOADING,
                    checkedAt: Date.now(),
                  });

                  fetchCodeInfo(code.rawValue);
                } else {
                  const codeData = checkedCodes.get(code.rawValue)!;

                  codeData.checkedAt = Date.now();
                  checkedCodes.set(code.rawValue, codeData);
                }

                const codeData = checkedCodes.get(code.rawValue)!;

                const ticketObj: TicketState = {
                  status: codeData.status,
                  ticketData: Object.hasOwn(codeData, "ticketData")
                    ? (codeData as { ticketData: Ticket }).ticketData
                    : null,
                  checkedAt: codeData.checkedAt,
                } as TicketState;

                if (currentTicket.value != ticketObj) {
                  currentTicket.value = ticketObj;
                }

                ctx.fillStyle = ctx.strokeStyle = {
                  invalid: "red",
                  loading: "gray",
                  valid: "green",
                  used: "orange",
                  inactive: "blue",
                }[codeData.status];

                let leftX = canvas.width;
                let rightX = 0;
                let topY = canvas.height;
                let bottomY = 0;

                for (const point of code.cornerPoints) {
                  leftX = Math.min(leftX, point.x);
                  rightX = Math.max(rightX, point.x);
                  topY = Math.min(topY, point.y);
                  bottomY = Math.max(bottomY, point.y);
                }

                const canvasArea = canvas.width * canvas.height;
                const codeArea = largestCode.size;

                const ratio = codeArea / canvasArea;

                // TODO: @lukas add all of your'e dum scaling stuff here

                const padding = 16;

                leftX -= padding;
                rightX += padding;

                topY -= padding;
                bottomY += padding;

                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.roundRect(leftX, topY, rightX - leftX, bottomY - topY, 20);
                ctx.stroke();
                ctx.closePath();

                scanningState.value = codeData.status;
              } else {
                scanningState.value = ScanningState.READY;
                currentTicket.value = null;
              }
            }
          };

          const loop = async () => {
            if (currentCameraBeingRendered != currentCamera.value) {
              await switchCamera(currentCamera.value);
              return;
            }

            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            lookForBarcodes();

            requestAnimationFrame(loop);
          };

          requestAnimationFrame(loop);
        };
      } catch (e) {
        error.value = e.message;
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
        width={1920}
        height={1080}
      />
      {error.value}
      <div
        class={`flex flex-col items-center max-w-full relative w-max mx-auto rounded-md border border-gray-300 ${
          isCameraSwitching.value && "overflow-hidden"
        } `}
      >
        <canvas
          id="scanui"
          className={` h-max bg-gray-200 max-h-[70vh] w-max max-w-full transition-all ${
            isCameraSwitching.value && "blur brightness-90"
          }`}
        >
        </canvas>
        {/* Camera switching */}
        <div class="absolute top-4 right-4">
          {cameraIds.value.length === 1 && (
            <button
              class=""
              onClick={() => {
                currentCamera.value = cameraIds.value.find(
                  ({ deviceId }) => deviceId !== currentCamera.value,
                )?.deviceId || "";
              }}
            >
              <CameraRotate class="size-6 text-white" />
            </button>
          )}
          {cameraIds.value.length > 2 && (
            <>
              <Dropdown
                className="rounded-full bg-black/50 backdrop-blur size-10 items-center justify-center hidden md:flex"
                options={cameraIds.value.map(({ deviceId, label }) => ({
                  content: label,
                  onClick: () => {
                    if (currentCamera.value == deviceId) return;
                    currentCamera.value = deviceId;
                  },
                }))}
              >
                <CameraPlus class="size-6 text-white" />
              </Dropdown>
              <div
                className="rounded-full bg-black/50 backdrop-blur size-10 items-center justify-center flex md:hidden"
                onClick={() => (cameraSwitchPopupOpen.value = true)}
              >
                <CameraPlus class="size-6 text-white" />
              </div>
              <Popup
                close={() => (cameraSwitchPopupOpen.value = false)}
                isOpen={cameraSwitchPopupOpen.value}
              >
                <h3 class="font-semibold text-center mb-4">Select a Device</h3>
                <div class="flex flex-col divide-y">
                  {cameraIds.value.map(({ deviceId, label }) => (
                    <button
                      onClick={() => {
                        if (currentCamera.value == deviceId) return;
                        currentCamera.value = deviceId;
                        cameraSwitchPopupOpen.value = false;
                      }}
                      class="truncate text-sm font-medium py-2 max-w-xs"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </Popup>
            </>
          )}
        </div>

        {/* Ticket scanning bit */}
        <div
          class="rounded-md bg-black/50 backdrop-blur px-4 py-2 text-white absolute bottom-4"
          id="scantext"
        >
          Bring code into view
        </div>
      </div>
    </>
  );
}
