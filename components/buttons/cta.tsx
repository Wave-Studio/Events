import { ComponentChildren, JSX } from "preact";

const CTA = (
  { children, btnType}: {
    children: ComponentChildren;
    btnType: "cta" | "secondary";
    
  },
) => {
  return (
    <>
      <button
        className={`w-72 rounded-md h-12 font-semibold text-lg peer z-10 hover:brightness-95 transition focus:ring ${
          btnType == "cta"
            ? "bg-[#DC6843] ring-[#da7351] text-white"
            : "bg-gray-300 ring-gray-400/50 text-gray-800"
        }`}
      >
        {children}
      </button>
    </>
  );
};

export default CTA;
