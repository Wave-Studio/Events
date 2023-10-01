import { Handlers } from "$fresh/server.ts";
// @deno-types="npm:@types/imagekit"
import ImageKit, { UploadResponse } from "imagekit";
import { Event, getUser, kv } from "@/utils/db/kv.ts";
import { isUUID } from "@/utils/db/misc.ts";
import imageKit from "@/utils/imagekit.ts";

export const handler: Handlers = {
  async POST(req, _ctx) {
    const user = await getUser(req);
    if (!user) {
      return new Response(JSON.stringify({ error: "Not logged in" }), {
        status: 401,
      });
    }

    const { file, eventID }: { file: string; eventID: string } =
      await req.json();

    if (!isUUID(eventID)) {
      return new Response(JSON.stringify({ error: "Invalid UUID" }), {
        status: 400,
      });
    }

    const event = await kv.get<Event>(["event", eventID]);

    if (
      !event ||
      !event.value ||
      // checks owner, probably unnessesary
      !event.value.members.some((e) => e.email == user.email && e.role == 0) ||
      // prevent people from uploading multiple things at the same time -LS
      event.value.banner.uploading == true
    ) {
      return new Response(JSON.stringify({ error: "Invalid event ID" }), {
        status: 400,
      });
    }

    // prevent people from uploading multiple things at the same time, may waste db write/egress but idk, probably good to have -LS
    await kv.set(["event", eventID], {
      ...event.value,
      banner: {
        ...event.value.banner,
        uploading: true,
      },
    } as Event);

    const promises: [UploadResponse, void?] = [
      await imageKit.upload({
        file,
        fileName: eventID,
      }),
    ];

    if (event.value.banner.id) {
      promises.push(await imageKit.deleteFile(event.value.banner.id));
    }

    let res: UploadResponse | undefined = undefined;

    try {
      const response = await Promise.all(promises);
      res = response[0];
    } catch {
      return new Response(
        JSON.stringify({
          error: "An error was returned while uploading your image",
        }),
        {
          status: 400,
        },
      );
    }

    await kv.set(["event", eventID], {
      ...event.value,
      banner: {
        ...event.value.banner,
        id: res.fileId,
        path: res.filePath,
        uploading: false
      },
    } as Event);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });
  },
};
