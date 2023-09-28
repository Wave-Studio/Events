import { Signal } from "@preact/signals";
import { Event, Field } from "@/utils/db/kv.ts";
import useForm from "@/components/hooks/fakeFormik/index.tsx";
import * as Yup from "yup";
import CTA from "@/components/buttons/cta.tsx";
import Plus from "$tabler/plus.tsx";
import Trash from "$tabler/trash.tsx";
import ChevronDown from "$tabler/chevron-down.tsx";
import { StateUpdater, useState } from "preact/hooks";
import { Toggle } from "@/components/buttons/toggle.tsx";

export default function StageTwo({
  eventState,
  setPage,
}: {
  eventState: Signal<Event>;
  setPage: StateUpdater<number>;
}) {
  const { multiEntry, maxTickets, additionalFields } = eventState.value;
  const [fields, setFields] = useState<Field[]>([
    {
      name: "",
      description: "",
      id: crypto.randomUUID(),
      type: "text",
    },
  ]);
  const [mEntry, setMEntry] = useState(multiEntry);

  const addField = () => {
    setFields((f) => [
      ...f,
      {
        name: "",
        description: "",
        id: crypto.randomUUID(),
        type: "text",
      },
    ]);
  };

  const removeField = (id: string) => {
    setFields((f) => f.filter((field) => field.id != id));
  };

  const updateField = (update: Partial<Field>) => {
    setFields((f) =>
      f.map((field) => {
        if (field.id != update.id) return field;
        return {
          ...field,
          ...update,
        };
      })
    );
  };

  const FieldInput = ({ field }: { field: Field }) => {
    return (
      <div className="flex justify-between items-center mt-4" key={field.id}>
        <div class="flex flex-col">
          <input
            placeholder="Input Name"
            type="text"
            class="nostyle border-b-2 border-dashed w-64"
            value={fields.find((f) => f.id == field.id)?.name}
            onChange={(e) =>
              updateField({ id: field.id, name: e.currentTarget.value })
            }
          />
          <input
            placeholder="Optional description"
            type="text"
            class="nostyle border-b-2 border-dashed text-sm mt-2 w-80"
            value={fields.find((f) => f.id == field.id)?.description}
            onChange={(e) =>
              updateField({ id: field.id, description: e.currentTarget.value })
            }
          />
        </div>
        <div className="flex gap-2">
          <div>
            <button className="rounded-md border border-gray-300 font-medium text-gray-500 pl-2 bg-gray-100 flex items-center">
              {field.type} <ChevronDown class="w-4 h-4 ml-1 mr-1" />
            </button>
						
          </div>
          <button
            className="rounded-md border border-red-300 font-medium text-red-500 grid place-items-center w-7 h-7 bg-red-100"
            onClick={() => removeField(field.id)}
          >
            <Trash class="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <div class="flex flex-col gap-4">
        <section className="flex flex-col md:flex-rows gap-4 grow">
          <Toggle
            name="Allow Multi-Entry"
            description="Allow attendees to enter multiple times on the same ticket"
            setEnabled={setMEntry}
            enabled={mEntry}
          />
          <label htmlFor="" class="flex flex-col md:w-44s">
            <p className="label-text">Maximum Attendees</p>
            <input
              type="number"
              class="p-2 border rounded-md border-gray-300"
              pattern="\d*"
            />
          </label>
        </section>
        <h3 class="font-medium text-center -mb-4 mt-4">Additional Inputs</h3>
        <p class="text-center text-sm">
          These are the fields that users must input when they register for an
          event. We require a name and email by default.{" "}
        </p>
        <section>
          <h4 class="text-sm font-medium">Required Inputs</h4>
          <div className="flex justify-between items-center">
            <p>name</p>
            <p className="rounded-md border border-gray-300 font-medium text-gray-500 px-2 bg-gray-100">
              text
            </p>
          </div>
          <div className="flex justify-between items-center mt-2">
            <p>email</p>
            <p className="rounded-md border border-gray-300 font-medium text-gray-500 px-2 bg-gray-100">
              email
            </p>
          </div>
        </section>
        <section>
          <h4 class="text-sm font-medium">Additional Inputs</h4>
          {fields.map((field) => (
            <FieldInput field={field} />
          ))}
          <button
            className="flex font-medium text-gray-500 hover:text-gray-600 transition  items-center cursor-pointer py-1 group w-full"
            onClick={addField}
          >
            <div className="grow h-0.5 bg-gray-300" />
            <div class="mx-2 flex items-center">
              Add field <Plus class="h-4 w-4 ml-2 group-hover:scale-110" />
            </div>
            <div className="grow h-0.5 bg-gray-300" />
          </button>
        </section>
        <div className="flex justify-between mt-6">
          <CTA
            btnType="secondary"
            btnSize="sm"
            className="!w-20 md:!w-40"
            type="button"
            onClick={() => setPage(1)}
          >
            Back
          </CTA>
          <CTA
            btnType="cta"
            btnSize="sm"
            className="!w-20 md:!w-40"
            onClick={() => {}}
          >
            Next
          </CTA>
        </div>
      </div>
    </>
  );
}
