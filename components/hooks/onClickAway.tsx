import { useEffect, Ref } from "preact/hooks";

const useClickAway = (ref: Ref<HTMLDivElement>, callback: () => void) => {
  const handleClick = (e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
			console.log(e.target)
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClick, {capture: true});

    return () => {
      document.removeEventListener("click", handleClick, {capture: true});
    };
  });
};

export default useClickAway;