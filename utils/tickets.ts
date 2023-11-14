import { User } from "@/utils/db/kv.ts";

export const acquired = (
  user: User | undefined,
  eventID: string,
  showtimeID: string,
) => {
  if (!user) return false;
  if (
    user.tickets.some(
      (ticket) =>
        ticket.split("_")[0] == eventID && ticket.split("_")[1] == showtimeID,
    )
  ) {
    return true;
  }
  return false;
};

export const getTicketID = (
  user: User | undefined,
  eventID: string,
  showtimeID: string,
) => {
  if (!user) return undefined;

  const ticket = user.tickets.find(
    (ticket) =>
      ticket.split("_")[0] == eventID && ticket.split("_")[1] == showtimeID,
  );

  if (ticket) {
    return ticket.split("_")[2];
  }

  return undefined;
};
