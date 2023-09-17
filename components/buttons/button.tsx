import { ComponentChildren } from "preact";

const Button = ({ children }: { children: ComponentChildren }) => {
  return (
    <>
      <div>
        <button className="w-72 rounded-md h-12 font-semibold text-lg peer z-10">
          {children}
        </button>
        <div className="z-0 absolute w-72 h-12 peer-hover:translate-x-1 peer-hover:translate-y-1 bg-red-500 mx-auto transition-all rounded-md" />
      </div>
    </>
  );
};

export default Button;
