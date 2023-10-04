import { ComponentChildren } from "preact";
import CTA from "@/components/buttons/cta.tsx";

const Button = ({ label, icon, href }: { label: string; icon: ComponentChildren; href: string }) => {
  return (
    <>
      <div className="relative flex flex-col items-end md:items-center">
        <a href={href} class="peer">
          <CTA
            btnType="secondary"
            btnSize="sm"
            className="!w-10 grid place-items-center "
          >
            {icon}
          </CTA>
        </a>
        <div className="absolute w-32 bg-white border border-gray-300 rounded-md text-center shadow-xl top-12 select-none scale-95 opacity-0 peer-hover:scale-100 peer-hover:opacity-100 transition">
          {label}
        </div>
      </div>
    </>
  );
};

export default Button;
