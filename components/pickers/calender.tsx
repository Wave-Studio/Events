import Calendar from "$tabler/calendar.tsx";
import Left from "$tabler/chevron-left.tsx";
import Right from "$tabler/chevron-right.tsx";
import { useState } from "preact/hooks";

export default function CalenderPicker({
  initialDate,
  updateDate,
}: {
  initialDate: Date | undefined;
  updateDate: (date: Date | undefined) => void;
}) {
  const years = Array.from({ length: 2041 - 2020 }, (_, i) => 2020 + i);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
	const days = [
		"Sun",
		"Mon",
		"Tue",
		"Wen",
		"Thu",
		"Fri",
		"Sat"
	]
  const today = new Date();

	// chatgpt wrote this and every time it tried to make it smaller smth broke
	function getMonthDays(month: number, year: number): { number: number; inMonth: boolean }[] {
		const daysInMonth = new Date(year, month + 1, 0).getDate();
		const firstDay = new Date(year, month, 1).getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
		const result: { number: number; inMonth: boolean }[] = [];
	
		// Fill in the previous month's days
		const lastMonthDays = new Date(year, month, 0).getDate();
		for (let i = firstDay - 1; i >= 0; i--) {
			result.push({ number: lastMonthDays - i, inMonth: false });
		}
	
		// Fill in the current month's days
		for (let i = 1; i <= daysInMonth; i++) {
			result.push({ number: i, inMonth: true });
		}
	
		// Fill in the next month's days to reach 42 days
		const daysToAdd = 42 - result.length;
		for (let i = 1; i <= daysToAdd; i++) {
			result.push({ number: i, inMonth: false });
		}
	
		return result;
	}

	

  const [eventDate, setEventDate] = useState(initialDate);
  const [open, setOpen] = useState(false);
  const [cal, setCal] = useState({
    month: initialDate ? initialDate.getMonth() : today.getMonth(),
    year: initialDate ? initialDate.getFullYear() : today.getFullYear(),
  });


  return (
    <div class="border-gray-300 border rounded-md px-3 flex items-center h-12 cursor-pointer group/main relative">
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
      <div className="absolute left-1 right-1 z-10 translate-y-12 bg-white border border-gray-300 rounded-md px-1 py-2 shadow-xl cursor-default">
        <div className="flex justify-between">
          <div class="group hover:bg-gray-200 rounded transition">
            <Left class="text-gray-500 group-hover:text-gray-700 transition cursor-pointer" />
          </div>
          <p className="font-medium">{months[cal.month]}</p>
          <div class="group hover:bg-gray-200 rounded transition">
            <Right class="text-gray-500 group-hover:text-gray-700 transition cursor-pointer" />
          </div>
        </div>
        <div className="flex justify-center items-center gap-2">
          <p className="text-xs text-gray-500">{cal.year - 1}</p>
          <p className="text-sm text-gray-700 font-semibold">{cal.year}</p>
          <p className="text-xs text-gray-500">{cal.year + 1}</p>
        </div>
				<div className="grid grid-cols-7 place-items-center gap-2 mt-2 mx-1 mb-1">
					{getMonthDays(cal.month, cal.year).map(day => (
						<div class=" bg-red-500 w-7 h-7 rounded grid place-items-center">{day.number}</div>
					))}
				</div>
      </div>
    </div>
  );
}
