import { Event, Ticket, User, AuthCode } from "./kv.d.ts";
import { getCookies, deleteCookie, setCookie } from "$std/http/cookie.ts";

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
	const user = await kv.get<User>(["user", btoa(email)]);

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

export const getUserEmailCode = async (email: string, authCode: string, req: Request) => {
	const [authCodeData, user] = await kv.getMany<[AuthCode, User]>([["authCode", authCode, email], ["user", email]]);

	if (authCodeData.value == undefined) return undefined;
	if (user.value == undefined) return undefined;

	setCookie(req.headers, {
		name: "authToken",
		expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
		value: user.value.authToken,
		path: "/",
	});

	return user.value;
}

export const createCode = async (email: string, authCode: string) => {
	const [authCodeData, user] = await kv.getMany<[AuthCode, User]>([["authCode", authCode, email], ["user", email]]);

	if (authCodeData.value == undefined) return undefined;
	if (user.value == undefined) return undefined;


	return user.value;
}