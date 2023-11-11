import Calendar from "$tabler/calendar.tsx";
import Left from "$tabler/chevron-left.tsx";
import Right from "$tabler/chevron-right.tsx";
import { useRef, useState } from "preact/hooks";
import useClickAway from "@/components/hooks/onClickAway.tsx";

export default function CalenderPicker({
  initialDate,
  updateDate,
}: {
  initialDate: Date | undefined;
  updateDate: (date: Date | undefined) => void;
}) {
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
  // Even though it's pretty trivial to do so, I decided not to show dates for 2 reasons:
  // 1: it makes the design feel a bit more cluttered
  // 2: people generally already know the date their event is going to happen, this UI is just for inputting that date, not figuring it out.
  const days = ["Sun", "Mon", "Tue", "Wen", "Thu", "Fri", "Sat"];
  const today = new Date();

  const [date, setDate] = useState(initialDate);
  const [open, setOpen] = useState(false);
  const calInputRef = useRef<HTMLDivElement>(null);
  const [cal, setCal] = useState({
    month: initialDate ? initialDate.getMonth() : today.getMonth(),
    year: initialDate ? initialDate.getFullYear() : today.getFullYear(),
  });

  const addMonths = (months: number) => {
    setCal(({ month, year }) => {
      year += Math.floor((month + months) / 12);
      month = (months + month) % 12;

      return { month, year };
    });
  };

  const subtractMonths = (months: number) => {
    setCal(({ month, year }) => {
      const newMonth = month - months;
      if (newMonth < 0) {
        year -= Math.ceil(-newMonth / 12);
      }
      month = ((newMonth % 12) + 12) % 12;

      return { month, year };
    });
  };

  const changeDate = (day: number | undefined) => {
    if (day == undefined) {
      setDate(undefined);
      updateDate(undefined);
      return;
    }
    const date = new Date(cal.year, cal.month, day);
    setDate(date);
    updateDate(date);
  };

  return (
    <div class="relative flex flex-col">
      <div
        class="border-gray-300 border rounded-md px-3 flex items-center h-12 cursor-pointer group/main"
        onClick={() => setOpen((open) => !open)}
        ref={calInputRef}
      >
        {date ? (
          <>
            <p class="font-semibold">{date.getMonth() + 1}</p>
            <p class="text-xl text-gray-400 mx-2.5">/</p>
            <p class="font-semibold">{date.getDate()}</p>
            <p class="text-xl text-gray-400 mx-2.5">/</p>
            <p class="font-semibold">
              {date.getFullYear().toString().slice(2)}
            </p>
          </>
        ) : (
          <p class="text-gray-500 font-medium">No date selected</p>
        )}
        <Calendar class="ml-auto text-gray-500" />
      </div>
      {open && <Cal />}
    </div>
  );

  function Cal() {
    const calenderRef = useRef<HTMLDivElement>(null);
    useClickAway([calenderRef, calInputRef], () => setOpen(false));

    return (
      <div
        class="z-20 absolute left-1 right-1 top-14 bg-white border border-gray-300 rounded-md px-1 py-2 shadow-xl cursor-default select-none max-w-xs"
        ref={calenderRef}
      >
        <div class="flex justify-between">
          <div
            class="group hover:bg-gray-200 rounded transition"
            onClick={() => subtractMonths(1)}
          >
            <Left class="text-gray-500 group-hover:text-gray-700 transition cursor-pointer" />
          </div>
          <p class="font-medium">{months[cal.month]}</p>
          <div
            class="group hover:bg-gray-200 rounded transition"
            onClick={() => addMonths(1)}
          >
            <Right class="text-gray-500 group-hover:text-gray-700 transition cursor-pointer" />
          </div>
        </div>
        <div class="flex justify-center items-center gap-2">
          <p
            class="text-xs text-gray-500 hover:text-gray-600 hover:font-medium transition cursor-pointer w-[1.85rem]"
            onClick={() => subtractMonths(12)}
          >
            {cal.year - 1}
          </p>
          <p class="text-sm text-gray-600 font-semibold">{cal.year}</p>
          <p
            class="text-xs text-gray-500 hover:text-gray-600 hover:font-medium transition w-[1.85rem] cursor-pointer"
            onClick={() => addMonths(12)}
          >
            {cal.year + 1}
          </p>
        </div>
        <div class="grid grid-cols-7 place-items-center gap-2 mt-3 mx-1 font-medium">
          {getMonthDays(cal.month, cal.year).map((day) =>
            day.inMonth ? (
              <div
                onClick={() => changeDate(day.number)}
                class={` w-7 h-7 rounded grid place-items-center hover:text-gray-700 cursor-pointer text-gray-600 transition ${
                  date &&
                  cal.year == date.getFullYear() &&
                  cal.month == date.getMonth() &&
                  day.number == date.getDate()
                    ? // is selected date
                      "border-2 border-gray-300 hover:bg-gray-50"
                    : "hover:bg-gray-200"
                }`}
              >
                {day.number}
              </div>
            ) : (
              <div class=" w-7 h-7 rounded grid place-items-center text-gray-300">
                {day.number}
              </div>
            ),
          )}
        </div>{" "}
        <p
          class={`text-xs text-right mr-2 transition ${
            date
              ? "text-gray-400 hover:text-gray-600 cursor-pointer"
              : "text-gray-200"
          }`}
          onClick={() => changeDate(undefined)}
        >
          Clear
        </p>
      </div>
    );
  }
}

// chatgpt wrote this and every time it tried to make it smaller smth broke
function getMonthDays(
  month: number,
  year: number,
): { number: number; inMonth: boolean }[] {
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
