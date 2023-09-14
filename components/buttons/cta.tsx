import { ComponentChildren } from "preact";

const CTA = ({ children }: { children: ComponentChildren }) => {
  return (
    <>
    <button className="w-72 bg-[#DC6843] rounded-md h-12 text-white font-semibold text-lg peer z-10">
      {children}
      
    </button>
    <div className="z-0 absolute w-72 h-12 peer-hover:h-[3.1rem] peer-hover:w-[18.1rem] bg-red-500 mx-auto transition-all rounded-md">

    </div>
    </>
  );
};

export default CTA;
