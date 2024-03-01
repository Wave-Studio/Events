import CTA from "@/components/buttons/cta.tsx";
import { useEffect, useRef, useState } from "preact/hooks";
import { JSX } from "preact/jsx-runtime";
import { checkCode, genCode } from "@/utils/db/auth.ts";
import { useSignal } from "@preact/signals";
import { Loading } from "@/utils/loading.ts";
import IconLoader2 from "$tabler/loader-2.tsx";

// This page is a mess but it works so it's not worth fixing rn
const LoginForm = ({
  attending,
  emailInputted,
  createTicket,
}: {
  attending: boolean;
  emailInputted?: string;
  createTicket?: () => void;
}) => {
  const email = useSignal("");
  const code = useSignal("");
  const [error, setError] = useState<string>();
  const stage = useSignal(emailInputted ? 1 : 0);
  const loading = useSignal(false);
  const [updateState, setUpdateState] = useState(false);

  const codeRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const onFocus = async () => {
      if (stage.value != 1 || loading.value) return;
      const clipboard = await navigator.clipboard.readText();
      if (code.value.length != 0 || !/^[0-9]{6}$/g.test(clipboard)) return;
      login(undefined, clipboard);
    };
    globalThis.addEventListener("focus", onFocus);
    return () => {
      globalThis.removeEventListener("focus", onFocus);
    };
  }, []);

  const sendEmail = async (e?: JSX.TargetedEvent<HTMLFormElement, Event>) => {
    if (e) {
      e.stopImmediatePropagation();
      e.preventDefault();
    } else {
      email.value = emailInputted!;
    }

    setError(undefined);
    const passed =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        .test(
          email.value,
        );
    if (!passed) {
      setError("Enter a valid email");
      return;
    }
    if (email.value === "rick@example.com") {
      setError("🤨");
      return;
    }
    setError(undefined);
    loading.value = true;

    const res = await genCode(email.value);

    loading.value = false;

    if (res.error) {
      setError(res.error);
      return;
    }

    stage.value = 1;
    if (codeRef.current) {
      setTimeout(() => {
        codeRef.current!.focus();
        setFocused(true);
      }, 300);
    }
  };

  useEffect(() => {
    if (emailInputted) {
      sendEmail();
    }
  }, [emailInputted]);

  const login = async (
    e?: JSX.TargetedEvent<HTMLFormElement, Event>,
    clipboard?: string,
  ) => {
    if (e) e.preventDefault();
    setError(undefined);
    loading.value = true;
    stage.value = 2;

    const response = await checkCode(email.value, clipboard || code.value);

    if (response.error || !response.success) {
      setError(response.error!);
      loading.value = false;
      stage.value = 1;
      return;
    }

    if (!emailInputted) {
      setTimeout(() => {
        window.location.href = `/events/${
          attending ? "attending" : "organizing"
        }`;
      }, 300);
    } else {
      createTicket!();
    }
  };

  const differentEmail = () => {
    setError(undefined);
    email.value = "";
    code.value = "";
    stage.value = 0;
  };

  const updateCode = (newCode: string) => {
    newCode = newCode.replace(/[^0-9]/g, "");
    code.value = newCode.slice(0, 6);
    setUpdateState((u) => !u);
  };

  return (
    <div className="w-[16.5rem] [@media(min-width:300px)]:w-[18.5rem] overflow-hidden p-1 relative">
      {/* damn we're going jank already */}
      <div
        className={`flex ${
          stage.value > 0
            ? "translate-x-[-16.25rem] [@media(min-width:300px)]:translate-x-[-18.25rem]"
            : ""
        } transition duration-300`}
      >
        {/* email input */}
        <form
          class={`mt-10 ${
            stage.value > 0 && "opacity-0 -translate-x-14"
          } transition duration-150`}
          onSubmit={sendEmail}
          noValidate
        >
          <label htmlFor="email" class="flex flex-col">
            <span class="text-sm font-medium">Email</span>
            <input
              autofocus
              type="email"
              placeholder="rick@example.com"
              name="email"
              value={email}
              onChange={(e) => (email.value = e.currentTarget.value)}
            />
          </label>
          <p className={`mb-2 text-sm text-red-500 ${!error && "invisible"} `}>
            Error: {error}
          </p>
          <CTA btnType="cta" type="submit" disabled={loading}>
            Confirm Email
          </CTA>
          <p className="mt-2 text-center text-sm cursor-pointer text-gray-500">
            By clicking "Confirm Email", you consent to us sending you a
            one-time authentication code via email.
          </p>
        </form>
        {/* login code input */}
        <div class="ml-1">
          <p class="mt-2 mb-8 w-64 [@media(min-width:300px)]:w-72 text-center">
            {emailInputted ? "To verify that you're you, please enter the code we emailed you below" : "We just emailed you a login code! Please enter it below."}
          </p>
          <form onSubmit={login} noValidate>
            <label class="flex flex-col">
              <span class="text-sm font-medium">code</span>
              <div className="grid grid-cols-6 gap-3 w-64 [@media(min-width:300px)]:w-72  cursor-text">
                {[...new Array(6)].map((_, i) => {
                  const selected = code.value.length == i;
                  return (
                    <div
                      class={`border-b-2 relative ${
                        selected && focused
                          ? "border-gray-400"
                          : "border-gray-300"
                      }  w-full h-8 grid place-items-center text-xl font-medium`}
                    >
                      {code && code.toString().split("")[i]}
                      {selected && focused && (
                        <div
                          className={`absolute h-6 border-l w-2 border-gray-600 left-1 cursor-blink`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
              {/* invis input class so you can paste into the input */}
              <div class="absolute">
                <input
                  type="number"
                  class={`p-2 w-64 [@media(min-width:300px)]:w-72 translate-y-3 hideInput`}
                  name="code"
                  autoComplete="off"
                  id="test"
                  pattern="[0-9]*"
                  value={code.value}
                  onInput={(e) =>
                    updateCode(e.currentTarget.value.replace(/e/gi, ""))}
                  ref={codeRef}
                  onBlur={() => setFocused(false)}
                  onFocus={() => setFocused(true)}
                />
                <span class="hidden">{updateState ? "s" : "t"}</span>
              </div>
            </label>
            <p
              className={`mb-2 text-sm text-red-500 ${!error && "invisible"} `}
            >
              Error: {error}
            </p>
            <CTA
              btnType="cta"
              disabled={code.value.length != 6 || loading}
              type="submit"
            >
              Login
            </CTA>
          </form>
          <p
            className="mt-2 text-center underline text-sm cursor-pointer"
            onClick={differentEmail}
          >
            Enter a Different Email
          </p>
        </div>
      </div>

      {stage.value === 2 && (
        <div class="absolute inset-0 bg-white/20 backdrop-blur-md flex items-center justify-center">
          <IconLoader2 class="size-6 animate-spin" />{" "}
          <h3 class="font-medium ml-2">Logging In</h3>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
