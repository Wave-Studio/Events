import { getUser } from "@/utils/db/kv.ts";
import CreateEvent from "../../../../islands/events/creation/createForm.tsx";

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

	return <CreateEvent user={user} />;
}
