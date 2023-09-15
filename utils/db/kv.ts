import { Event, Ticket, User } from "./kv.d.ts";
import { getCookies, deleteCookie } from "$std/http/cookie.ts";

export * from "./kv.d.ts";

export const kv = await Deno.openKv(
  Deno.env.get("DENO_DEPLOYMENT_ID") == undefined
    ? "./db/db.sqlite"
    : undefined,
);

export const getUser = async (req: Request) => {
	const cookies = getCookies(req.headers);
	const authToken = cookies.authToken;

	if (authToken == undefined) return undefined;

	const [email] = authToken.split("_");
	const user = await kv.get<User>(["user", email]);

	if (user.value == undefined) {
		deleteCookie(req.headers, "authToken", {
			path: "/",
		});
		return undefined;
	}

	if (user.value.authToken != authToken) {
		deleteCookie(req.headers, "authToken", {
			path: "/",
		});
		return undefined;
	}

	return user.value;
}