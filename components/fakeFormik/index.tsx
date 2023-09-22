import { Signal, signal } from "@preact/signals";
import { JSX } from "preact";

type Json =
  | null
  | string
  | number
  | boolean
  | Array<JSON>
  | {
      [prop: string]: Json;
    };

const useForm = <
  Key extends PropertyKey,
  Value extends Json,
  T extends Record<Key, Value>
>({
  initialState,
  onSubmit,
}: {
  initialState: T;
  onSubmit: (values: typeof initialState) => void;
}) => {
	const formState = signal(initialState)

	interface FieldProps extends JSX.HTMLAttributes<HTMLInputElement> {
		name: string
	}

	const Field = (props: FieldProps) =>  (<input {...props} onInput={(e) => formState.value[props.name] = e.currentTarget.value} />)

	const submitForm = () => onSubmit(formState.value)

	return [Field, formState, submitForm]
};

export default useForm;
