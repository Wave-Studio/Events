import { Field, ShowTime, Ticket } from "@/utils/db/kv.types.ts";
import { fmtDate, fmtHour } from "@/utils/dates.ts";

export default function ExportTicketData({
  tickets,
  fields,
  showTimes,
  selectedShowTime,
}: {
  // showtimeID, ticketID, ticket
  tickets: [string, string, Ticket][];
  fields: Field[];
  showTimes: ShowTime[];
  selectedShowTime: string;
}) {
  const exportTickets = (showtime?: string) => {
    const filteredTickets = tickets.filter(
      ([showtimeID]) => showtime == undefined || showtimeID === showtime,
    );

    // Use “ in replacement for " to avoid breaking csv

    const data = [
      [
        "Showtime",
        "Ticket ID",
        "Email",
        "Last Name",
        "First Name",
        "Acquired Tickets",
        "Ticket Uses",
        ...fields.map((f) => `${f.name} (${f.id})`),
      ]
        .map((v) => `"${v.replace(/"/g, "“")}"`)
        .join(","),
      ...filteredTickets.map(([showtimeID, ticketID, ticket]) => {
        const showtime = showTimes.find((st) => st.id === showtimeID)!;

        const showtimeDateFormatted = `${fmtDate(
          new Date(showtime.startDate),
        )} ${
          showtime.startTime
            ? `at ${fmtHour(new Date(showtime.startTime)).toLowerCase()}`
            : ""
        }`.trim();

        return [
          `${showtimeDateFormatted} (${showtimeID})`,
          ticketID,
          ticket.userEmail,
          ticket.lastName,
          ticket.firstName,
          ticket.tickets,
          ticket.uses,
          ...fields.map((f) => {
            const data = ticket.fieldData.find((fd) => fd.id === f.id)?.value;

            return data ?? "null";
          }),
        ]
          .map((v) => `"${v.toString().replace(/"/g, "“")}"`)
          .join(",");
      }),
    ].join("\n");

    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/csv;charset=utf-8," + encodeURIComponent(data),
    );
    element.setAttribute(
      "download",
      `Events Ticket Data - ${
        showtime == undefined ? "All Showtimes" : showtime
      }.csv`,
    );

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          console.log(
            exportTickets(
              selectedShowTime == "0" ? undefined : selectedShowTime,
            ),
          );
        }}
        class="rounded-md bg-gray-200 h-8 grid place-content-center px-2 font-medium hover:brightness-95 transition"
      >
        .csv Export
      </button>
    </>
  );
}
