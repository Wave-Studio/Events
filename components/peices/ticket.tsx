import { ShowTime } from "@/utils/db/kv.types.ts";
import { fmtDate, fmtTime } from "@/utils/dates.ts";

export default function Ticket({
  showTime,
  id,
  tickets,
}: {
  tickets: number;
  showTime: ShowTime;
  id: string;
}) {
  return (
    <div class="flex flex-col items-center">
      <h4 class="font-bold mt-4">Your QR Code</h4>
      <p class="text-gray-700 text-sm max-w-xs">
        You'll scan this when entering your event.{" "}
      </p>
      <div class="bg-gray-100 border font-semibold text-gray-700 px-1.5 text-sm rounded-md w-max mt-4 mb-2 ">
        {tickets} ticket{tickets > 1 && "s"}
      </div>
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Rickrolling_QR_code.png"
        alt="QR Code"
        width={200}
      />
      <p class="text-xs text-gray-500">ID: {id}</p>
      <div class="grid gap-2">
        <div>
          <h5 class="font-medium mb-0.5 mt-4 text-sm">Event Date & Time</h5>
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
