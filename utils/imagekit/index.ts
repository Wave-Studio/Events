// @deno-types="npm:@types/imagekit"
import ImageKit from "imagekit";

const isImagekitEnabled = Deno.env.get("IMAGEKIT_PUBLIC_KEY") != undefined;

export default isImagekitEnabled
  ? new ImageKit({
      publicKey: Deno.env.get("IMAGEKIT_PUBLIC_KEY")!,
      privateKey: Deno.env.get("IMAGEKIT_PRIVATE_KEY")!,
      urlEndpoint: Deno.env.get("IMAGEKIT_URL_ENDPOINT")!,
    })
  : undefined;
