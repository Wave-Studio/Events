import { ComponentChildren, JSX } from "preact";

interface CTATypes extends JSX.HTMLAttributes<HTMLButtonElement> {
  children: ComponentChildren;
  btnType: "cta" | "secondary";
  btnSize?: "norm" | "sm";
}

const CTA = ({
  children,
  btnType,
  btnSize = "norm",
  className,
  ...props
}: CTATypes) => {
  return (
    <>
      <button
        className={`${className} ${
          btnSize == "norm"
            ? "w-64 [@media(min-width:300px)]:w-72 h-12 text-lg "
            : "w-40 h-10"
        } rounded-md font-semibold peer z-10 hover:brightness-95 transition focus:ring-1 focus:brightness-100 disabled:brightness-90 disabled:cursor-not-allowed ${
          btnType == "cta"
            ? "bg-theme-normal ring-[#da7351] text-white "
            : "bg-gray-300 ring-gray-400/50 text-gray-800"
        }`}
        {...props}
      >
        {children}
      </button>
    </>
  );
};

export default CTA;
