import { EventRegisterError } from "@/utils/event/register.ts";
import CTA from "@/components/buttons/cta.tsx";

export const RegisterErrors = ({ code }: { code: EventRegisterError }) => {
  switch (code) {
    case EventRegisterError.OTHER:
      return null;

    case EventRegisterError.TO_HOMEPAGE:
      return (
        <a href="/">
          <CTA btnType="secondary" btnSize="xs">
            Homepage
          </CTA>
        </a>
      );
    case EventRegisterError.RELOAD:
      return (
        <a href="">
          <CTA btnType="secondary" btnSize="xs">
            Reload
          </CTA>
        </a>
      );
    case EventRegisterError.PREVIOUSLY_LOGGED_IN:
      return (
        <>
          <p class="text-center text-sm text-gray-700 mb-2 max-w-md">
            In order to protect your account, when you log in once we don't
            allow you to register for an event without logging in again.
          </p>
          <a href="/login?attending=true">
            <CTA btnType="secondary" btnSize="xs">
              Log In
            </CTA>
          </a>
        </>
      );
    case EventRegisterError.PURCHASED:
      return (
        <a href="/events/attending">
          <CTA btnType="secondary" btnSize="xs">
            See Tickets
          </CTA>
        </a>
      );
    case EventRegisterError.PURCHASED_NOT_LOGGED_IN:
      return (
        <a href="/login?attending=true">
          <CTA btnType="secondary" btnSize="xs">
            Log In to View Tickets
          </CTA>
        </a>
      );
  }
  return null;
};
