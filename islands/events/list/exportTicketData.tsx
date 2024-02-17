import { Field, Ticket } from "@/utils/db/kv.types.ts";

export default function ExportTicketData({
  tickets,
  fields,
}: {
  tickets: [string, Ticket][];
  fields: Field[];
}) {
  const exportTickets = (showtime?: string) => {
    const filteredTickets = tickets.filter(([showtimeID]) =>
      showtime == undefined || showtimeID === showtime
    );

    // Use “ in replacement for " to avoid breaking csv

    const data = [
      `"Showtime ID","Ticket ID","Email","Last Name","First Name","Acquired Tickets","Ticket Uses"${
        fields.length > 0
          ? `,"${fields.map((f) => `"${f.name.replace(/"/g, "“")}"`).join(",")}`
          : ""
      }`,
    ];
  };

  return (
    <>
      <button type="button">Exeporte zee tix</button>
    </>
  );
}
