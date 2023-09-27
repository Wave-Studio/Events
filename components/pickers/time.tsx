import ClockHour5 from "$tabler/clock-hour-5.tsx";
import { useMemo, useRef, useState } from "preact/hooks";
import useClickAway from "@/components/hooks/onClickAway.tsx";
import { date } from "yup";

export default function TimePicker({
  initialTime,
  updateTime,
}: {
  initialTime: Date | undefined;
  updateTime: (date: Date | undefined) => void;
}) {
  const hrs = [...new Array(12)].map((_, i) => i + 1);
  const mins = [...new Array(60)].map((_, i) => i);
  const meridiems = [
    { name: "am", id: Meridiem.ANTE },
    { name: "pm", id: Meridiem.POST },
  ];

  const [time, setTime] = useState(initialTime);
  const [open, setOpen] = useState(false);
  const timeInputRef = useRef<HTMLDivElement>(null);
  const formatter = new Intl.DateTimeFormat("en-US", {
    hour12: true,
    hour: "2-digit",
  });

  const changeTime = (newTime?: {
    hour?: number;
    minutes?: number;
    meridiem?: Meridiem;
  }) => {
    if (!newTime) {
      setTime(undefined);
      updateTime(undefined);
      return;
    }
    const date = time ? new Date(time) : new Date();
    if (newTime.meridiem == undefined) {
      newTime.meridiem =
        (time?.getHours() ?? 0) < 12 ? Meridiem.ANTE : Meridiem.POST;
    }

    if (newTime.hour) {
      date.setHours(
        newTime.meridiem == Meridiem.POST ? newTime.hour + 12 : newTime.hour
      );
      // handle switching from pm to am
    } else if (time == undefined) {
      date.setHours(1);
    } else if (newTime.meridiem == Meridiem.ANTE) {
      date.setHours(
        time.getHours() > 12 ? time.getHours() - 12 : time.getHours()
      );
      // handle switching from am to pm
    } else if (newTime.meridiem == Meridiem.POST) {
      date.setHours(
        time.getHours() > 12 ? time.getHours() : time.getHours() + 12
      );
    }

    date.setMinutes(newTime.minutes ?? time?.getMinutes() ?? 0);
    setTime(date);
    updateTime(date);
  };

  return (
    <div class="relative flex flex-col">
      <div
        class="border-gray-300 border rounded-md px-3 flex items-center h-12 cursor-pointer group"
        onClick={() => setOpen((open) => !open)}
        ref={timeInputRef}
      >
        {time ? (
          <>
            <p class="font-semibold">{formatter.format(time).slice(0, 2)}</p>
            <p class="text-x text-gray-400 mx-0.5">:</p>
            <p class="font-semibold">
              {time.getMinutes() < 10
                ? "0" + time.getMinutes()
                : time.getMinutes()}
              <span class="lowercase">{formatter.format(time).slice(2)}</span>
            </p>
          </>
        ) : (
          <p class="text-gray-500 font-medium">No time</p>
        )}
        {/* would be cool to have these clocks match the hour the user selects, that a project for the future though */}
        <ClockHour5 class="ml-auto text-gray-500 group-hover:text-gray-600 transition" />
      </div>
      {open && <Picker />}
    </div>
  );

  function Picker() {
    const timeRef = useRef<HTMLDivElement>(null);
    useClickAway([timeRef, timeInputRef], () => setOpen(false));

    return (
      <div
        class="absolute left-1 right-1 z-10 top-14 bg-white font-medium border border-gray-300 rounded-md px-2 py-2 shadow-xl cursor-default select-none max-w-xs flex"
        ref={timeRef}
      >
        {/* could probably consolidate this into a component */}
        <div className=" h-[18rem] overflow-y-scroll gap-2 scrollbar-fancy flex flex-col px-2">
          {hrs.map((h) => (
            <div
              className={`w-10 min-h-[2.5rem] rounded grid place-items-center hover:text-gray-700 cursor-pointer text-gray-600 transition ${
                time && (time.getHours() % 12 || 12) == h
                  ? "border-2 border-gray-300 hover:bg-gray-50"
                  : "hover:bg-gray-200"
              }`}
              onClick={() => changeTime({ hour: h })}
            >
              {h}
            </div>
          ))}
        </div>
        <div className=" h-[18rem] overflow-y-scroll gap-2 scrollbar-fancy flex flex-col px-2 mx-4">
          {mins.map((h) => (
            <div
              className={`w-10 min-h-[2.5rem] rounded grid place-items-center hover:text-gray-700 cursor-pointer text-gray-600 transition ${
                time && time.getMinutes() == h
                  ? "border-2 border-gray-300 hover:bg-gray-50"
                  : "hover:bg-gray-200"
              }`}
              onClick={() => changeTime({ minutes: h })}
            >
              {h}
            </div>
          ))}
        </div>
        <div className=" h-[18rem] overflow-y-scroll gap-2 scrollbar-fancy flex flex-col">
          {meridiems.map((h) => (
            <div
              className={`w-10 min-h-[2.5rem] rounded grid place-items-center hover:text-gray-700 cursor-pointer text-gray-600 transition uppercase ${
                time &&
                (time.getHours() > 12
                  ? h.id == Meridiem.POST
                  : h.id == Meridiem.ANTE)
                  ? "border-2 border-gray-300 hover:bg-gray-50"
                  : "hover:bg-gray-200"
              }`}
              onClick={() => changeTime({ meridiem: h.id })}
            >
              {h.name}
            </div>
          ))}
        </div>
        <p
          class={`text-xs text-right mr-1 transition mt-auto ml-auto ${
            time
              ? "text-gray-400 hover:text-gray-600 cursor-pointer"
              : "text-gray-200"
          }`}
          onClick={() => changeTime(undefined)}
        >
          Clear
        </p>
      </div>
    );
  }
}

enum Meridiem {
  ANTE = 0,
  POST = 1,
}
