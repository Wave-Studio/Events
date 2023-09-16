import { Handlers } from "$fresh/server.ts";

export const handler: Handlers<{ email: string, otp: string }> = {
	async GET(req, ctx) {
		const emailRegex= /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/i;

		if (!emailRegex.test(ctx.params.email ?? "")) {
			return new Response(JSON.stringify({ error: "Invalid email" }), { status: 400 });
		}

		const allowedEmails = JSON.parse(Deno.env.get("ALLOWED_EMAILS") ?? "[]");
		
		if (!allowedEmails.includes(ctx.params.email)) {
			return new Response(JSON.stringify({ error: "Email not allowed" }), { status: 400 });
		}

		const otp = crypto.getRandomValues(new Uint8Array(1));

		return new Response("Hello World");
	}
};