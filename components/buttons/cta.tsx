import { ComponentChildren } from "preact";

const CTA = ({ children }: { children: ComponentChildren }) => {
  return (
    <button className="w-72 bg-[#DC6843] rounded-md h-12 text-white font-semibold text-lg ">
      {children}
    </button>
  );
};

export default CTA;
