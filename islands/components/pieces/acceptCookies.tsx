import CTA from "@/components/buttons/cta.tsx";
import Deletion from "@/islands/events/components/delete.tsx";
import { useSignal } from "@preact/signals";

const Cookies = () => {
  const open = useSignal(false);

  return (
    <div class="absolute z-50 bottom-4 right-4 bg-white shadow-lg rounded-md p-4">
			Test
		</div>
  );
};

export default Cookies;
