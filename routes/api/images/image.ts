import { Handlers } from "$fresh/server.ts";
import ImageKit from "imagekit";

export const handler: Handlers = {
	async POST(req, ctx) {
		const imageKit = new ImageKit({
			publicKey: Deno.env.get("IMAGEKIT_PUBLIC_KEY")!,
			privateKey: Deno.env.get("IMAGEKIT_PRIVATE_KEY")!,
			urlEndpoint: Deno.env.get("IMAGEKIT_URL_ENDPOINT")!,
		});

		const image = await imageKit.upload({
			file: "todo",
			fileName: "EventIcon",
			
		})

		return new Response("a");
	}
}