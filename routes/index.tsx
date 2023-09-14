import { useSignal } from "@preact/signals";
import CTA from "../components/buttons/cta.tsx";
import Button from "../components/buttons/button.tsx";

export default function Home() {
  const count = useSignal(3);
  return (
    <>
      <div class="flex flex-col px-2 items-center">
        <h1 class="text-center text-4xl font-bold -mt-4">reservations</h1>
        <div class="w-44 flex items-center mt-2">
          <div class="grow bg-gray-200 h-0.5 rounded-full" />
          <p class="w-max mx-1.5 leading-3">made simple</p>
          <div class="grow bg-gray-200 h-0.5 rounded-full" />
        </div>
      </div>
      <div className="my-auto mx-auto flex flex-col gap-4">
        <CTA>
          i'm organizing
        </CTA>
        <Button>
          i'm attending
        </Button>
      </div>
    </>
  );
}
