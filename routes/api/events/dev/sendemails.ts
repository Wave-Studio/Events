import { Handlers } from "$fresh/server.ts";
import { Event, getUser, kv, Ticket } from "@/utils/db/kv.ts";
import { isUUID } from "@/utils/db/misc.ts";

export const handler: Handlers = {
	async POST(req, _ctx) {
		const user = await getUser(req);
		if (!user) {
			return new Response(JSON.stringify({ error: "Not logged in" }), {
				status: 401,
			});
		}

		const allowedEmails = JSON.parse(Deno.env.get("ALLOWED_EMAILS") ?? "[]");

		if (!allowedEmails.includes(user.email)) {
			return new Response(JSON.stringify({ error: "Not authorized" }), {
				status: 401,
			});
		}

		const { eventID, showtimeID }: { eventID: string; showtimeID: string } =
			await req.json();

		if (!isUUID(eventID) || !isUUID(showtimeID)) {
			return new Response(JSON.stringify({ error: "Invalid UUID" }), {
				status: 400,
			});
		}

		const event = await kv.get<Event>(["event", eventID]);

		if (!event || !event.value) {
			return new Response(JSON.stringify({ error: "Invalid event ID" }), {
				status: 400,
			});
		}

		const showtime = event.value.showTimes.find((s) => s.id === showtimeID);

		if (!showtime) {
			return new Response(JSON.stringify({ error: "Invalid showtime ID" }), {
				status: 400,
			});
		}

		const getAllTickets = async () => {
			const ticketsList = kv.list<Ticket>({
				prefix: ["ticket", eventID, showtimeID],
			});

			const tickets: [string, Ticket][] = [];

			for await (const ticket of ticketsList) {
				tickets.push([ticket.key[3] as string, ticket.value]);
			}

			return tickets;
		};

		const tickets = await getAllTickets();

		let delayInEmailSendSeconds = 1;
		let emailsSent = 0;

		for (const [ticketID, ticket] of tickets) {
			emailsSent += 1;
			kv.enqueue(
				{
					action: "sendEmail",
					payload: {
						to: ticket.userEmail,
						code: ticketID,
						eventID: eventID,
						tickets: ticket.tickets,
						eventName: event.value.name,
					},
				},
				{
					delay: delayInEmailSendSeconds * 1000,
				},
			);

			delayInEmailSendSeconds += 1;
		}

		return new Response(JSON.stringify({ success: true, amount: emailsSent }), {
			status: 200,
		});
	},
};
