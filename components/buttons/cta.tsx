import { ComponentChildren, JSX } from "preact";

const CTA = (
  { children, btnType, disabled, size = "norm", className }: {
    children: ComponentChildren;
    btnType: "cta" | "secondary";
    disabled?: boolean;
    size?: "norm" | "sm";
    className?: string;
  },
) => {
  return (
    <>
      <button
        className={`${className} ${
          size == "norm"
            ? "w-64 [@media(min-width:300px)]:w-72 h-12 text-lg "
            : "w-40 h-10"
        } rounded-md font-semibold peer z-10 hover:brightness-95 transition focus:ring-1 focus:brightness-100 disabled:brightness-90 disabled:cursor-not-allowed ${
          btnType == "cta"
            ? "bg-theme-normal ring-[#da7351] text-white"
            : "bg-gray-300 ring-gray-400/50 text-gray-800"
        }`}
        disabled={disabled}
      >
        {children}
      </button>
    </>
  );
};

export default CTA;
