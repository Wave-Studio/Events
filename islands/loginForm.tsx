import CTA from "@/components/buttons/cta.tsx";
import { useState } from "preact/hooks";
import { JSX } from "preact/jsx-runtime";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState();

  const submitForm = (e: JSX.TargetedEvent<HTMLFormElement, Event>) => {
    e.preventDefault();
    e.currentTarget.noValidate = true;
  };

  return (
    <form class="mt-10" onSubmit={submitForm}>
      <label htmlFor="email" class="flex flex-col">
        <span class="text-sm font-medium">email</span>
        <input
          type="email"
          placeholder="rick@example.com"
          class="p-2 border rounded-md border-gray-300"
          name="email"
          noValidate={true}
          value={email}
          onChange={(e) =>
            //@ts-expect-error deno moment
            setEmail(e.target!.value)}
        />
      </label>
      <p className={`mb-4 text-sm text-red-500 `}>Error:</p>
      <CTA btnType="cta">
        confirm email
      </CTA>
    </form>
  );
};

export default LoginForm;
