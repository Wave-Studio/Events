import Trash from "$tabler/trash.tsx";
import { JSX } from "preact";

export const Trashcan = ({
  className,
  ...props
}: JSX.HTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className={`${className} rounded-md border border-red-300 font-medium text-red-500 grid place-items-center size-6 bg-red-100`}
      {...props}
    >
      <Trash class="size-4" />
    </button>
  );
};
