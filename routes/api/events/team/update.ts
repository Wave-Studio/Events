import { Handlers } from "$fresh/server.ts";
import { Event, getUser, kv, Roles } from "@/utils/db/kv.ts";
import { isUUID } from "@/utils/db/misc.ts";

export const handler: Handlers = {
	async POST(req, _ctx) {
		const user = await getUser(req);
		if (!user) {
			return new Response(JSON.stringify({ error: "Not logged in" }), {
				status: 401,
			});
		}

		const {
			eventID,
			email,
			role,
		}: { eventID: string; email: string; role: Roles } = await req.json();

		if (!email) {
			return new Response(JSON.stringify({ error: "Missing email" }), {
				status: 400,
			});
		}

		if (!isUUID(eventID)) {
			return new Response(JSON.stringify({ error: "Invalid UUID" }), {
				status: 400,
			});
		}

		const event = await kv.get<Event>(["event", eventID]);

		if (!event.value) {
			return new Response(JSON.stringify({ error: "Event not found" }), {
				status: 404,
			});
		}

		const member = event.value.members.find((m) => m.email == user.email);

		if (!member) {
			return new Response(
				JSON.stringify({ error: "Not a member of this event" }),
				{
					status: 403,
				},
			);
		}

		if (event.value.members.find((m) => m.email == email) == undefined) {
			return new Response(
				JSON.stringify({ error: "User not a member of this event!" }),
				{
					status: 409,
				},
			);
		}

		if (member.role > role) {
			return new Response(
				JSON.stringify({ error: "Cannot make someone a higher role than you" }),
				{
					status: 403,
				},
			);
		}

		if (![Roles.OWNER, Roles.ADMIN, Roles.MANAGER].includes(member.role)) {
			return new Response(JSON.stringify({ error: "Missing permissions!" }), {
				status: 403,
			});
		}

		await kv.set(["event", eventID], {
			...event.value,
			members: [
				...event.value.members.map((m) =>
					m.email == email
						? { ...m, role }
						: role == Roles.OWNER && m.email == user.email
							? { ...m, role: Roles.ADMIN }
							: m,
				),
			],
		});

		return new Response(JSON.stringify({ success: true }), {
			status: 200,
		});
	},
};
