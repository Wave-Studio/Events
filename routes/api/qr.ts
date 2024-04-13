import { Handlers } from "$fresh/server.ts";
import { isTicketUUID } from "@/utils/db/misc.ts";
/// <deno-types imports="npm:@types/qrcode" />
import qr from "npm:qrcode";

export const handler: Handlers = {
	async GET(req, _ctx) {
		const url = new URL(req.url);
		const search = url.searchParams;
		const ticket = search.get("ticket");

		if (ticket == undefined) {
			return new Response(JSON.stringify({ error: "No ticket provided" }), {
				status: 400,
			});
		}

		if (isTicketUUID(ticket)) {
			const qrcode = await qr.toBuffer(ticket, {
				color: {
					light: "#f3f4f6",
				},
			});

			return new Response(qrcode, {
				headers: {
					"Content-Type": "image/png",
				},
			});
		}

		return new Response(JSON.stringify({ error: "No ticket provided" }), {
			status: 400,
		});
	},
};
