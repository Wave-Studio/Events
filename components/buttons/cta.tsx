import { ComponentChildren, JSX } from "preact";

interface CTATypes extends JSX.HTMLAttributes<HTMLButtonElement> {
	children: ComponentChildren;
	btnType: "cta" | "secondary";
	btnSize?: "norm" | "sm" | "xs";
}

const CTA = ({
	children,
	btnType,
	type = "button",
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
						: btnSize == "sm"
							? "w-40 h-10"
							: "px-2 h-8"
				} rounded-md font-semibold peer z-10 hover:brightness-95 transition hover:focus:ring-1 hover:focus:brightness-100 disabled:brightness-90 disabled:cursor-not-allowed ${
					btnType == "cta"
						? "bg-theme-normal ring-[#da7351] text-white "
						: "bg-gray-300 ring-gray-400/50 text-gray-800"
				}`}
				type={type}
				{...props}
			>
				{children}
			</button>
		</>
	);
};

export default CTA;
