import CTA from "@/components/buttons/cta.tsx";
import { useState } from "preact/hooks";
import { JSX } from "preact/jsx-runtime";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string>();
  const [stage, setStage] = useState(1);
  const [updateState, setUpdateState] = useState(false);

  const sendEmail = (e: JSX.TargetedEvent<HTMLFormElement, Event>) => {
    e.stopImmediatePropagation();
    e.preventDefault();
    const passed = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email);
    if (!passed) {
      setError("Enter a valid email");
      return;
    }
    if (email == "rick@example.com") {
      setError("🤨");
      return;
    }
    setError(undefined);
    // send code to email here
    setStage(1);
  };

  const login = (e: JSX.TargetedEvent<HTMLFormElement, Event>) => {
    e.preventDefault();
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
          stage == 1 ? "-translate-x-[18.25rem]" : ""
        } transition duration-300 ease-in-out`}
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
          <CTA btnType="cta">
            confirm email
          </CTA>
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
                {[...new Array(6)].map((_, i) => (
                  <div class=" border-b-2 border-gray-300 w-full h-8 grid place-items-center text-xl font-medium">
                    {code && code.toString().split("")[i]}
                  </div>
                ))}
              </div>
              <div class="h-0 overflow-hidden">
                <input
                  autofocus
                  type="text"
                  class="p-2 -translate-y-10 w-72"
                  name="code"
                  autoComplete="off"
                  value={code}
                  onInput={(e) =>
                    //@ts-expect-error deno moment
                    updateCode(e.target!.value)}
                />
                {
                  /* This is so unbelivably jank
              I hate preact
              why isn't fresh based off core react
              ughhhhhhhh */
                }
                {updateState ? "s" : "t"}
              </div>
            </label>
            <p
              className={`mb-2 text-sm text-red-500 ${!error && "invisible"} `}
            >
              Error: {error}
            </p>
            <CTA btnType="cta">
              login
            </CTA>
          </form>
          <p
            className="mt-2 text-center underline text-sm"
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
