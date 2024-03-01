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
import LoginForm from "@/islands/loginForm.tsx";

const Login = ({
  showTimes,
  showTime,
  tickets,
  ticketID,
  createTicket,
  email,
  error,
}: {
  showTimes: Partial<ShowTime>[];
  showTime: Signal<string | undefined>;
  tickets: Signal<number>;
  ticketID: Signal<string | undefined>;
  error: Signal<{ message: string; code: EventRegisterError } | undefined>;
  email: string;
  createTicket: () => void;
}) => (
  <>
    <div class="flex my-4 items-center justify-center">
      <LoginForm
        attending={false}
        emailInputted={email}
        createTicket={createTicket}
      />
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
