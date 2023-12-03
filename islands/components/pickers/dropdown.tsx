import { ComponentChild } from "preact";
import useClickAway from "@/components/hooks/onClickAway.tsx";
import { useRef } from "preact/hooks";
import { useSignal } from "@preact/signals";

export default function Dropdown({
  options,
  children,
  className
}: {
  options: {
    content: ComponentChild;
    onClick?: () => void;
  }[];
  children: ComponentChild;
  className?: string
}) {
  const open = useSignal(false);
  const dropdown = useRef<HTMLDivElement>(null);
  useClickAway([dropdown], () => {
    open.value = false;
  });
  return (
    <>
      <div className={`${className} relative flex flex-col items-end`} ref={dropdown}>
        <button onClick={() => (open.value = !open.value)}>{children}</button>
        <div
          className={`${
            open.value ? "block" : "hidden"
          } absolute p-2 bg-white border rounded-md shadow-xl top-10 select-none transition z-50 grow`}
        >
          {options.map((option) => {
            return (
              <button
                onClick={() => {
                  open.value = false;
                  option.onClick && option.onClick();
                }}
                class="min-w-max hover:bg-gray-200 px-2 py-1 font-medium rounded-md w-full text-left focus:outline-none"
              >
                {option.content}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
