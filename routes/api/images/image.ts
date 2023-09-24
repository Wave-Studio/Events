import { Handlers } from "$fresh/server.ts";
// @deno-types="npm:@types/imagekit"
import ImageKit from "imagekit";
import { encode } from "$std/encoding/base64.ts"

const imageKit = new ImageKit({
	publicKey: Deno.env.get("IMAGEKIT_PUBLIC_KEY")!,
	privateKey: Deno.env.get("IMAGEKIT_PRIVATE_KEY")!,
	urlEndpoint: Deno.env.get("IMAGEKIT_URL_ENDPOINT")!,
});

export const handler: Handlers = {
	async POST(req, ctx) {
		const { file, name }: {file: File, name: string} = await req.json()

		const image = encode(await file.arrayBuffer())

		imageKit.upload({
			file: image,
			fileName: name,
		}, (err, res) => {
			if (err) {
				return new Response(JSON.stringify({ error: "Invalid OTP" }), {
					status: 400,
				});
			}
		})

		return new Response(JSON.stringify({ error: "Lukas was too lazy to finish this - Bloxs" }), {
			status: 400,
		});
	}
}