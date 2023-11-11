import Ticket from "@/islands/peices/ticket.tsx";

export default function ViewTicket() {
  const ticket = `${crypto.randomUUID()}_${crypto.randomUUID()}_${crypto.randomUUID()}`;

  return (
    <>
      <Ticket
        id={ticket}
        tickets={1}
        showTime={{
          id: crypto.randomUUID(),
          maxTickets: 1,
          multiPurchase: false,
          soldTickets: 69420,
          startDate: new Date().toString(),
        }}
      />
    </>
  );
}