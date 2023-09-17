import CTA from "@/components/buttons/cta.tsx";
import { useMemo, useRef, useState } from "preact/hooks";
import { JSX } from "preact/jsx-runtime";
import { checkCode, genCode } from "@/utils/db/auth.ts";

const LoginForm = ({attending}: {attending: boolean}) => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string>();
  const [stage, setStage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [updateState, setUpdateState] = useState(false);

  const codeRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);

  const sendEmail = async (e: JSX.TargetedEvent<HTMLFormElement, Event>) => {
    e.stopImmediatePropagation();
    e.preventDefault();
    setError(undefined);
    const passed =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        .test(email);
    if (!passed) {
      setError("Enter a valid email");
      return;
    }
    if (email == "rick@example.com") {
      setError("🤨");
      return;
    }
    setError(undefined);
    setLoading(true);

    const code = await genCode(email);

    setLoading(false);

    if (code.error) {
      setError(code.error);
      return;
    }

    alert("yeur logn code: " + code.otp);

    setStage(1);
    if (codeRef.current) {
      setTimeout(() => {
        codeRef.current!.focus();
        setFocused(true);
      }, 300);
    }
  };

  const login = async (e: JSX.TargetedEvent<HTMLFormElement, Event>) => {
    e.preventDefault();
    setError(undefined);
    setLoading(true);

    const response = await checkCode(email, code);
    
    setLoading(false);
    
    if (response.error || !response.success) {
      setError(response.error!);
      return;
    }
    window.location.href = `/dashboard${attending ? "?attending=true" : ""}`
  };

  const differentEmail = () => {
    setError(undefined);
    setEmail("");
    setCode("");
    setStage(0);
  };

  const updateCode = (code: string) => {
    code = code.replace(/[^0-9]/g, "");
    setCode(code.slice(0, 6));
    setUpdateState((u) => !u);
  };

  return (
    <div className="w-[18.5rem] overflow-hidden p-1">
      {/* damn were going jank already */}
      <div
        className={`flex ${
          stage == 1 ? "translate-x-[-18.25rem]" : ""
        } transition duration-300`}
      >
        {/* email input */}
        <form
          class={`mt-10 ${
            stage == 1 && "opacity-0 -translate-x-14"
          } transition duration-150`}
          onSubmit={sendEmail}
          noValidate
        >
          <label htmlFor="email" class="flex flex-col">
            <span class="text-sm font-medium">email</span>
            <input
              autofocus
              type="email"
              placeholder="rick@example.com"
              class="p-2 border rounded-md border-gray-300"
              name="email"
              value={email}
              onChange={(e) =>
                //@ts-expect-error deno moment
                setEmail(e.target!.value)}
            />
          </label>
          <p className={`mb-2 text-sm text-red-500 ${!error && "invisible"} `}>
            Error: {error}
          </p>
          <CTA btnType="cta">confirm email</CTA>
        </form>
        {/* login code input */}
        <div class="ml-1">
          <p class="mt-2 mb-8 w-72 text-center">
            We just emailed you a login code! Please enter it below.
          </p>
          <form onSubmit={login} noValidate>
            <label class="flex flex-col">
              <span class="text-sm font-medium">code</span>
              <div className="grid grid-cols-6 gap-3 w-72 cursor-text">
                {[...new Array(6)].map((_, i) => {
                  const selected = code.length == i;
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
              <div class="h-0 overflow-hidden">
                <input
                  type="number"
                  class={`p-2 -translate-y-10 w-72 `}
                  name="code"
                  autoComplete="off"
                  id="test"
                  pattern="[0-9]*"
                  value={code}
                  onInput={(e) =>
                    //@ts-expect-error deno moment (e has incorrect types and idk what the correct types are)
                    updateCode(e.target!.value)}
                  ref={codeRef}
                  onBlur={() => setFocused(false)}
                  onFocus={() => setFocused(true)}
                />
                {updateState ? "s" : "t"}
              </div>
            </label>
            <p
              className={`mb-2 text-sm text-red-500 ${!error && "invisible"} `}
            >
              Error: {error}
            </p>
            <CTA btnType="cta" disabled={code.length != 6}>
              login
            </CTA>
          </form>
          <p
            className="mt-2 text-center underline text-sm cursor-pointer"
            onClick={differentEmail}
          >
            different email
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
