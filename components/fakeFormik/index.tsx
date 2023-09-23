import { Signal, signal } from "@preact/signals";
import { ComponentChild, JSX } from "preact";
import * as Yup from "yup";

type Json =
  | null
  | string
  | number
  | boolean
  | Array<JSON>
  | {
      [prop: string]: Json;
    };

// const useOldForm = <
//   Key extends PropertyKey,
//   Value extends Json,
//   T extends Record<Key, Value>
// >({
//   initialState,
//   onSubmit,
// }: {
//   initialState: T;
//   onSubmit: (values: typeof initialState) => void;
// }) => {
// 	const formState = signal(initialState)

// 	interface FieldProps extends JSX.HTMLAttributes<HTMLInputElement> {
// 		name: string
// 	}

// 	const Field = (props: FieldProps) =>  (<input {...props} onInput={(e) => formState.value[props.name] = e.currentTarget.value} />)

// 	const submitForm = () => onSubmit(formState.value)

// 	return [Field, formState, submitForm]
// };

// const ueForm = <T extends Record<string, unknown>>({
//   initialState,
//   onSubmit,
// }: {
//   initialState: T;
//   onSubmit: (values: T) => void;
//   validationSchema: Yup.ObjectSchema<T>;
// }): [
//   ({ name, type }: { name: string; type?: string }) => ComponentChild,
//   T,
//   () => void
// ] => {
//   const [formState, setFormState] = useState(initialState);

//   interface FieldProps extends JSX.HTMLAttributes<HTMLInputElement> {
//     name: keyof T;
//   }

//   return [
//     ({ name, type }: { name: string; type?: string }) => (
//       <input
//         type={type ?? "text"}
//         value={formState[name as keyof T] as string}
//         onChange={(e) =>
//           setFormState({
//             ...formState,
//             [name]: e.currentTarget.value,
//           })
//         }
//       />
//     ),
//     formState,
//     () => onSubmit(formState),
//   ];
// };

interface FieldProps extends JSX.HTMLAttributes<HTMLInputElement> {
  name: string;
}

interface FormProps extends JSX.HTMLAttributes<HTMLFormElement> {
  children: ComponentChild;
}

function useForm<T = Record<string, unknown>>({
  initialState,
  onSubmit,
  validationSchema,
}: {
  initialState: T;
  onSubmit: (values: T) => void;
  validationSchema: Yup.ObjectSchema<Record<string, unknown>>;
}): [
  (props: FieldProps) => JSX.Element,
  (props: FormProps) => JSX.Element,
  Signal<T>,
  () => void
] {
  const formState = signal(initialState);

  return [
    (props: FieldProps) =>
      props.as == "textarea" ? (
        // @ts-expect-error Types my beloved
        <textarea
          {...props}
          value={formState.value[props.name as keyof T] as string}
          onInput={(e) =>
            // @ts-expect-error Types my beloved
            (formState.value[props.name as string] = e.currentTarget.value)
          }
        ></textarea>
      ) : (
        <input
          {...props}
          value={formState.value[props.name as keyof T] as string}
          onInput={(e) =>
            // @ts-expect-error Types my beloved
            (formState.value[props.name as string] = e.currentTarget.value)
          }
          type={props.type ?? "text"}
        />
      ),
    (props: FormProps) => (
      <form
        {...props}
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(formState.value);
        }}
        noValidate={true}
      >
        {props.children}
      </form>
    ),
    formState,
    () => onSubmit(formState.value),
  ];
}

export default useForm;
