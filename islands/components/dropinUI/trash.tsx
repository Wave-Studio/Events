import Trash from "$tabler/trash.tsx";
import { JSX } from "preact";

export const Trashcan = ({
  className,
  ...props
}: JSX.HTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className={`${className} rounded-md border border-red-300 font-medium text-red-500 grid place-items-center w-6 h-6 bg-red-100`}
      {...props}
    >
      <Trash class="w-4 h-4" />
    </button>
  );
};
