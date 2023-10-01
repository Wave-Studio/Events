import { Handlers } from "$fresh/server.ts";
// @deno-types="npm:@types/imagekit"
import ImageKit from "imagekit";
import { encode } from "$std/encoding/base64.ts";

const imageKit = new ImageKit({
  publicKey: Deno.env.get("IMAGEKIT_PUBLIC_KEY")!,
  privateKey: Deno.env.get("IMAGEKIT_PRIVATE_KEY")!,
  urlEndpoint: Deno.env.get("IMAGEKIT_URL_ENDPOINT")!,
});

export const handler: Handlers = {
  async POST(req, _ctx) {
    const { file, name }: { file: string; name: string } = await req.json();

    console.log("Uploading", name);

    const reqs = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
      body: JSON.stringify({
        file: file,
        fileName: `${name}.png`,
      }),
      headers: {
        Authorization: `Basic ${encode(
          `${Deno.env.get("IMAGEKIT_PRIVATE_KEY")}:`,
        )}`,
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    const img = await reqs.json();

    console.log("Uploaded", img);

    return new Response(
      JSON.stringify({ error: "Lukas was too lazy to finish this - Bloxs" }),
      {
        status: 400,
      },
    );
  },
};
