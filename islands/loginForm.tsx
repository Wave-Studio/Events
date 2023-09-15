import CTA from "@/components/buttons/cta.tsx";
import { useState } from "preact/hooks";
import { JSX } from "preact/jsx-runtime";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState<number>();
  const [error, setError] = useState<string>();
  const [stage, setStage] = useState(0);

  const sendEmail = (e: JSX.TargetedEvent<HTMLFormElement, Event>) => {
		e.stopImmediatePropagation()
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
		setError(undefined)
		setEmail("")
		setCode(undefined)
		setStage(0)
		

	}

  return (
    <div className="w-[18.5rem] overflow-hidden p-1">
			{/* damn were going jank already */}
      <div className={`flex ${stage == 1 ? "-translate-x-[18.25rem]" : ""} transition duration-300 ease-in-out`}>
        <form class={`mt-10 ${stage == 1 && "opacity-0 -translate-x-14"} transition duration-150`} onSubmit={sendEmail} noValidate>
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
        <div class="ml-1">
          <p class="mt-2 mb-8 w-72 text-center">
            We just emailed you a login code! Please enter it below
          </p>
          <form onSubmit={login} noValidate>
            <label htmlFor="email" class="flex flex-col">
              <span class="text-sm font-medium">code</span>
              <input
                autofocus
                type="number"
                class="p-2 border rounded-md border-gray-300"
                name="code"
                value={code}
                onChange={(e) =>
                  //@ts-expect-error deno moment
                  setCode(e.target!.value)}
              />
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
					<p className="mt-2 text-center underline text-sm" onClick={differentEmail}>different email</p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
