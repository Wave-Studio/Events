import { kv, Event, Ticket, ShowTime } from "@/utils/db/kv.ts";

const cronTask = async () => {
	const events = kv.list<Event>({ prefix: ["event"] });

	for await (const event of events) {
		const showtimes = event.value.showTimes
			.filter((s) => !s.hasEmailed)
			.sort(
				(a, b) =>
					new Date(a.startDate).valueOf() -
					new Date(b.startDate).valueOf(),
			);

		const showtimesStartingIn24Hours = showtimes.filter(
			(showtime) =>
				new Date(showtime.startDate).valueOf() - Date.now() <
				24 * 60 * 60 * 1000,
		);

		if (showtimesStartingIn24Hours.length > 0) {
			await kv.enqueue(
				JSON.stringify({
					event,
					showtimesStartingIn24Hours,
					eventID: event.key[1],
				}),
			);
		}
	}
};

cronTask();

// Deno.cron("check emails", "0 */4 * * *", cronTask);

kv.listenQueue(async (msg) => {
	const message = JSON.parse(msg) as
		| {
				eventID: string;
				event: Event;
				showtimesStartingIn24Hours: Event["showTimes"];
		  }
		| {
				eventID: string;
				event: Event;
				showtime: ShowTime;
				cursor: string;
		  };

	if ("showtimesStartingIn24Hours" in message) {
		let delay = 0;

		for (const showtime of message.showtimesStartingIn24Hours) {
			await kv.set(["event", message.eventID], {
				...message.event,
				showTimes: message.event.showTimes.map((s) =>
					s.id === showtime.id ? { ...s, hasEmailed: true } : s,
				),
			});
			await kv.enqueue(
				JSON.stringify({
					eventID: message.eventID,
					event: message.event,
					showtime,
				}),
				{
					delay: delay,
				},
			);

			delay += 1000 + Math.random() * 3000;
		}
	} else {
		await startEmails(
			message.eventID,
			message.event,
			message.showtime,
			message.cursor,
		);
	}
});

const startEmails = async (
	eventID: string,
	event: Event,
	showtime: ShowTime,
	cursor?: string,
) => {
	const tickets = kv.list<Ticket>(
		{ prefix: ["ticket", eventID, showtime.id] },
		{ cursor, limit: 18 },
	);

	for await (const ticket of tickets) {
		console.log("Sending email to", ticket.value.userEmail);
	}

	if (tickets.cursor) {
		await kv.enqueue(
			JSON.stringify({
				eventID,
				event,
				showtime,
				cursor: tickets.cursor,
			}),
			{ delay: 1000 },
		);
	}
};
