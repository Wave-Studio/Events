import { useEffect, Ref } from "preact/hooks";

const useClickAway = (ref: Ref<HTMLDivElement>, callback: () => void) => {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
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
