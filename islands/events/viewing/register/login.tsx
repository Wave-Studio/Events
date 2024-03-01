import Minus from "$tabler/minus.tsx";
import Plus from "$tabler/plus.tsx";
import Button from "@/components/buttons/button.tsx";
import ChevronLeft from "$tabler/chevron-left.tsx";
import Loading from "$tabler/loader-2.tsx";
import { ShowTime } from "@/utils/db/kv.types.ts";
import { RegisterErrors } from "@/islands/events/components/registerErrors.tsx";
import CTA from "@/components/buttons/cta.tsx";
import { Signal } from "@preact/signals";
import { EventRegisterError } from "@/utils/event/register.ts";

const Login = ({
  showTimes,
  showTime,
  tickets,
  ticketID,
}: {
  showTimes: Partial<ShowTime>[];
  showTime: Signal<string | undefined>;
  tickets: Signal<number>;
  ticketID: Signal<string | undefined>;
}) => (
  <>
    <div class="flex justify-between mt-4 items-center">
      
    </div>
    {error.value && (
      <div class="flex flex-col items-center">
        <p class="text-center text-red-500 text-sm mb-2">
          {error.value.message}
        </p>
        <RegisterErrors code={error.value.code} />
      </div>
    )}
  </>
);

export default Login;
