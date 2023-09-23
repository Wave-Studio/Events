
import { useState } from "preact/hooks";
import StageOne from "@/islands/events/zero.tsx";
import { Event, defaultEvent } from "@/utils/db/kv.types.ts";
import { getUser } from "@/utils/db/kv.ts";
import { signal } from "@preact/signals";
import StageTwo from "@/islands/events/two.tsx";

export default async function Create(req: Request) {
	const user = await getUser(req);
	
	if (user == undefined) {
    return new Response(undefined, {
      headers: {
        Location: "/login",
      },
      status: 307,
    });
  }

	const eventData = signal<Event>(defaultEvent(user.email));
	const page = signal(0)

	return (
		<div>
			{page.value == 0 &&
			<StageOne state={eventData} page={page} />}
			<StageTwo state={eventData} />
		</div>
	)
}
