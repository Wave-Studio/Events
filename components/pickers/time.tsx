import ClockHour5 from "$tabler/clock-hour-5.tsx";
import { useMemo, useState } from "preact/hooks";

export default function TimePicker({
  initialTime,
  updateTime,
}: {
  initialTime: Date | undefined;
  updateTime: (date: Date | undefined) => void;
}) {
  const [eventTime, setEventTime] = useState(initialTime);
  const formatter = new Intl.DateTimeFormat("en-US", {
    hour12: true,
    hour: "2-digit"
  })

  return (
    <div class="border-gray-300 border rounded-md px-3 flex items-center h-12">
      {eventTime ? (
        <>
          <p class="font-semibold">
            {formatter.format(eventTime).slice(0,2)}
          </p>
          <p class="text-x text-gray-400 mx-0.5">:</p>
          <p class="font-semibold">{eventTime.getMinutes() < 10 ? "0" + eventTime.getMinutes() : eventTime.getMinutes()}<span class="lowercase">{formatter.format(eventTime).slice(2)}</span></p>
        </>
      ) : (
        <p class="text-gray-500 font-medium">No time</p>
      )}
      <ClockHour5 class="ml-auto text-gray-500" />
    </div>
  );
}

