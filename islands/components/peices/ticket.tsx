import { ShowTime } from "@/utils/db/kv.types.ts";
import { fmtDate, fmtTime } from "@/utils/dates.ts";
import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { qrcode } from "https://deno.land/x/qrcode@v2.0.0/mod.ts";
import { asset } from "$fresh/runtime.ts";
import { QR } from "@/components/svgs/qr.tsx";

export default function Ticket({
  showTime,
  id,
  tickets,
}: {
  tickets: number;
  showTime: ShowTime;
  id: string;
}) {
  const qr = useSignal<undefined | string>(undefined);

  useEffect(() => {
    (async () => {
      await new Promise((resolve) =>
        setTimeout(resolve, 400 + (Math.random() * 200 + 1)),
      );

      const qrObj = (await qrcode(id, {
        size: 232,
        // No clue why typings are wrong
      })) as unknown as string;

      qr.value = qrObj;
    })();
  }, []);

  return (
    <div class="flex flex-col items-center ">
      <h4 class="font-bold mt-4">Your QR Code</h4>
      <p class="text-gray-700 text-sm max-w-xs">
        You'll scan this when entering your event.{" "}
      </p>
      <div class="bg-gray-100 border font-semibold text-gray-700 px-1.5 text-sm rounded-md w-max mt-4 mb-2 ">
        {tickets} ticket{tickets > 1 && "s"}
      </div>
      {qr.value != undefined ? (
        <img src={qr.value} alt="QR Code" width={232} />
      ) : (
        <QR />
      )}
      <p class="text-xs text-gray-500 text-center mt-4">
        ID: {id.split("_")[2]}
      </p>
      <div class="grid gap-2">
        <div>
          <h5 class="font-medium mb-0.5 mt-4 text-sm text-center">
            Event Date & Time
          </h5>
          <div class="bg-gray-100 border font-medium px-1.5 rounded-md text-center">
            {fmtDate(new Date(showTime.startDate!))}
          </div>
        </div>
        <div class="flex justify-center">
          {showTime.startTime && (
            <div class="lowercase bg-gray-100 border font-medium px-1.5 rounded-md">
              {fmtTime(new Date(showTime.startTime))}
            </div>
          )}
          {showTime.endTime && (
            <>
              <p class="px-3">-</p>
              <div class="lowercase bg-gray-100 border font-medium px-1.5 rounded-md">
                {fmtTime(new Date(showTime.endTime))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
