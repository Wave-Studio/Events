import { kv, Event, Ticket, ShowTime } from "@/utils/db/kv.ts";
import { sendEmail } from "@/utils/email/client.ts";

// const cronTask = async () => {
// 	const events = kv.list<Event>({ prefix: ["event"] });

// 	for await (const event of events) {
// 		const showtimes = event.value.showTimes
// 			.filter((s) => !s.hasEmailed)
// 			.sort(
// 				(a, b) =>
// 					new Date(a.startDate).valueOf() -
// 					new Date(b.startDate).valueOf(),
// 			);

// 		const showtimesStartingIn24Hours = showtimes.filter(
// 			(showtime) =>
// 				new Date(showtime.startDate).valueOf() - Date.now() <
// 				24 * 60 * 60 * 1000,
// 		);

// 		if (showtimesStartingIn24Hours.length > 0) {
// 			await kv.enqueue(
// 				JSON.stringify({
// 					event,
// 					showtimesStartingIn24Hours,
// 					eventID: event.key[1],
// 				}),
// 			);
// 		}
// 	}
// };

// cronTask();

// // Deno.cron("check emails", "0 */4 * * *", cronTask);

// kv.listenQueue(async (msg) => {
// 	const message = JSON.parse(msg) as
// 		| {
// 				eventID: string;
// 				event: Event;
// 				showtimesStartingIn24Hours: Event["showTimes"];
// 		  }
// 		| {
// 				eventID: string;
// 				event: Event;
// 				showtime: ShowTime;
// 				cursor: string;
// 		  };

// 	if ("showtimesStartingIn24Hours" in message) {
// 		let delay = 0;

// 		for (const showtime of message.showtimesStartingIn24Hours) {
// 			await kv.set(["event", message.eventID], {
// 				...message.event,
// 				showTimes: message.event.showTimes.map((s) =>
// 					s.id === showtime.id ? { ...s, hasEmailed: true } : s,
// 				),
// 			});
// 			await kv.enqueue(
// 				JSON.stringify({
// 					eventID: message.eventID,
// 					event: message.event,
// 					showtime,
// 				}),
// 				{
// 					delay: delay,
// 				},
// 			);

// 			delay += 1000 + Math.random() * 3000;
// 		}
// 	} else {
// 		await startEmails(
// 			message.eventID,
// 			message.event,
// 			message.showtime,
// 			message.cursor,
// 		);
// 	}
// });

// const startEmails = async (
// 	eventID: string,
// 	event: Event,
// 	showtime: ShowTime,
// 	cursor?: string,
// ) => {
// 	const tickets = kv.list<Ticket>(
// 		{ prefix: ["ticket", eventID, showtime.id] },
// 		{ cursor, limit: 18 },
// 	);

// 	for await (const ticket of tickets) {
// 		console.log("Sending email to", ticket.value.userEmail);
// 	}

// 	if (tickets.cursor) {
// 		await kv.enqueue(
// 			JSON.stringify({
// 				eventID,
// 				event,
// 				showtime,
// 				cursor: tickets.cursor,
// 			}),
// 			{ delay: 1000 },
// 		);
// 	}
// };

// Handle temporary email notifications

const ticketHTML = await Deno.readTextFile("./out/event.html");

kv.listenQueue(async (msg) => {
	const data = msg as {
		action: "sendEmail";
		payload: {
			to: string;
			code: string;
			eventID: string;
			tickets: number;
			eventName: string;
		};
	};

	const { eventID, code, tickets, eventName } = data.payload;

	const [_, showtimeID, ticketID] = code.split("_");

	switch (data.action) {
		case "sendEmail": {
			const emailHTML = ticketHTML
				.replace("{{TICKETS}}", tickets.toString())
				.replaceAll(
					"{{QR-VALUE}}",
					`https://events.deno.dev/api/qr?ticket=${code}`,
				)
				.replaceAll(
					"{{TICKET-LINK}}",
					`https://events.deno.dev/events/${eventID}/tickets/${ticketID}?s=${showtimeID}`,
				)
				.replace(
					"{{EVENT-LINK}}",
					`https://events.deno.dev/events/${eventID}`,
				)
				.replace("Tickets for the {{EVENT-NAME}} event!", `Your tickets for {{EVENT-NAME}} next week!`)
				.replaceAll("{{EVENT-NAME}}", eventName);

			await sendEmail([data.payload.to], `Your Tickets for ${eventName} next week!`, {
				html: emailHTML,
				fallback: `1 Week until ${eventName}! \nView your ticket at https://events.deno.dev/events/${eventID}/tickets/${ticketID}?s=${showtimeID}`,
			})

			break;
		}
	}
});
