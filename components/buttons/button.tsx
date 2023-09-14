import { ComponentChildren } from "preact";

const Button = ({ children }: { children: ComponentChildren }) => {
  return (
    <button className="w-72 bg-gray-300 rounded-md h-12 text-gray-800 font-semibold text-lg ">
      {children}
    </button>
  );
};

export default Button;
