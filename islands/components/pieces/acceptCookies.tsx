import CTA from "@/components/buttons/cta.tsx";
import Deletion from "@/islands/events/components/delete.tsx";
import { useSignal } from "@preact/signals";

const Cookies = () => {
  const accepted = useSignal(false);

  if (!accepted.value) {
    return (
      <div class="fixed z-50 bottom-4 right-4 bg-gray-100 shadow-xl rounded-md p-4 ml-4 flex flex-col">
        <h2 class="font-semibold">This Website Uses Cookies</h2>
        <p class="text-sm">
          Visit the{" "}
          <a class="underline font-medium" href="/privacy-policy">
            privacy policy
          </a>{" "}
          to learn more
        </p>
        <CTA
          btnType="secondary"
          btnSize="xs"
          className="ml-auto mt-2"
          onClick={() => {
            accepted.value = true;
            document.cookie =
              "accepted-privacy=true; expires=Thu, 18 Dec 2049 12:00:00 UTC; path=/";
          }}
        >
          Got it!
        </CTA>
      </div>
    );
  }

	return null;
};

export default Cookies;
