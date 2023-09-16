import { ComponentChildren, JSX } from "preact";

const CTA = (
  { children, btnType, disabled, size = "norm"}: {
    children: ComponentChildren;
    btnType: "cta" | "secondary";
    disabled?: boolean
    size?: "norm" | "sm"
    
  },
) => {
  return (
    <>
      <button
        className={`${size == "norm" ? "w-64 [@media(min-width:300px)]:w-72 h-12 text-lg " : "w-40 h-10"} rounded-md font-semibold peer z-10 hover:brightness-95 transition focus:ring focus:brightness-100 disabled:brightness-90 disabled:cursor-not-allowed ${
          btnType == "cta"
            ? "bg-[#DC6843] ring-[#da7351] text-white"
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
