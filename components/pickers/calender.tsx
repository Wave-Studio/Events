import Calendar from "$tabler/calendar.tsx";
import { useState } from "preact/hooks";

export default function CalenderPicker({
  initialDate,
  updateDate,
}: {
  initialDate: Date | undefined;
  updateDate: (date: Date | undefined) => void;
}) {
  const [eventDate, setEventDate] = useState(initialDate);
  return (
    <div class="border-gray-300 border rounded-md px-3 flex items-center h-12">
      {eventDate ? (
        <>
          <p class="font-semibold">{eventDate.getMonth() + 1}</p>
          <p class="text-xl text-gray-400 mx-2.5">/</p>
          <p class="font-semibold">{eventDate.getDate()}</p>
          <p class="text-xl text-gray-400 mx-2.5">/</p>
          <p class="font-semibold">
            {eventDate.getFullYear().toString().slice(2)}
          </p>
        </>
      ) : (
        <p class="text-gray-500 font-medium">No date selected</p>
      )}
      <Calendar class="ml-auto text-gray-500" />
    </div>
  );
}
