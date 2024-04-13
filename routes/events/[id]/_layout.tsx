import { defineLayout } from "$fresh/server.ts";
import { Event, getUser, kv, Roles, User } from "@/utils/db/kv.ts";
import CTA from "@/components/buttons/cta.tsx";
import { isUUID } from "@/utils/db/misc.ts";
import { router } from "$fresh/src/server/router.ts";

export const badEventRequest = new Response(undefined, {
	headers: {
		Location: "/events/notfound",
	},
	status: 307,
});

export default defineLayout(async (req, ctx) => {
	const eventID = ctx.params.id;

	if (!isUUID(eventID)) {
		return badEventRequest;
	}

	const event = await kv.get<Event>(["event", eventID]);

	if (!event || !event.value) {
		return badEventRequest;
	}

	const user = await getUser(req);

	if (!user) {
		(ctx.state as EventContext).data = { event: event.value, eventID };
	} else {
		const role: Roles | undefined = event.value.members.find(
			(m) => m.email === user!.email,
		)?.role;
		if (role == undefined) {
			(ctx.state as EventContext).data = {
				event: event.value,
				eventID,
				user: { data: user },
			};
		} else {
			(ctx.state as EventContext).data = {
				event: event.value,
				eventID,
				user: { data: user, role },
			};
		}
	}

	return (
		<>
			<ctx.Component />
		</>
	);
});

export interface EventContext {
	data: {
		event: Event;
		eventID: string;
		user?: {
			data: User;
			role?: Roles;
		};
	};
}
