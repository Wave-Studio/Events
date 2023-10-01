const imageKit = new ImageKit({
  publicKey: Deno.env.get("IMAGEKIT_PUBLIC_KEY")!,
  privateKey: Deno.env.get("IMAGEKIT_PRIVATE_KEY")!,
  urlEndpoint: Deno.env.get("IMAGEKIT_URL_ENDPOINT")!,
});

export default imageKit