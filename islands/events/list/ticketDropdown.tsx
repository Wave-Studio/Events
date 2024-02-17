import Dropdown from "@/islands/components/pickers/dropdown.tsx";
import DotsVertical from "$tabler/dots-vertical.tsx";
import { Field, Ticket } from "@/utils/db/kv.types.ts";

export default function TicketDropdown({
  ticketID,
  showtime,
  value,
  fields,
}: {
  ticketID: string;
  showtime: string;
  value: Ticket;
  fields: Field[];
}) {
  return (
    <Dropdown
      options={[
        {
          content: "See Ticket",
          link: `./tickets/${ticketID}?s=${showtime}`,
        },
        {
          content: "Delete Ticket",
        },
        {
          content: "View Additional Responses",
          onClick: () => {
            const formattedObject: {
              type: string;
              prompt: string;
              value: unknown;
            }[] = [];

            for (const field of fields) {
              const object: {
                type: string;
                prompt: string;
                value: unknown;
              } = {
                type: field.type,
                prompt: field.name,
                value: undefined,
              };

              for (const response of value.fieldData) {
                if (response.id === field.id) {
                  object.value = response.value;
                  break;
                }
              }

              formattedObject.push(object);
            }

            console.log(formattedObject);
          },
        },
      ]}
    >
      <div
        className={`w-8 grid place-items-center border h-8 rounded-md hover:bg-gray-200 transition`}
      >
        <DotsVertical class="h-5 w-5" />
      </div>
    </Dropdown>
  );
}
