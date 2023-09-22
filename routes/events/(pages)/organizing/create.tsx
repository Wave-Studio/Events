
import { useState } from "preact/hooks";
import StageOne from "@/islands/events/one.tsx";
import { Event, defaultEvent } from "@/utils/db/kv.types.ts";
import { getUser } from "@/utils/db/kv.ts";

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

	const [eventData, setEventData] = useState<Event>(defaultEvent(user.email));

	return (
		<div>
			<StageOne  />
		</div>
	)
}
