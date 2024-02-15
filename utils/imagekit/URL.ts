import imagekit from "@/utils/imagekit/index.ts";

export const getURL = (width: number, path: string) =>
["png", "webp"].map((fmt) =>
	imagekit!.url({
		path,
		transformation: [
			{
				width: width.toString(),
				quality: "85",
				format: fmt,
			},
		],
	}),
);
