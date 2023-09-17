import { getUser } from "@/utils/db/kv.ts";

export default async function Homepage(req: Request) {
	const user = await getUser(req); 

	return <>
		<h1>Hi mom</h1>
	</>
}