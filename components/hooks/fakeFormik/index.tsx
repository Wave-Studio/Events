import { Signal, signal } from "@preact/signals";
import { useState } from "preact/hooks";
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

interface FormProps extends JSX.HTMLAttributes<HTMLFormElement> {
  children: ComponentChild;
}

interface HTMLInputProps extends JSX.HTMLAttributes<HTMLInputElement> {
  name: string;
}

interface HTMLTextAreaProps extends JSX.HTMLAttributes<HTMLTextAreaElement> {
  name: string;
}

function useForm<T>({
  validationSchema,
  initialState,
  onSubmit,
}: {
  validationSchema: Yup.ObjectSchema<Record<string, unknown>>;
  initialState: T;
  onSubmit: ({
    success,
    error,
    formState,
  }: {
    success: boolean;
    error?: Error;
    formState?: T;
  }) => void;
}): [
  (props: FormProps) => JSX.Element,
  [
    (props: HTMLInputProps) => JSX.Element,
    (props: HTMLTextAreaProps) => JSX.Element,
  ],
  () => T,
] {
  const formState = signal<T>(initialState);

  const onSubmitHandler: JSX.GenericEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    try {
      validationSchema.validateSync(formState.value);
    } catch (error) {
      onSubmit({
        success: false,
        error,
      });
      return;
    }

    onSubmit({
      success: true,
      formState: formState.value,
    });
  };

  return [
    (props: FormProps) => {
      return (
        <form {...props} onSubmit={onSubmitHandler}>
          {props.children}
        </form>
      );
    },
    [
      (props: HTMLInputProps) => {
        return (
          <input
            {...(props as HTMLInputProps)}
            type={props.type ?? "text"}
            value={formState.value[props.name as keyof T] as string}
            onInput={(e) => {
              formState.value[props.name as keyof T] = e.currentTarget
                .value as T[keyof T];
            }}
          />
        );
      },
      (props: HTMLTextAreaProps) => {
        return (
          <textarea
            {...(props as HTMLTextAreaProps)}
            value={formState.value[props.name as keyof T] as string}
            onInput={(e) => {
              formState.value[props.name as keyof T] = e.currentTarget
                .value as T[keyof T];
            }}
          />
        );
      },
    ],
    () => formState.value,
  ];
}

export default useForm;
