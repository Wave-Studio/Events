import { Ref, useEffect } from "preact/hooks";

const useClickAway = (ref: Ref<HTMLElement>[], callback: () => void) => {
	useEffect(() => {
		const handleClick = (e: MouseEvent) => {
			let shouldClose = true;
			for (const r of ref) {
				if (r.current && r.current.contains(e.target as Node)) {
					shouldClose = false;
				}
			}
			if (shouldClose) {
				callback();
			}
		};

		addEventListener("mousedown", handleClick);

		return () => {
			removeEventListener("mousedown", handleClick);
		};
	}, []);
};

export default useClickAway;
